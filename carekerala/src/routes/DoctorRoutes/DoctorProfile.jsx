/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import styles from "./DoctorProfile.module.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { addUserAuth, addAuthDetails } from "../../Redux/Features/AuthSlice";

import BookedAppointments from "../../Components/DoctorsAppointments/BookedAppointments";
import DoctorProfileEdit from "../../Components/DoctorProfile/DoctorProfileEdit";
import HospitalAppointments from "../../Components/DoctorsAppointments/HospitalAppointments";
import PersonalAppointments from "../../Components/DoctorsAppointments/PersonalAppointments";
import AppointmentsRequests from "../../Components/DoctorsAppointments/AppointmentsRequests";

export async function loader({ params }) {
  axios.defaults.withCredentials = true;
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments/doctors/` + params.userId);
  const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors/` + params.userId);
  const appointments = res.data;
  const user = doctorRes.data;
  return { appointments, user };
}

function DoctorProfile() {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appointments, user } = useLoaderData();
  const [doctor, setDoctor] = useState(user);
  const [appointmentsData, setAppointmentsData] = useState(appointments)
  const allAppointments = appointmentsData.filter((appointment) => !appointment.hospital);
  const bookedAppointments = appointmentsData.filter((appointment) => appointment.user === user._id);
  const hospitalAppointments = appointmentsData.filter((appointment) => appointment.hospital && appointment.user !== user._id);
  console.log(hospitalAppointments)
  const personalAppointments = allAppointments.filter((appointment) => appointment.isApproved);
  console.log(personalAppointments)
  const appointmentsRequests = allAppointments.filter((appointment) => !appointment.isApproved && appointment.user !== user._id);
  const [activeComponent, setActiveComponent] = useState("booked");

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.post(`${baseURL}/users/verify`).then((res) => {
      if (res.data.Status === "Verify-Success") {
        dispatch(addUserAuth(true));
        dispatch(addAuthDetails(res.data.user));
      } else {
        alert(res.data.Meassage);
      }
    });
  }, []);

  const handleLogout = async () => {
    await axios
      .post(`${baseURL}/users/logout`)
      .then((res) => {
        console.log(res.data.status);
        dispatch(addUserAuth(false));
        dispatch(addAuthDetails(null));
        navigate("/users/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <main className={styles.doctorProfileMain}>
      
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>

        <section className={styles.profileSection}>
        <DoctorProfileEdit doctor={doctor} setDoctor={setDoctor}/>
        </section>
      
      <section className={styles.container}>
        <div className={styles.sidebar}>
          <label>
            <input
              type="checkbox"
              checked={activeComponent === "booked"}
              onChange={() => setActiveComponent("booked")}
            />
            Booked Appointments
          </label>
          <label>
            <input
              type="checkbox"
              checked={activeComponent === "hospital"}
              onChange={() => setActiveComponent("hospital")}
            />
            Hospital Appointments
          </label>
          <label>
            <input
              type="checkbox"
              checked={activeComponent === "personal"}
              onChange={() => setActiveComponent("personal")}
            />
            Personal Appointments
          </label>
          <label>
            <input
              type="checkbox"
              checked={activeComponent === "requests"}
              onChange={() => setActiveComponent("requests")}
            />
            Appointment Requests
          </label>
        </div>
        <div className={styles.contentDiv}>
        {activeComponent === "booked" && (
          <BookedAppointments
            appointments={bookedAppointments}
            user={user}
            setAppointmentsData={setAppointmentsData}
          />
        )}
        {activeComponent === "hospital" && (
          <HospitalAppointments
            appointments={hospitalAppointments}
          />
        )}
        {activeComponent === "personal" && (
          <PersonalAppointments
            appointments={personalAppointments}
            user={user}
            setAppointmentsData={setAppointmentsData}
          />
        )}
        {activeComponent === "requests" && (
          <AppointmentsRequests
            appointments={appointmentsRequests}
            user={user}
            setAppointmentsData={setAppointmentsData}
          />
        )}
      </div>
      </section>

    </main>
  );
}

export default DoctorProfile;
