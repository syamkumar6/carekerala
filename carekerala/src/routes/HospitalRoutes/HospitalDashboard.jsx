/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import styles from "./HospitalDashboadr.module.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addHospitalAuth, addAuthDetails } from "../../Redux/Features/AuthSlice";
import { useLoaderData } from "react-router-dom";
import toast from "react-hot-toast";

import HospitalCarousel from "../../Components/Carousels/HospitalCarousel";
import EditCarousel from "../../Components/HospitalDashboardComponents/EditCarousel";
import EditOverview from "../../Components/HospitalDashboardComponents/EditOverview";
import DoctorsDetails from "../../Components/HospitalDashboardComponents/DoctorsDetails";
import EditFacilities from "../../Components/HospitalDashboardComponents/EditFacilities";
import EditProfile from "../../Components/HospitalDashboardComponents/EditProfile";

import closeIcon from "../../assets/closeIcon.svg";
import callIcon from "../../assets/call.svg"

export async function loader({ params }) {
  axios.defaults.withCredentials = true;
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/hospitals/dashboard/` + params.hospitalId);
  const hospitaldata = res.data;
  return { hospitaldata };
}

function HospitalDashboard() {
  const { hospitaldata } = useLoaderData();
  const [hospital, setHospital] = useState(hospitaldata)
  const dispatch = useDispatch()
  const [open, setopen] = useState(false);
  const [editDiv, setEditDiv] = useState(false)
  const phoneNumber = "9900099000"

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

  const openEditSection = () => {
    setEditDiv(true);
  };

  const closeEditSection = () => {
    setEditDiv(false);
  };

  const handleApprove = (doctorId) => {
    axios.defaults.withCredentials = true
    axios.post(`${import.meta.env.VITE_BASE_URL}/hospitals/dashboard/approve-doctor-request/`+hospital._id+`/`+doctorId)
    .then((res) =>{
      setHospital(res.data.hospital)
      toast.success(res.data.message)
      console.log(res.data.hospital)
    })
    .catch((err) =>{
      console.log(err)
    })
  }

  const handleDelete = (doctorId) => {
    axios.defaults.withCredentials = true
    axios.delete(`${import.meta.env.VITE_BASE_URL}/hospitals/dashboard/remove-doctor/`+hospital._id+`/`+doctorId)
    .then((res) =>{
      toast.success(res.data.message)
      setHospital(res.data.hospital)
      console.log(res.data.hospital)
    })
    .catch((err) =>{
      console.log(err)
    })
  }

  const initiateCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <main className={styles.hospitalDbMain}>
      <section>
        <div className={styles.Header}>
          <h1>{hospital?.name}</h1>
            {hospital?.description && (
              <button onClick={openEditSection} className={styles.editBtn}>
              Edit Profile
            </button>
            )}
        </div>
      </section>

      {hospital.description ? (
        <>
        <section>
        <HospitalCarousel data={hospital?.carousel} />
        </section>
  
        <section className={styles.secondSection}>
          <h2>Overview</h2>
          <div className={open ? null : styles.overviewNote}>
            {hospital?.description?.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <button onClick={() => setopen(!open)} className={styles.readBtn}>
            {open ? "read less..." : "read more..."}
          </button>
        </section>
  
        <section className={styles.drSection}>
          <DoctorsDetails hospital={hospital} setHospital={setHospital}/>
          <div>
          <h3>Doctors Requests</h3>
          {hospital?.doctorRequests?.length > 0 ? (
            <ul className={styles.requestContainer}>
            {hospital?.doctorRequests?.map((d, index) => {
              return <li key={index} className={styles.requestCard}>
                <div className={styles.innerContainer}>
                <div className={styles.flexCol}>
                  <img src={d.image} alt="" />
                  <h3>{d.name}</h3>
                </div>
                <div className={styles.flexCol}>
                  <span> <strong>Category : </strong>{d.category}</span>
                  <span><strong>Qualification :</strong>  {d.qualification}</span>
                  <p><strong> About :</strong> {d.about}</p>
                </div>
                </div>
                <div className={styles.requestBtnDiv}>
                  <button className={styles.btnReject} onClick={() =>handleDelete(d._id)}>Reject</button>
                  <button className={styles.btnApprove} onClick={() =>handleApprove(d._id)}>Approve Request</button>
                </div>
              </li>
            })}
          </ul>
          )
          :
          (<p className={styles.emptyNote}>No New Requests !</p>)}
          
          </div>
        </section>
        </>
      )
      :
      ( <div className={styles.requestSection}>
        <div>
        <h2>Pleace Create a Profile</h2>
        <button onClick={openEditSection} className={styles.btnGreen}>Create</button>
        </div>
      </div> )}
      

      {editDiv && (
        <div className={styles.editingSection} >
          <button onClick={closeEditSection} className={styles.editinButton}>
            <img src={closeIcon} alt="" />
          </button>
          <div>
            <EditProfile hospital={hospital} setHospital={setHospital}/>
            <EditCarousel hospital={hospital} setHospital={setHospital}/>
            <EditFacilities hospital={hospital} setHospital={setHospital}/>
            <EditOverview hospital={hospital} setHospital={setHospital}/>
          </div>
          
        </div>
      )}
      <div className={styles.contactBtn}>
        <button onClick={initiateCall}><img src={callIcon} alt="" /></button>
      </div>
    </main>
  );
}

export default HospitalDashboard;
