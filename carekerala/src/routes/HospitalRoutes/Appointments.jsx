/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import styles from "./Appointments.module.css";
import { useEffect, useState } from "react";
import { addAuthDetails, addHospitalAuth,} from "../../Redux/Features/AuthSlice";
import { useDispatch } from "react-redux";
import { useLoaderData, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";

import arrow from "../../assets/arrowDown.svg";
import callIcon from "../../assets/callIcon.svg";

export async function loader({ params }) {
  axios.defaults.withCredentials = true;
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments/hospitals/` +params.hospitalId);
  const appointmentsData = res.data;
  return { appointmentsData };
}

function Appointments() {
  const { hospitalId } = useParams();
  const { appointmentsData } = useLoaderData();
  const [loading, setLoading] = useState(false)
  const [appointments, setAppointments] = useState(appointmentsData);
  const [active, setActive] = useState("appointments");
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/hospitals/dashboard/verify`)
      .then((res) => {
        if (res.data.Status === "Verify Success") {
          dispatch(addHospitalAuth(true));
          dispatch(addAuthDetails(res.data.hospital));
        } else {
          console.log("Verification failed");
        }
      });
  });

  const approvedAppointments = appointments?.filter((appointment) => appointment.isApproved);
  const notApprovedAppointments = appointments?.filter((appointment) => !appointment.isApproved);

  const groupedAppointments = approvedAppointments?.reduce(
    (grouped, appointment) => {
      const doctorName = appointment?.doctor?.name?.toLowerCase();
      if (!grouped[doctorName]) {
        grouped[doctorName] = [];
      }
      grouped[doctorName].push(appointment);
      return grouped;
    },
    {}
  );

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  const handleApprove = async (appointmentId, time) => {
    try {
      setLoading(true)
      axios.defaults.withCredentials = true;
      await axios.post(`${import.meta.env.VITE_BASE_URL}/appointments/approve/` + appointmentId,
        { time }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, isApproved: true }
            : appointment
        )
      );
      setLoading(false)
      toast.success("Appointment Approved")
    } catch (error) {
      console.error("Error approving appointment:", error);
      setLoading(false)
    }
  };

  const handleReject = async (appointmentId) => {
    axios.defaults.withCredentials = true;
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/appointments/delete/${hospitalId}/${appointmentId}`);
      setAppointments(res.data.appointments);
      toast.success("Appointment Canceled")
    } catch (err) {
      console.log(err);
    }
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
    <main className={styles.appointmentMain} id="requests">
      <div className={styles.filterContiner}>
        <label htmlFor="appointments">
          <input
            id="appointments"
            type="checkbox"
            checked={active === "appointments"}
            onChange={() => setActive("appointments")}
          />
          Appointments
        </label>
        <label htmlFor="requests">
          <input
            id="requests"
            type="checkbox"
            checked={active === "requests"}
            onChange={() => setActive("requests")}
          />{" "}
          Requests
        </label>
      </div>
      {active === "requests" && (
        <div className={styles.requestsDiv}>
          <h3>Appointment Requests</h3>
          {notApprovedAppointments.length > 0 ? (
            <ul>
              {notApprovedAppointments.map((d, index) => (
                <li key={index} className={styles.requestsCard}>
                  <div className={styles.flexCol}>
                    <h5>
                      Name : {d.title}. {d.fname} {d.lname && d.lname}
                    </h5>
                    <span>Mobile : {d.phone}</span>
                  </div>
                  <div className={styles.flexCol}>
                    <span>Doctor : {d.doctor.name}</span>
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
                          if (selectedTime) {
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
                        {loading ?  <PulseLoader size={7}   color={'rgb(236, 236, 236)'} /> : 'Apporve'}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyNote}>No new requests.</p>
          )}
        </div>
      )}

      {active === "appointments" && (
        <div className={styles.appointmentsDiv}>
        <h2>Appointments</h2>
        <ul className={styles.appointmentContainer}>
          {Object.keys(groupedAppointments)?.map((doctorName, index) => {
            return (
              <div key={index}>
                <button
                  onClick={() => handleClick(index)}
                  className={`${styles.accBtn} ${
                    index === activeIndex ? styles.activeAccordion : ""
                  }`}
                >
                  {doctorName} <img src={arrow} alt="" />
                </button>
                {index === activeIndex && (
                  <ul>
                    {groupedAppointments[doctorName]?.map(
                      (appointment, index) => {
                        return (
                          <li key={index} className={styles.appointmentItems}>
                            <h5>
                              {appointment.title}. {appointment.fname}{" "}
                              {appointment.lname}
                            </h5>
                            <span>{appointment.date}</span>
                            {appointment.time && (
                              <span>{formatTime(appointment.time)}</span>
                            )}
                            <button
                            className={styles.btnCall}
                            onClick={() => initiateCall(appointment.phone)}>
                              <img src={callIcon} alt="" />
                              Call
                            </button>
                            <button
                              className={styles.btnRed}
                              onClick={() => handleReject(appointment._id)}
                            >
                              {loading ?  <PulseLoader size={7}   color={'rgb(236, 236, 236)'} /> : 'Close'}
                            </button>
                          </li>
                        );
                      }
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </ul>
      </div>
      )}
      
    </main>
  );
}

export default Appointments;
