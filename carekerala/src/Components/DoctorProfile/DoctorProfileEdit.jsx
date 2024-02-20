/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import styles from "./DoctorProfileEdit.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";

function DoctorProfileEdit({ doctor, setDoctor }) {
  const [loading, setLoading] = useState(false)
  const [editedDoctor, setEditedDoctor] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editDrImage, setEditDrImage] = useState("");

  const handleEdit = (doctor) => {
    setEditedDoctor(doctor);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedDoctor({});
    setIsEditing(false);
    setEditDrImage("");
  };

  useEffect(() => {
    if(!doctor.category){
      setEditedDoctor(doctor);
      setIsEditing(true)
    }
  },[])

  const handleSaveChanges = async () => {
    try {
      setLoading(true)
      if (editDrImage) {
        editedDoctor.image = editDrImage;
      }
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/doctors/update-doctor/` +editedDoctor._id,
        { editedDoctor },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setDoctor(response.data);
      setLoading(false)
      setEditedDoctor("");
      setIsEditing(false); 
      toast.success("Details updated successfully");
    } catch (error) {
      console.error("Error updating doctor details:", error);
      setLoading(false)
    }
  };

  const handleDistrictChange = (e) => {
    const { name, value } = e.target;
    setEditedDoctor((prevDoctor) => ({
      ...prevDoctor,
      [name]: name === 'district' ? String(value) : value,
    }));
  };

  const handleImageChange = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setEditDrImage(base64Data);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRadioChange = (event) => {
    const newValue = event.target.value === "true";
    setEditedDoctor((prevDoctor) => ({ ...prevDoctor, isVisible: newValue }));
  };

  return (
    <div> 
      <div>
        {isEditing ? (
          <div className={styles.editingContainer}>
            {!doctor.category && (<h1>Pleace Create a Profile</h1>)}
            <div className={styles.flexRow}>
              <div className={styles.flexCol}>
                <div className={styles.imgContainer}>
                  <img
                    src={editDrImage || doctor.image}
                    alt=""
                    className={styles.doctorImg2}
                  />
                  {!editDrImage && (
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
                {editDrImage ? (
                  <button
                    onClick={() => setEditDrImage("")}
                    className={styles.redBtnSelf}
                  >
                    Revome
                  </button>
                ) : (
                  <button
                    onClick={handleImageChange}
                    className={styles.btnDarkSelf}
                  >
                    {" "}
                    add image
                  </button>
                )}

                <div className={styles.flexCol}>
                  <h5>Name: </h5>
                  <input
                    type="text"
                    value={editedDoctor.name || ""}
                    onChange={(e) =>
                      setEditedDoctor((prevDoctor) => ({
                        ...prevDoctor,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <h6>Address: </h6>
                <input
                  type="text"
                  value={editedDoctor.address || ""}
                  onChange={(e) =>
                    setEditedDoctor((prevDoctor) => ({
                      ...prevDoctor,
                      address: e.target.value,
                    }))
                  }
                />

                <h6>District: </h6>
                <select 
                name="district" 
                id="district"
                value={editedDoctor.district || ""}
                onChange={handleDistrictChange}
                >
                  <option >select one</option>
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
              </div>
              <div className={styles.flexCol}>
                <h6>Phone Number: </h6>
                <input
                  type="number"
                  value={editedDoctor.phone || ""}
                  onChange={(e) =>
                    setEditedDoctor((prevDoctor) => ({
                      ...prevDoctor,
                      phone: e.target.value,
                    }))
                  }
                />

                <h6>Category: </h6>
                <input
                  type="text"
                  value={editedDoctor.category || ""}
                  onChange={(e) =>
                    setEditedDoctor((prevDoctor) => ({
                      ...prevDoctor,
                      category: e.target.value,
                    }))
                  }
                />

                <h6>Speciality: </h6>
                <input
                  type="text"
                  value={editedDoctor.speciality || ""}
                  onChange={(e) =>
                    setEditedDoctor((prevDoctor) => ({
                      ...prevDoctor,
                      speciality: e.target.value,
                    }))
                  }
                />

                <h6>Languages : </h6>
                <input
                  type="text"
                  value={editedDoctor.languages || ""}
                  onChange={(e) =>
                    setEditedDoctor((prevDoctor) => ({
                      ...prevDoctor,
                      languages: e.target.value,
                    }))
                  }
                />

                <h6>Qualification : </h6>
                <input
                  type="text"
                  value={editedDoctor.qualification || ""}
                  onChange={(e) =>
                    setEditedDoctor((prevDoctor) => ({
                      ...prevDoctor,
                      qualification: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <h5>Overview</h5>
            <textarea
              id=""
              value={editedDoctor.about || ""}
              onChange={(e) =>
                setEditedDoctor((prevDoctor) => ({
                  ...prevDoctor,
                  about: e.target.value,
                }))
              }
              rows={10}
              cols={50}
              style={{
                width: "100%",
                height: "100%",
                resize: "none",
              }}
            />

            <div className={styles.flexRowBottom}>
              <h6>Change Account Privacy</h6>

              <label>
                <input
                  type="radio"
                  value="true"
                  checked={editedDoctor.isVisible === true}
                  onChange={handleRadioChange}
                />
                Public
              </label>
              <label>
                <input
                  type="radio"
                  value="false"
                  checked={editedDoctor.isVisible === false}
                  onChange={handleRadioChange}
                />
                Private
              </label>
            </div>

            <div className={styles.bottomBtnContainer}>
              <div>
                <button onClick={handleCancel} className={styles.redBtn}>
                  Cancel
                </button>
                <button onClick={handleSaveChanges} className={styles.btnDark}>
                {loading ?  <PulseLoader size={7}   color={'rgb(236, 236, 236)'} /> : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.editingContainer}>
            {!isEditing && (
              <button
                onClick={() => handleEdit(doctor)}
                className={styles.topBtn}
              >
                Update details
              </button>
            )}
            <div className={styles.flexRow}>
              <div className={styles.flexCol}>
                <img src={doctor?.image} alt="" className={styles.doctorImg2} />

                <h5>Name: {doctor?.name}</h5>

                <span><strong>Category :</strong> {doctor?.category}</span>
                <span><strong>Speciality :</strong> {doctor?.speciality}</span>
              </div>

              <div className={styles.flexCol}>
                <h5>Address</h5>
                <span>{doctor.address}</span>

                <h5>Email</h5>
                <span>{doctor.email}</span>

                <h5>Phone Number</h5>
                <span>{doctor.phone}</span>

                <h5>Languages</h5>
                <span>{doctor?.languages}</span>
              </div>
            </div>

            <div>
              <h5>Overview</h5>
              <p>{doctor?.about}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorProfileEdit;
