/* eslint-disable react/prop-types */
import styles from "./HospitalAppointments.module.css"
import { useState } from "react";
import sheetIcon from "../../assets/sheetIcon.svg";
import closeIcon from "../../assets/closeIcon2.svg";
import UpdateSheet from "./UpdateSheet";

function HospitalAppointments({ appointments}) {
  const [data, setData] = useState()
  const [open, setOpen] = useState(false);

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
                        {d.isApproved === false ? (
                          <span className={styles.spanRed}>
                            Waiting for approval
                          </span>
                        ) : (
                          <span className={styles.spanGreen}>Approved</span>
                        )}
                      </div>
                    </div>
                    
                    <button
                        className={d.isApproved === false
                            ? styles.btnGreenDisabled
                            : styles.btnGreen}
                        onClick={() => {
                          if (d.isApproved === false) {return;}
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