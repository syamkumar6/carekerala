/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import styles from "./Doctors.module.css";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import arrowIcon from "../../assets/arrow-right-btn.svg";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addHospital } from "../../Redux/Features/BookingSlice";

export async function loader() {
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors`);
  const doctors = res.data;
  return { doctors };
}

function Doctors() {
  const { doctors } = useLoaderData();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const doctorOptions = doctors.map((doctor) => ({id:doctor._id, name:doctor.name}))

  useEffect(()=> {
    window.scrollTo({
      top: 0,
    })
    dispatch(addHospital(null));
  },[])

  const handleSelectedDoctor = () =>{
    const selectedOptionId = document.getElementById("doctor-name").value;
    const selectedDoctor = doctorOptions.find(option => option.name === selectedOptionId);
    navigate("/doctors/"+selectedDoctor.id)
  }

  const uniqueDistricts = [
    ...new Set(doctors.map((hospital) => hospital.district)),
  ];

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
  };

  const filteredDoctors =
    selectedDistrict === "All"
      ? doctors
      : doctors.filter((doctor) => doctor.district === selectedDistrict);
  return (
    <div>
      <div className={styles.sectionHeader}>
        <div className={styles.flexRow2}>
          <h2>Doctors</h2>
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
                <option
                  key={option.id}
                  value={option.name}
                  data-id={option.id}
                />
              ))}
            </datalist>
            <button onClick={handleSelectedDoctor}>Search</button>
          </div>
        </div>
        <p>
          Discover our exceptional team of dedicated doctors here at CareKerala.
          With a diverse range of expertise spanning various medical fields, our
          doctors are committed to providing personalized and compassionate care
          tailored to your unique health needs.
        </p>
      </div>
      <div className={styles.flexRow}>
        <div className={styles.sectionSidebar}>
          <label>Select District: </label>
          <div key="All">
            <input
              type="checkbox"
              id="All"
              checked={selectedDistrict === "All"}
              onChange={() => handleDistrictChange("All")}
            />
            <label htmlFor="All"> All</label>
          </div>

          {uniqueDistricts.map((district) => (
            <div key={district}>
              <input
                type="checkbox"
                id={district}
                checked={selectedDistrict === district}
                onChange={() => handleDistrictChange(district)}
              />
              <label htmlFor={district}>{district}</label>
            </div>
          ))}
        </div>
        <div className={styles.contentDiv}>
          {filteredDoctors.map((d, index) => {
            return (
              <Link
                to={"/doctors/" + d._id}
                key={index}
                className={styles.doctorCard}
              >
                <div>
                  <img src={d.image} alt="" />
                </div>
                <div className={styles.cardCol}>
                  <div className={styles.cardDetails}>
                    <div>
                      <h3>{d.name}</h3>
                      <span>{d.category}</span>
                      <span className={styles.hide}>{d.qualification}</span>
                    </div>
                    <div className={styles.innerDiv}>
                      <h6>SPECIALITY</h6>
                      <span>{d.speciality}</span>

                      <h6>PHONE NUMBER</h6>
                      <span>{d.phone}</span>
                    </div>
                  </div>
                  <Link to={"/booking/" + d._id} className={styles.cardBtn}>
                    Book An Appointment <img src={arrowIcon} alt="" />
                  </Link>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Doctors;
