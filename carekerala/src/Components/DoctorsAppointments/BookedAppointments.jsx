/* eslint-disable react/prop-types */
import axios from "axios";
import styles from "./BookedAppointments.module.css";
import toast from "react-hot-toast";
import locationIcon from "../../assets/locationIcon2.svg";


function BookedAppointments({ appointments, user, setAppointmentsData }) {
  const baseURL = import.meta.env.VITE_BASE_URL;

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

  const handlePermission = (appointmentId) => {
    try {
      const userId = user._id;
      axios.defaults.withCredentials = true;
      axios.post(`${baseURL}/appointments/permission/` + userId + `/` + appointmentId)
        .then((res) => {
          setAppointmentsData(res.data.appointments);
          toast.success(res.data.message);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          console.error(error);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className={styles.appointmentDiv}>
        <h2>Booked Appointments</h2>
        {console.log(appointments)}
        {appointments.length > 0 ? (
          <ul>
            {appointments.map((d) => {
              return (
                <>
                  <li key={d._id} className={styles.appointmentCard}>
                    <div>
                      {d.hospital ? (
                        <>
                          <h4>{d.hospital.name}</h4>
                          <span>{d.doctor.name}</span>
                        </>
                      ) : (
                        <>
                          <h4>{d.doctor.name}</h4>
                          <span>{d.doctor.category}</span>
                        </>
                      )}
                    </div>
                    <div>
                      <span className={styles.date}>
                        Date : {d.date} {d.time ? ` / ${d.time}` : ""}
                      </span>
                      <div className={styles.divCenter}>
                        {d.isApproved === false ? (
                          <span className={styles.spanRed}>
                            Waiting for approval
                          </span>
                        ) : !d.hSheet ? (
                          <span className={styles.spanGreen}>Approved</span>
                        ) : d.hSheet.updatePermission === false ? (
                          <button
                            onClick={() => handlePermission(d._id)}
                            className={styles.btnGreen}
                          >
                            Allow H-Sheet permission
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePermission(d._id)}
                            className={styles.btnRed2}
                          >
                            Cancel H-Sheet permission
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <span>
                        {" "}
                        <img src={locationIcon} alt="" />
                        {d.hospital ? (
                          <>
                            {d.hospital.address.length > 30
                              ? `${d.hospital.address.substring(0, 30)}...`
                              : d.hospital.address}
                          </>
                        ) : (
                          <>
                            {d.doctor.address.length > 30
                              ? `${d.doctor.address.substring(0, 30)}...`
                              : d.doctor.address}
                          </>
                        )}
                      </span>
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
          <p className={styles.spanRed}>No appointments available.</p>
        )}
      </div>
    </div>
  );
}

export default BookedAppointments;
