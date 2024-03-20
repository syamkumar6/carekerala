/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import styles from "./HomePage.module.css";
import axios from "axios";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addUserAuth, addAuthDetails } from "../../Redux/Features/AuthSlice";

import Doctors from "../../Components/HomePage/DoctorsSection/Doctors";
import HomeCarousel from "../../Components/Carousels/HomePageCarousel";
import Overview from "../../Components/HomePage/OverviewSection/Overview";
import Hospitels from "../../Components/HomePage/Hospitels/Hospitels";

import arrow from "../../assets/arrow-right.svg";
import callIcon from "../../assets/call.svg"

export async function loader() {
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/hospitals`);
  const doctorsRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors`);
  const hospitals = res.data;
  const doctors = doctorsRes.data
  return { hospitals,doctors };
}

function HomePage() {
  const { hospitals,doctors } = useLoaderData();
  const baseURL = import.meta.env.VITE_BASE_URL
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const phoneNumber = "9900099000"
  const [hospitalValue, setHospitalValue] = useState("");
  const [doctorValue, setDoctorValue] = useState("");
  const hospitalOptions = hospitals.map((h) => ({id:h._id, name:h.name}))
  const doctorOptions = doctors.map((doctor) => ({id:doctor._id, name:doctor.name}))

  useEffect(()=> {
    window.scrollTo({
      top: 0,
    });
  },[])

  const handleSelectedHospital = () =>{
    const selectedOptionId = document.getElementById("hospital-name").value;
    const selectedHospital = hospitalOptions.find(option => option.name === selectedOptionId);
    navigate("/hospitel/"+selectedHospital.id)
  }

  const handleSelectedDoctor = () =>{
    const selectedOptionId = document.getElementById("doctor-name").value;
    const selectedDoctor = doctorOptions.find(option => option.name === selectedOptionId);
    navigate("/doctors/"+selectedDoctor.id)
  }


      useEffect(() => {
        axios.defaults.withCredentials = true
        axios.post(`${baseURL}/users/verify`)
          .then(res => {
              if(res.data.Status === "Verify-Success") {
                dispatch(addUserAuth(true))
                dispatch(addAuthDetails(res.data.user))
              }else{
                alert(res.data.Meassage)
              }
          })
         
      }, [])

      const initiateCall = () => {
        window.location.href = `tel:${phoneNumber}`;
      };
  return (
    <main>
   <section className={styles.topSection}>
    <HomeCarousel />
    <div className={styles.searchFields}>
    <div className={styles.searchDiv}>
    <input 
    type="text" 
    id="hospital-name" 
    list="hospital-list"
    placeholder="Search Hospitals" 
    value={hospitalValue} //
    onChange={(e) => setHospitalValue(e.target.value)}
    />
    <datalist id="hospital-list">
      {hospitalOptions.map((option) => (
        <option key={option.id} value={option.name} data-id={option.id}/>
      ))}
    </datalist>
    <button onClick={handleSelectedHospital}>Search <img src={arrow} alt="" /></button>
  </div>
    <div className={styles.searchDiv}>
        <input
          type="text"
          id="doctor-name"
          list="doctor-list"
          placeholder="Search Doctors"
          value={doctorValue}
          onChange={(e) => setDoctorValue(e.target.value)}
        />
        <datalist id="doctor-list">
          {doctorOptions.map((option) => (
            <option
              key={option.id}
              value={option.name}
              data-id={option.id}
            />
          ))}
        </datalist>
        <button onClick={handleSelectedDoctor}>Search <img src={arrow} alt="" /></button>
      </div>
    </div>
    <div className={styles.contactBtn}>
      <button onClick={initiateCall} aria-label="Contact Button"><img src={callIcon} alt="" /></button>
    </div>
  </section>

  <section className={styles.overviewSection}>
    <Overview />
  </section>

  <section>
    <Hospitels hospitals={hospitals} />
  </section>

  <section>
    <Doctors doctors={doctors}/>
  </section>
    </main>
  );
}

export default HomePage;
