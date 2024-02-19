/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import styles from "./DoctorsCard2.module.css"

function DoctorsCard2({data}) {
  return (
    <Link to={"/doctors/"+data._id} className={styles.cardLink}>
      <div className={styles.cardBody}>
          <img src={data.image} alt="" className={styles.DrImg} />
        <div className={styles.cardDetails}>
          <h4>{data.name}</h4>
          <span>{data.category}</span>
        </div>
      </div>
    </Link>
  )
}

export default DoctorsCard2