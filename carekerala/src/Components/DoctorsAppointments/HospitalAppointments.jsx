/* eslint-disable react/prop-types */
import styles from "./HospitalAppointments.module.css"
import { useState } from "react";
import sheetIcon from "../../assets/sheetIcon.svg";
import closeIcon from "../../assets/closeIcon2.svg";
import UpdateSheet from "./UpdateSheet";
import toast from "react-hot-toast";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";

function HospitalAppointments({ appointments, user, setAppointmentsData}) {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [data, setData] = useState()
  const [open, setOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const handleDeleteAppointment = (appointmentId) => {
    setLoadingId(appointmentId)
    const userId = user._id;
    axios.defaults.withCredentials = true;
    axios.delete(`${baseURL}/appointments/doctors/` + userId + `/` + appointmentId)
      .then((res) => {
        setAppointmentsData(res.data.appointments);
        setLoadingId(null)
      })
      .catch((error) => {
        console.error("Error deleting appointment:", error);
        setLoadingId(null)
      });
  };

  return (
    <div>
      <div className={`${styles.appointmentDiv} ${open ? styles.disableScroll : ""}`}>
        <h2>Hospital Appointments</h2>
        {appointments.length > 0 ?(
          <ul>
            {appointments.map((d) => {
              return (
                <>
                  <li key={d._id} className={styles.appointmentCard}>
                    <h4>{d.title}. {d.fname} {d.lname && d.lname}</h4>
                    <div>
                      <span className={styles.date}>
                        Date : {d.date} {d.time ? ` / ${d.time}` : ""}
                      </span>
                      <div className={styles.divCenter}>
                        {d.isApproved === false && (
                          <span className={styles.spanRed}>
                            Waiting for approval
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                    <button
                        className={d.isApproved === false ? styles.btnGreenDisalbled : styles.btnGreen}
                        onClick={() => {
                          if (d.hSheetPermission === false) {
                            return toast.error("User permission is required")
                          }
                          setData({
                            userId: d.user,
                            hospitalId: d.hospital?._id,
                            sheet: d.hSheet
                          });
                          setOpen(true);
                        }}
                        disabled={d.isApproved === false}
                      >
                        <img src={sheetIcon} alt="" />
                        View H-Sheet
                      </button>
                      {d.isApproved && (
                        <button
                        className={styles.btnRed}
                        onClick={() => handleDeleteAppointment(d._id)}
                      >
                        {loadingId === d._id ? (
                        <PulseLoader size={7} color={"rgb(236, 236, 236)"} />
                      ) : (
                        "Close"
                      )}
                      </button>
                      )}
                    </div>
                    
                  </li>
                </>
              );
            })}
          </ul>
        ) : (
          <p className={styles.spanRed}>No appointments available.</p>
        )}
      </div>

      {open &&<> 
      <div className={styles.hSheetBg}></div>
      <div className={styles.hSheet}>
        <button onClick={()=> setOpen(false)} className={styles.closeBtn}> <img src={closeIcon} alt="" /></button>
        <UpdateSheet data={data}/>
        </div></>}
    </div>
  );
}

export default HospitalAppointments;