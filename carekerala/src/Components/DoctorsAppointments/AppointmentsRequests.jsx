/* eslint-disable react/prop-types */
import axios from "axios";
import styles from "./AppointmentsRequests.module.css";
import toast from "react-hot-toast";
import callIcon from "../../assets/callIcon.svg";

function appointmentsRequests({ appointments, user, setAppointmentsData }) {
  const baseURL = import.meta.env.VITE_BASE_URL;

  const handleApprove = async (appointmentId, time) => {
    try {
      console.log(time);
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${baseURL}/appointments/doctors/approve/${user._id}/${appointmentId}`,
        { time }
      );

      setAppointmentsData(res.data.appointments);
      toast.success("Appointment Approved");
    } catch (error) {
      console.error("Error approving appointment:", error);
    }
  };

  const handleReject = async (appointmentId) => {
    axios.defaults.withCredentials = true;
    try {
      const res = await axios.delete(
        `${baseURL}/appointments/doctors/${user._id}/${appointmentId}`
      );

      setAppointmentsData(res.data.appointments);
      toast.success("Appointment Rejected");
    } catch (err) {
      console.log(err);
    }
  };

  const initiateCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div>
      <div className={styles.appointmentDiv}>
        <h2>Appointment Requests</h2>
        {appointments?.length > 0 ? (
          <ul>
            {appointments?.map((d, index) => {
              return (
                <>
                  <li key={index} className={styles.requestsCard}>
                    <div className={styles.flexCol}>
                      <h5>
                        {d.title}. {d.fname} {d.lname && d.lname}
                      </h5>
                      <button
                        className={styles.btnCall}
                        onClick={() => initiateCall(d.phone)}
                      >
                        <img src={callIcon} alt="" /> Call
                      </button>
                    </div>

                    <div className={styles.flexCol}>
                      <span>Date : {d.date}</span>
                    </div>

                    <div className={styles.flexCol}>
                      <input type="time" id="time" required />
                      <div className={styles.btnDiv}>
                        <button
                          onClick={() => handleReject(d._id)}
                          className={styles.btnRed}
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            const timeInput = document.getElementById("time");
                            const selectedTime = timeInput.value;
                            console.log(selectedTime);
                            if (selectedTime.trim() !== "") {
                              handleApprove(d._id, selectedTime);
                              timeInput.value = "";
                            } else {
                              toast.error(
                                "Please fill in the time input before approving."
                              );
                            }
                          }}
                          className={styles.btnGreen}
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  </li>
                </>
              );
            })}
          </ul>
        ) : (
          <p className={styles.spanRed}>No New Requests !</p>
        )}
      </div>
    </div>
  );
}

export default appointmentsRequests;
