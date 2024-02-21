/* eslint-disable react/prop-types */
import HospitelCard from "../../Cards/HospitelCard";
import styles from "./Hospitels.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

import arrow from "../../../assets/arrow-right.svg";
import arrowLeft from "../../../assets/arrow-left.svg";

function Hospitels({hospitals}) {
  

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
      },
    },
  ];

  return (
    <div className={styles.hospitelsSection}>
      <h2 className={styles.sectionHead}>
        Discover the Finest Healthcare in Kerala
      </h2>
      <p>
        Explore our handpicked list featuring state-of-the-art facilities,
        cutting-edge technology, and a dedicated team of healthcare
        professionals. <br /> From Kochi to various corners of Kerala, these
        hospitals are trusted pillars of the community, providing compassionate
        care and ensuring your well-being.
      </p>
      <Slider {...settings} responsive={responsiveSettings}>
        {hospitals.map((d, index) => {
          return <HospitelCard key={index} data={d} />;
        })}
      </Slider>
      <Link to={"/hospitals"} className={styles.hospitalsBtn}>
        View all <img src={arrow} alt="" />
      </Link>
    </div>
  );
}

export default Hospitels;
