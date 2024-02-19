/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useDispatch, useSelector } from "react-redux";
import styles from "./UserProfile.module.css";
import axios from "axios";
import { useLoaderData, useNavigate } from "react-router-dom";
import locationIcon from "../../assets/locationIcon2.svg";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { addUserAuth, addAuthDetails } from "../../Redux/Features/AuthSlice";

export async function loader({ params }) {
  axios.defaults.withCredentials = true;
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments/` + params.userId);
  const appointmentsData = res.data;
  return { appointmentsData };
}

function UserProfile() {
  const { appointmentsData } = useLoaderData();
  const [appointments, setAppointments] = useState(appointmentsData);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.authDetails);
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

  const handleDeleteAppointment = (appointmentId) => {
    const userId = user.id;
    axios.defaults.withCredentials = true;
    axios.delete(`${baseURL}/appointments/` + userId + `/` + appointmentId)
      .then((res) => {
        setAppointments(res.data.appointments);
        toast.success(res.data.message);
      })
      .catch((error) => {
        console.error("Error deleting appointment:", error);
      });
  };

  const handlePermission = (appointmentId) => {
    try {
      const userId = user.id;
      axios.defaults.withCredentials = true;
      axios.post(`${baseURL}/appointments/permission/` + userId + `/` + appointmentId)
        .then((res) => {
          setAppointments(res.data.appointments);
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

  const handleLogout = () => {
    axios.defaults.withCredentials = true;
    axios.post(`${baseURL}/users/logout`)
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
    <main className={styles.profileMain}>
        <button
          type="button"
          onClick={handleLogout}
          className={styles.logoutBtn}>
          Logout
        </button>
      <div className={styles.appointmentDiv}>
        <h2>Appointments</h2>
        {appointments.length > 0 ? (
          <ul>
            {appointments.sort((a, b) => new Date(a.date) - new Date(b.date)).map((d) => {
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
                            className={styles.btnRed}
                          >
                            Cancel H-Sheet permission
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className={styles.addressHide}>
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
                        className={styles.btnRed2}
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
          <p className={styles.noData}>No appointments available!!!</p>
        )}
      </div>
    </main>
  );
}

export default UserProfile;
