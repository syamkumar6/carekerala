/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styles from "./HospitelCard.module.css";

export default function HospitelCard({ data }) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };
  return (
    <Link to={"/hospitel/" + data._id} className={styles.cardLink} onClick={scrollToTop}>
      <div className={styles.cardBody}>
        <div>
          <img src={data.image} alt="" className={styles.hospitelImg} />
        </div>

        <div className={styles.cardDetails}>
          <h4>{data.name}</h4>
          <span>{data.district}</span>
        </div>
      </div>
    </Link>
  );
}
