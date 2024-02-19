/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./PersonalAppointments.module.css";
import axios from "axios";
import toast from "react-hot-toast";
import closeIcon from "../../assets/closeIcon2.svg";
import callIcon from "../../assets/callIcon.svg";
import sheetIcon from "../../assets/sheetIcon.svg";
import UpdateSheet from "./UpdateSheet";

function PersonalAppointments({ appointments, user, setAppointmentsData }) {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [data, setData] = useState();
  const [open, setOpen] = useState(false);

  const handleDeleteAppointment = (appointmentId) => {
    const userId = user._id;
    axios.defaults.withCredentials = true;
    axios.delete(`${baseURL}/appointments/doctors/` + userId + `/` + appointmentId)
      .then((res) => {
        setAppointmentsData(res.data.appointments);
        toast.success(res.data.message);
      })
      .catch((error) => {
        console.error("Error deleting appointment:", error);
      });
  };

  function formatTime(time24) {
    const [hours, minutes] = time24.split(":");
    const formattedHours = parseInt(hours, 10) % 12 || 12;
    const period = parseInt(hours, 10) >= 12 ? "PM" : "AM";
    return `${formattedHours}:${minutes} ${period}`;
  }

  const initiateCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div>
      <div className={`${styles.appointmentDiv} ${open ? styles.disableScroll : ""}`}>
        <h2>Appointments Of Patients</h2>
        {appointments?.length > 0 ? (
          <ul>
            {appointments.map((d) => {
              return (
                <>
                  <li key={d._id} className={styles.appointmentCard}>
                    <div>
                      <h4>
                        {d.title}. {d.fname} {d.lname && d.lname}
                      </h4>
                      <button
                        className={styles.btnCall}
                        onClick={() => initiateCall(d.phone)}
                      >
                        <img src={callIcon} alt="" /> Call
                      </button>
                    </div>
                    <div>
                      <span className={styles.date}>
                        Date: {d.date} {d.time ? `/ ${formatTime(d.time)}` : ""}
                      </span>
                      <div className={styles.divCenter}>
                        {d.isApproved === false ? (
                          <span className={styles.spanRed}>
                            Waiting for approval
                          </span>
                        ) : (
                          <span className={styles.spanGreen}>Approved</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.btnDiv}>
                      <button
                        className={
                          d.isApproved === false
                            ? styles.btnGreenDisabled
                            : styles.btnGreen
                        }
                        onClick={() => {
                          if (d.isApproved === false) {
                            return;
                          }
                          setData({
                            userId: d.user,
                            hospitalId: d.hospital,
                            sheet: d.hSheet
                          });
                          setOpen(true);
                        }}
                        disabled={d.isApproved === false}
                      >
                        <img src={sheetIcon} alt="" />
                        View H-Sheet
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAppointment(d._id)}
                        className={styles.btnRed}
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  </li>
                </>
              );
            })}
          </ul>
        ) : (
          <p className={styles.spanRed}>No New Personal Appointments !</p>
        )}
      </div>
      {open && (
        <>
          <div className={styles.hSheetBg}></div>
          <div className={styles.hSheet}>
            <button onClick={() => setOpen(false)} className={styles.closeBtn}>
              {" "}
              <img src={closeIcon} alt="" />
            </button>
            <UpdateSheet data={data} />
          </div>
        </>
      )}
    </div>
  );
}

export default PersonalAppointments;
