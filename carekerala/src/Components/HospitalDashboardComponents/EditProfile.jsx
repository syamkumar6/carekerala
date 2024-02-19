/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./EditProfile.module.css";
import toast from "react-hot-toast";
import axios from "axios";

function EditProfile({ hospital, setHospital }) {
  const [editedHospital, SetEditedHospital] = useState(hospital);
  const [editedImage, setEditedImage] = useState("");

  const handleCancel = () => {
    SetEditedHospital(hospital);
    setEditedImage("");
  };

  const handleImageChange = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setEditedImage(base64Data);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveChanges = () => {
    const hospitalId = hospital._id;
    if (editedImage) {
        editedHospital.image = editedImage;
      }
      console.log(editedHospital)
      axios.defaults.withCredentials = true;
    axios.post(`${import.meta.env.VITE_BASE_URL}/hospitals/dashboard/update-profile/` + hospitalId,{editedHospital},
        {
            headers: {
              "Content-Type": "multipart/form-data",
            },
        }
      )
      .then((res) => {
        setHospital(res.data.hospital);
        toast.success(res.data.message);
      })
      .catch((error) => {
        console.error("Error updating image:", error);
        toast.error("Failed to update image");
      });
  };

  const handleDistrictChange = (e) => {
    const { name, value } = e.target;
    SetEditedHospital((prevDoctor) => ({
      ...prevDoctor,
      [name]: name === "district" ? String(value) : value,
    }));
  };

  const handleRadioChange = (event) => {
    const newValue = event.target.value === "true";
    SetEditedHospital((prevDoctor) => ({ ...prevDoctor, isVisible: newValue }));
  };

  return (
    <div className={styles.profileDiv}>
      <h3>Update Profile Details</h3>
      <div className={styles.editingContainer}>
        <div className={styles.flexRow}>
          <div className={styles.flexCol}>
            <div className={styles.imgContainer}>
              <img
                src={editedImage || editedHospital.image}
                alt=""
                className={styles.profileImg}
              />
              {!editedImage && (
                <>
                  <input
                    type="file"
                    id="imageInput"
                    name="image"
                    style={{ display: "none" }}
                  />
                </>
              )}
            </div>
            {editedImage ? (
              <button
                onClick={() => setEditedImage("")}
                className={styles.btnRed2}
              >
                Revome
              </button>
            ) : (
              <button
                onClick={handleImageChange}
                className={styles.btnDark2}
              >
                {" "}
                add image
              </button>
            )}

            <div className={styles.flexCol}>
              <h5>Hospital Name: </h5>
              <input
                type="text"
                value={editedHospital.name || ""}
                onChange={(e) =>
                  SetEditedHospital((prevDoctor) => ({
                    ...prevDoctor,
                    name: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className={styles.flexCol}>
            <h6>Address: </h6>
            <input
              type="text"
              value={editedHospital.address || ""}
              onChange={(e) =>
                SetEditedHospital((prevDoctor) => ({
                  ...prevDoctor,
                  address: e.target.value,
                }))
              }
            />

            <h6>District: </h6>
            <select
              name="district"
              id="district"
              value={editedHospital.district || ""}
              onChange={handleDistrictChange}
            >
              <option>select one</option>
              <option value="Thiruvananthapuram">Thiruvananthapuram</option>
              <option value="Kollam">Kollam</option>
              <option value="Alappuzha">Alappuzha</option>
              <option value="Pathanamthitta">Pathanamthitta</option>
              <option value="Kottayam">Kottayam</option>
              <option value="Idukki">Idukki</option>
              <option value="Ernakulam">Ernakulam</option>
              <option value="Thrissur">Thrissur</option>
              <option value="Palakkad">Palakkad</option>
              <option value="Malappuram">Malappuram</option>
              <option value="Kozhikode">Kozhikode</option>
              <option value="Wayanad">Wayanad</option>
              <option value="Kannur">Kannur</option>
              <option value="Kasaragod">Kasaragod</option>
            </select>

            <h6>Phone Number: </h6>
            <input
              type="number"
              value={editedHospital.phone || ""}
              onChange={(e) =>
                SetEditedHospital((prevDoctor) => ({
                  ...prevDoctor,
                  phone: e.target.value,
                }))
              }
            />
              
              <h6>Change Account Privacy</h6>
            <label>
              <input
                type="radio"
                value="true"
                checked={editedHospital.isVisible === true}
                onChange={handleRadioChange}
              />
              Public
            </label>
            <label>
              <input
                type="radio"
                value="false"
                checked={editedHospital.isVisible === false}
                onChange={handleRadioChange}
              />
              Private
            </label>
          </div>
         
        </div>

        
          <div className={styles.bottomBtnContainer}>
            <button onClick={handleCancel} className={styles.btnRed}>
              Cancel
            </button>
            <button onClick={handleSaveChanges} className={styles.btnDark}>
              Save Changes
            </button>
          </div>
       
      </div>
    </div>
  );
}

export default EditProfile;
