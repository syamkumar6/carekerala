/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./DoctorsDetails.module.css";
import axios from "axios";
import toast from "react-hot-toast";

function DoctorsDetails({ hospital, setHospital }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  const handleDelete = (doctorId) => {
    axios.defaults.withCredentials = true
    axios.delete(`${import.meta.env.VITE_BASE_URL}/hospitals/dashboard/remove-doctor/`+hospital._id+`/`+doctorId)
    .then((res) =>{
      setHospital(res.data.hospital)
      toast.success(res.data.message)
      console.log(res.data.hospital)
    })
    .catch((err) =>{
      console.log(err)
    })
  }

  

  return (
    <div>
      <div className={styles.doctorsDiv}>
        <h4>Doctors Details</h4>
        {hospital?.doctors?.length > 0 ? (
          <ul>
          {hospital?.doctors?.map((d, index) => {
            return (
              <li key={index} className={styles.drlistItem}>
                <button
                  onClick={() => handleClick(index)}
                  className={`${styles.accBtn} ${
                    index === activeIndex ? styles.activeAccordion : ""
                  }`}>
                  <div className={styles.accBtnDetails}>
                    <img
                      src={d.image}
                      alt=""
                      className={styles.doctorImg}
                    />
                    <span>{d.name}</span>
                  </div>
                </button>

                {index === activeIndex && (
                  <div className={styles.flexContainer}>
                    <div className={styles.flexRow}>
                      <div>
                        <img
                          src={d.image}
                          alt=""
                          className={styles.doctorImg2}
                        />
                        <h5>Name: {d.name}</h5>
                      </div>

                      <div className={styles.flexCol}>
                        <h6>Category:</h6>
                        <span> {d.category}</span>
                        <h6>Speciality:</h6>
                        <span> {d.speciality}</span>
                        <h6>Qualification</h6>
                        <span>{d.qualification}</span>
                        <h6>Languages</h6>
                        <span>{d.languages}</span>
                      </div>
                    </div>

                    <div>
                      <h5>Overview</h5>
                      <p>{d.about}</p>
                    </div>
                      <button className={styles.deleteBtn} onClick={() =>handleDelete(d._id)}>Remove Doctor</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        )
        :
        ( <p className={styles.emptyNote}>No Doctors Available !</p> )}
        
      </div>
    </div>
  );
}

export default DoctorsDetails;
