/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./Editfacilities.module.css";
import toast from "react-hot-toast";
import axios from "axios";

function EditFacilities({ hospital, setHospital }) {
  const [isEditing, setIsEditing] = useState(true);
  const [newFacility, setNewFacility] = useState({ heading: "", details: "" });

  const toggleEditing = () => {
    setIsEditing((prevState) => !prevState);
    setNewFacility({ heading: "", details: "" });
  };

  const handleAddFacility = () => {
    if (
      newFacility.heading.trim() === "" ||
      newFacility.details.trim() === ""
    ) {
        toast.error("Please provide both heading and details for the new facility.")
      return;
    }
    axios.defaults.withCredentials = true;
    axios.post(`${import.meta.env.VITE_BASE_URL}/hospitals/dashboard/add-facility/`+hospital._id, newFacility)
      .then((res) => {
        setHospital(res.data.hospital);
        setNewFacility({ heading: "", details: "" });
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Server Side Error");
      });
  };

  const removeFacility = (facilityId) => {
    try{
        axios.defaults.withCredentials = true;
        axios.delete(`${import.meta.env.VITE_BASE_URL}/hospitals/dashboard/remove-facility/` +hospital._id +`/` +facilityId)
      .then((res) => {
        setHospital(res.data.hospital);
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Failed to delete image')
      });
    }catch(err){
        console.log(err)
    }
  };

  return (
    <div className={styles.facilityDiv}>
      <div className={styles.flexCol}>
        <div className={styles.headerDiv}>
        <h4>Facilities</h4>
        {!isEditing && <button onClick={toggleEditing} className={styles.btnDark}>Add Facilities</button>}
        </div>

        {hospital?.facilities?.length > 0 ? (
          <ul className={styles.flexCol}>
          {hospital?.facilities?.map((d, index) => {
            return (
              <li key={index} className={styles.flexCol2}>
                <h6>{d?.heading}</h6>
                <p>{d?.details}</p>
                {isEditing && (
                  <button onClick={() => removeFacility(d._id)} className={styles.deleteBtn}>Remove</button>
                )}
              </li>
            );
          })}
        </ul>
        )
        :
        (<p className={styles.emptyNote}>No Facilities Available !</p> )}
       </div>
         <h5>Add A New Facility</h5>
          <div className={styles.flexCol}>
            <input
              type="text"
              value={newFacility?.heading}
              onChange={(e) =>
                setNewFacility({ ...newFacility, heading: e.target.value })
              }
              placeholder="Enter heading"
            />
            <textarea
              value={newFacility?.details}
              onChange={(e) =>
                setNewFacility({ ...newFacility, details: e.target.value })
              }
              placeholder="Enter details"
              rows={5}
              cols={50}
            ></textarea>

            <button onClick={handleAddFacility} className={styles.btnDark2}>Add Facility</button>

          </div>
        
    </div>
  );
}

export default EditFacilities;
