/* eslint-disable react/prop-types */
import styles from "./Doctors.module.css"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DoctorsCard from "../../Cards/DoctorsCard";
import { Link } from "react-router-dom";

import arrow from "../../../assets/arrow-right2.svg";
import arrowLeft from "../../../assets/arrow-left2.svg";

function Doctors({doctors}) {
    const CustomPrevArrow = (props) => (
        <div
          className={`${styles.customArrow} ${styles.prevArrow}`}
          onClick={props.onClick}>
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

      const responsiveSettings = [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            dots: false
          },
        },
      ];
  return (
    <div className={styles.doctorsSlider}>
        <h2>Meet Our Expert Doctors</h2>
        <p>Discover our exceptional team of dedicated doctors here at CareKerala. With a diverse range of expertise spanning various medical fields, our doctors are committed to providing personalized and compassionate care tailored to your unique health needs. From routine check-ups to specialized treatments, our doctors leverage cutting-edge technology and stay abreast of the latest medical advancements to deliver the highest quality healthcare services.</p>
      
        <Slider {...settings} responsive={responsiveSettings}>
            {
                doctors.map((d,index) => {
                    return <DoctorsCard key={index} data={d}/>
                })
            }
        </Slider>
        <Link to={"/hospitals"} className={styles.doctorsBtn}>
        View all <img src={arrow} alt="" />
      </Link>
       
    </div>
  )
}

export default Doctors