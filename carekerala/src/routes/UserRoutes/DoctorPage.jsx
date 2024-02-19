/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import styles from "./DoctorPage.module.css";
import arrowIcon from "../../assets/arrow-right-btn.svg";
import { Link, useLoaderData } from "react-router-dom";
import axios from "axios";

export async function loader({ params }) {
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors/` + params.doctorId);
  const doctor = res.data;
  return { doctor };
}

const initiateCall = (phoneNumber) => {
  window.location.href = `tel:${phoneNumber}`;
};

function DoctorPage() {
  const { doctor } = useLoaderData();
   
  return (
    <main className={styles.DrPageMain}>
      <section className={styles.section}>
        <div className={styles.DrDiv}>
          <div className={styles.imageDiv}>
            <img src={doctor.image} alt="" />
          </div>

          <div className={styles.innerDiv}>
            <h2>{doctor.name}</h2>
            <span>{doctor.catogory}</span>
            <span>{doctor.qualification}</span>
            <div className={styles.drDetails}>
              <div className={styles.drDetailsDiv}>
                <div>
                  <h5>SPECIALITY</h5>
                  <span>{doctor.speciality}</span>
                </div>
                <div>
                  <h5>LANGUAGES</h5>
                  <span>{doctor.languages}</span>
                </div>
              </div>
              <div className={styles.drCardBtns}>
              <button className={styles.drBtn} onClick={() => initiateCall(doctor.phone)}>
                CALL US <img src={arrowIcon} alt="" />
              </button>
              <Link
                to={"/booking/" + doctor._id}
                className={styles.drBtn}
              >
                BOOK AN APPOINTMENT <img src={arrowIcon} alt="" />
              </Link>
            </div>
            </div>
          </div>
          
        </div>

        <div className={styles.overviewDiv}>
          <h2>Overview</h2>
          <p>{doctor.about}</p>
        </div>
      </section>
    </main>
  );
}

export default DoctorPage;
