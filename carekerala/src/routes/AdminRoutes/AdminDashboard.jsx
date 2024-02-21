/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import styles from "./AdminDashboard.module.css";
import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export async function loader() {
  const hospitalres = await axios.get(`${import.meta.env.VITE_BASE_URL}/hospitals/admin`);
  const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors/admin`);
  const hospitalsData = hospitalres.data;
  const doctorsData = doctorRes.data;
  return { hospitalsData, doctorsData };
}

function AdminDashboard() {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const { hospitalsData, doctorsData } = useLoaderData();
  const [doctors, setDoctors] = useState(doctorsData)
  const [allHospitals, setAllHospitals] = useState(hospitalsData)
  const hospitals = allHospitals.filter((hospital) => hospital.isApproved)
  const hospitalRequests = allHospitals.filter((hospital) => !hospital.isApproved)
  const [active, setActive] = useState("hospitals");

  const handleApproveHospital = async (hospitalId) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${baseURL}/hospitals/approve/${hospitalId}`);
      toast.success(res.data.message);
      setAllHospitals(res.data.hospitals);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveHospital = async (hospitalId) => {
    try{
        axios.defaults.withCredentials = true;
        const res = await axios.delete(`${baseURL}/hospitals/remove/`+hospitalId)
        console.log(res.data)
        toast.success(res.data.message)
        setAllHospitals(res.data.hospitals)
    }catch(err){
        console.log(err)
    }
  }

  const handleRemoveDoctor = async (doctorId) => {
    try{
        axios.defaults.withCredentials = true;
        const res = await axios.delete(`${baseURL}/doctors/remove/`+doctorId)
        console.log(res.data)
        toast.success(res.data.message)
        setDoctors(res.data.doctors)
    }catch(err){
        console.log(err)
    }
  }
  return (
    <main className={styles.main}>
      <div className={styles.topbar}>
        <label>
          <input
            type="checkbox"
            checked={active === "requests"}
            onChange={() => setActive("requests")}
          />
          Hospital Requests
        </label>
        <label>
          <input
            type="checkbox"
            checked={active === "hospitals"}
            onChange={() => setActive("hospitals")}
          />
          Hospitals
        </label>
        <label>
          <input
            type="checkbox"
            checked={active === "doctors"}
            onChange={() => setActive("doctors")}
          />
          Doctors
        </label>
      </div>
     {active === "hospitals" && (
         <div>
         <h2>Hospitlas</h2>
         <table>
           <tr>
             <th>Name</th>
             <th>Email</th>
             <th>District</th>
             <th>Visibility</th>
             <th>Phone</th>
             <th></th>
           </tr>
           {hospitals.map((hospital, index) => {
             return (
               <tr key={index}>
                 <td>{hospital.name}</td>
                 <td>{hospital.email}</td>
                 <td>{hospital.district}</td>
                 <td>
                   {hospital.isVisible ? (
                     <>Public</>
                   ) : (
                     <>Private</>
                   )}
                 </td>
                 <td>{hospital.phone}</td>
                 <td>
                   <button onClick={()=> handleRemoveHospital(hospital._id)} className={styles.btnRed}>Remove</button>
                 </td>
               </tr>
             );
           })}
         </table>
       </div>
     )}
      {active === "doctors" && (
        <div>
        <h2>Doctors</h2>
        <table>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>District</th>
            <th>Visibility</th>
            <th>Phone</th>
          </tr>
          {doctors.map((doctor, index) => {
            return (
              <tr key={index}>
                <td>{doctor.name}</td>
                <td>{doctor.email}</td>
                <td>{doctor.district}</td>
                <td>
                  {doctor.isVisible ? <>Public</> : <>Private</>}
                </td>
                <td>{doctor.phone}</td>
                <td>
                  <button onClick={() => handleRemoveDoctor(doctor._id)} className={styles.btnRed}>Remove</button>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
      )}
      {active === "requests" && (
        hospitalRequests.length > 0 ? (
            <div>
        <h2>Hospital Requests</h2>
        <table>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
          {hospitalRequests?.map((hospital, index) => {
            return (
              <tr key={index}>
                <td>{hospital.name}</td>
                <td>{hospital.email}</td>
                <td>
                <button onClick={()=> handleApproveHospital(hospital._id)} className={styles.btnGreen}>Approve</button>
                </td>
                
                <td>
                  <button onClick={()=> handleRemoveHospital(hospital._id)} className={styles.btnRed}>Reject</button>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
        )
        :
        ( <p className={styles.pRed}>No New Requests</p> )
      )}
    </main>
  );
}

export default AdminDashboard;
