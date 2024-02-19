/* eslint-disable react/prop-types */
import styles from "./HospitalCarousel.module.css";
import Carousel from "react-bootstrap/Carousel";

function HospitalCarousel({data}) {
  return (
    <Carousel className={styles.carousel}>
      {
        data?.map((d, index) => {
          return <Carousel.Item key={index}>
          <div className={styles.imageContainer}>
              <img src={d.img} alt="" className={styles.carouselImg} />
            </div>
        </Carousel.Item>
        })
      }
    </Carousel>
  );
}

export default HospitalCarousel;
