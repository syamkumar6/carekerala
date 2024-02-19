import Carousel from 'react-bootstrap/Carousel';
import styles from "./HomePageCarousel.module.css"
import img1 from "../../assets/carouselImg1.jpg"
import img2 from "../../assets/carouselImg3.jpg"
import img3 from "../../assets/carouselImg2.jpg"

function HomeCarousel() {
  return (
    <Carousel className={styles.carousel}>
      <Carousel.Item>
      <div className={styles.imageContainer}>
      <img src={img1} alt="" className={styles.carouselImg}/>
      </div>
      </Carousel.Item>
      <Carousel.Item>
      <div className={styles.imageContainer}>
      <img src={img2} alt="" className={styles.carouselImg}/>
      </div>
      </Carousel.Item>
      <Carousel.Item>
      <div className={styles.imageContainer}>
      <img src={img3} alt="" className={styles.carouselImg}/>
      </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default HomeCarousel;