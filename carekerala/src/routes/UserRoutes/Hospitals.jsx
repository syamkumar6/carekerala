/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import styles from "./Hospitals.module.css";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";

import locationIcon from "../../assets/locationIcon3.svg";
import callIcon from "../../assets/call.svg";

export async function loader() {
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/hospitals`);
  const hospitals = res.data;
  return { hospitals };
}

function Hospitals() {
  const { hospitals } = useLoaderData();
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const hospitalOptions = hospitals.map((h) => ({id:h._id, name:h.name}))


  const handleSelectedDoctor = () =>{
    const selectedOptionId = document.getElementById("doctor-name").value;
    const selectedHospital = hospitalOptions.find(option => option.name === selectedOptionId);
    navigate("/hospitel/"+selectedHospital.id)
  }

  const uniqueDistricts = [
    ...new Set(hospitals.map((hospital) => hospital.district)),
  ];

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
  };
  
  const filteredHospitals =
    selectedDistrict === "All"
      ? hospitals
      : hospitals.filter((hospital) => hospital.district === selectedDistrict);

  const initiateCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };
  
  return (
    <main>
    <div className={styles.pageHeader}>
        <div className={styles.flexRow3}>
        <h2>Hospitals</h2>
        <div className={styles.searchDiv}>
        <input 
        type="text" 
        id="doctor-name" 
        list="doctor-list"
        placeholder="Search Hospitals" 
        value={searchValue} //
        onChange={(e) => setSearchValue(e.target.value)}
        />
        <datalist id="doctor-list">
          {hospitalOptions.map((option) => (
            <option key={option.id} value={option.name} data-id={option.id}/>
          ))}
        </datalist>
        <button onClick={handleSelectedDoctor}>Search</button>
      </div>
        </div>
        <p>
          designed to provide you with easy access to essential healthcare
          information. Explore a list of hospitals with detailed information
          about each facility. Use the district filter to find hospitals in
          specific areas, and discover contact details, locations, and more.
        </p>
      </div>

      <div className={styles.flexRow2}>
        <div className={styles.sectionSidebar}>
          <label>Select District: </label>
          <div key="All">
            <input
              type="checkbox"
              id="All"
              checked={selectedDistrict === "All"}
              onChange={() => handleDistrictChange("All")}
            />
            <label htmlFor="All"> All</label>
          </div>
          {uniqueDistricts.map((district) => (
            <div key={district}>
              <input
                type="checkbox"
                id={district}
                checked={selectedDistrict === district}
                onChange={() => handleDistrictChange(district)}
              />
              <label htmlFor={district}>{district}</label>
            </div>
          ))}
        </div>
        <div className={styles.ContentDiv}>
          {filteredHospitals.map((hospital, index) => {
            return (
              <div key={index} className={styles.hospitalCard}>
                <div className={styles.cardHeader}>
                  <h2>{hospital.name}</h2>
                  <span>
                    <img src={locationIcon} alt="" />
                    {hospital.address.length > 30
                              ? `${hospital.address.substring(0, 30)}...`
                              : hospital.address}
                  </span>
                </div>
                <div className={styles.flexRow}>
                  <img src={hospital.image} alt="" />
                  <div className={styles.flexCol}>
                    <p>{hospital.description}</p>
                    <div className={styles.btnDiv}>
                      <button
                        className={styles.btnCall}
                        onClick={() => initiateCall(hospital.phoneNumber)}
                      >
                        <img src={callIcon} alt="" />
                        Call
                      </button>
                      <Link
                        to={"/hospitel/" + hospital._id}
                        className={styles.btnGreen}
                      >
                        view details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default Hospitals;
