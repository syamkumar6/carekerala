/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import HospitalCarousel from "../../Components/Carousels/HospitalCarousel";
import styles from "./SingleHospital.module.css";
import locationIcon from "../../assets/locationIcon.svg";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addHospital } from "../../Redux/Features/BookingSlice";
import { addAuthDetails, addUserAuth } from "../../Redux/Features/AuthSlice";

import DoctorsCard2 from "../../Components/Cards/DoctorsCard2";
import Accordion from "../../Components/HospitelPage/Accordion";
import UserReviewCard from "../../Components/Cards/UserReviewCard";

import arrow from "../../assets/arrow-right.svg";
import callIcon from "../../assets/call.svg"
import arrowLeft from "../../assets/arrow-left.svg";

export async function loader({ params }) {
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/hospitals/` + params.hospitalId);
  const reviewsRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/reviews/` + params.hospitalId);
  const hospital = res.data;
  const reviewsdata = reviewsRes.data
  return { hospital,reviewsdata };
}

function SingleHospital() {
  const { hospital,reviewsdata } = useLoaderData();
  const [reviews, setReviews] = useState(reviewsdata)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.authDetails);
  const [open, setopen] = useState(false);
  const [userReview, setUserReview] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const doctorOptions = hospital.doctors.map((doctor) => ({id:doctor._id, name:doctor.name}))

  useEffect(() => {
    dispatch(addHospital(hospital));
    axios.defaults.withCredentials = true
        axios.post(`${import.meta.env.VITE_BASE_URL}/users/verify`)
          .then(res => {
              if(res.data.Status === "Verify-Success") {
                dispatch(addUserAuth(true))
                dispatch(addAuthDetails(res.data.user))
              }else{
                alert(res.data.Meassage)
              }
          })
  }, []);

  const [visibleItems, setVisibleItems] = useState(3);

  const handleShowMore = () => {
    setVisibleItems(reviews?.length);
  };

  const handleShowLess = () => {
    setVisibleItems(3);
  };

  const CustomPrevArrow = (props) => (
    <div
      className={`${styles.customArrow} ${styles.prevArrow}`}
      onClick={props.onClick} >
      <img src={arrowLeft} alt="" />
    </div>
  );

  const CustomNextArrow = (props) => (
    <div
      className={`${styles.customArrow} ${styles.nextArrow}`}
      onClick={props.onClick}>
      <img src={arrow} alt="" />
    </div>
  );
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  const handleRequest = () => {
    axios.defaults.withCredentials = true;
    axios.post(`${import.meta.env.VITE_BASE_URL}/doctors/request/` + hospital._id)
      .then(() => {
        sendRequestToHospital();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const sendRequestToHospital = () => {
    document.getElementById("joinButton").disabled = true;
    axios.defaults.withCredentials = true;
    axios.post(`${import.meta.env.VITE_BASE_URL}/hospitals/dashboard/handle-request/` +user.id)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    try {
      if (!user) {
        toast.error("Please login before submitting a review");
         setUserReview("");
         return 
      }
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const data = {
        review: userReview,
        user: user.id,
        hospital: hospital._id,
        date: formattedDate,
      };
      console.log(data)
      axios.defaults.withCredentials = true;
      axios.post(`${import.meta.env.VITE_BASE_URL}/reviews/users`, data)
        .then((res) => {
          setReviews(res.data.reviews)
          setUserReview("")
          toast.success(res.data.message);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const responsiveSettings = [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ];

  const handleSelectedDoctor = () =>{
    const selectedOptionId = document.getElementById("doctor-name").value;
    const selectedDoctor = doctorOptions.find(option => option.name === selectedOptionId);
    navigate("/doctors/"+selectedDoctor.id)
  }

  const initiateCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <main className={styles.PageContainer}>
      <section className={styles.topSection}>
        <div className={styles.Header}>
          <h1>{hospital.name}</h1>
          <div className={styles.addressDiv}>
            {user?.role === "doctor" &&
              !hospital.doctors.includes(user.id) &&
              !hospital.doctorRequests.includes(user.id) && (
                <button id="joinButton" onClick={handleRequest} className={styles.reqstBtn}>
                  Request to Join{" "}
                </button>
              )}
            <img src={locationIcon} alt="" />
            <span>{hospital.address}</span>
          </div>
        </div>
        <HospitalCarousel data={hospital.carousel} />
        <div className={styles.searchDiv}>
        <input 
        type="text" 
        id="doctor-name" 
        list="doctor-list"
        placeholder="Search Doctors" 
        value={searchValue} //
        onChange={(e) => setSearchValue(e.target.value)}
        />
        <datalist id="doctor-list">
          {doctorOptions.map((option) => (
            <option key={option.id} value={option.name} data-id={option.id}/>
          ))}
        </datalist>
        <button onClick={handleSelectedDoctor}>Search</button>
      </div>
      </section>

      <section className={styles.secondSection}>
        <h2>Overview</h2>
        <div className={open ? null : styles.overviewNote}>
          {hospital.description.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <button onClick={() => setopen(!open)} className={styles.readBtn}>
          {open ? "read less..." : "read more..."}
        </button>
      </section>

      <section className={styles.drSection}>
        <h2>Our Doctors</h2>
        <p>
          We have some of the best specialists from around the world, they bring
          years of experience and offer evidence-based treatment to ensure the
          best care for you.
        </p>
        <Slider {...settings} responsive={responsiveSettings}>
          {hospital.doctors.map((d, index) => {
            return <DoctorsCard2 key={index} data={d} />;
          })}
        </Slider>
      </section>

      <section className={styles.accordionSection}>
        <h2>Advanced Technology & Facilities</h2>
        <p>
          Well equipped with the latest medical equipment, modern technology &
          infrastructure, Aster Hospital is one of the best hospitals in India.
        </p>
        <div>
          <Accordion data={hospital.facilities} />
        </div>
      </section>

      <section className={styles.reviewSection}>
        <h2>What our Patients Are Saying</h2>
        <p>
          Our patients are our best advocates, hear the inspiring stories of
          their treatment journey
        </p>
        <div className={styles.reviewBox}>
          <div className={styles.reviewDiv}>
            <div>
              {reviews?.slice(0, visibleItems).map((d, index) => {
                return <UserReviewCard key={index} data={d} setReviews={setReviews}/>;
              })}
            </div>
            {reviews.length > 3 && (
              <div className={styles.showMoreButton}>
                {visibleItems === 3 ? (
                  <button onClick={handleShowMore}>Show More</button>
                ) : (
                  <button onClick={handleShowLess}>Show Less</button>
                )}
              </div>
            )}
          </div>

          <div className={styles.formDiv}>
            <h3>Add your review</h3>
            <form className={styles.reviewForm}>
              <textarea
                name="userReview"
                id="userReview"
                cols="30"
                rows="10"
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
              ></textarea>
              <button onClick={handleReviewSubmit}>Send</button>
            </form>
          </div>
        </div>
      </section>
      <div className={styles.contactBtn}>
        <button onClick={()=> initiateCall(hospital.phone)}><img src={callIcon} alt="" /></button>
      </div>
    </main>
  );
}

export default SingleHospital;
