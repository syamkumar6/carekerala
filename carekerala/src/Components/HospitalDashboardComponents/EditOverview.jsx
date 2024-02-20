/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "./EditOverview.module.css"
import axios from "axios";
import { toast } from 'react-hot-toast';

function EditOverview({hospital, setHospital}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState(hospital?.description || "");
  
    useEffect(() => {
        if (isEditing) {
          const textarea = document.getElementById("editedDescriptionTextarea");
          if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
          }
        }
    }, [isEditing, editedDescription]);

    const handleSaveChanges = async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/hospitals/dashboard/description/${hospital._id}`,
            { editedDescription },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          setHospital(response.data.hospital);
          setIsEditing(false);
          toast.success('Description updated successfully');
        } catch (error) {
          toast.error('Error updating description');
          console.error("Error updating description:", error);
        }
      };
  
    const handleCancel = () => {
      setEditedDescription(hospital?.description || "");
      setIsEditing(false);
    };
  
    return (
      <div className={styles.overviewDiv}>
        <div className={styles.flexDiv}>
        <h4>Update Overview</h4>
        {!isEditing && (
            <button onClick={() => setIsEditing(true)} className={styles.btnDark}>Update Overview</button>
          )}
        </div>
        <div className={styles.overviewNote}>
          {isEditing ? (
            <textarea
              id="editedDescriptionTextarea"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={editedDescription.split("\n\n").length + 1}
              cols={60}
              style={{ width: '100%', height: '100%', resize: 'none' }}
            />
          ) : (
            hospital && hospital.description ? (
              hospital?.description?.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>))
            ) : (
              <p className={styles.noteRed}>No description available.</p>
            ))}
        </div>
        {isEditing && (
          <div className={styles.flexDiv2}>
            <button onClick={handleCancel} className={styles.redBtn}>Cancel</button>
            <button onClick={handleSaveChanges} className={styles.btnDark}>Save Changes</button>
          </div>
        )}
      </div>
    );
  }

export default EditOverview