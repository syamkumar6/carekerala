/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import styles from "./HealthSheet.module.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLoaderData, useParams } from "react-router-dom";
import HealthSheetForm from "../../Components/Health-sheet/HealthSheetForm";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addAuthDetails, addUserAuth } from "../../Redux/Features/AuthSlice";

import editIcon from "../../assets/editIcon.svg";
import pdfIcon from "../../assets/pdfIcon.svg";

export async function loader({ params }) {
  axios.defaults.withCredentials = true;
  const hSheetRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/h-sheet/` + params.userId);
  const hSheet = hSheetRes.data;
  return { hSheet };
}

function HealthSheet() {
  const baseURL = import.meta.env.VITE_BASE_URL
  const dispatch = useDispatch()
  const { hSheet } = useLoaderData();
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editedImage, setEditedImage] = useState("");
  if (!hSheet) {
    return <HealthSheetForm />;
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
  const [editedDetails, setEditedDetails] = useState({
    personalInformation: {
      fullName: hSheet.personalInformation.fullName,
      image: hSheet.personalInformation.image,
      gender: hSheet.personalInformation.gender,
      dateOfBirth: hSheet.personalInformation.dateOfBirth,
      contactInformation: {
        address: hSheet.personalInformation.contactInformation.address,
        phoneNumber: hSheet.personalInformation.contactInformation.phoneNumber,
        email: hSheet.personalInformation.contactInformation.email,
      },
    },
    emergencyContacts: [...hSheet.emergencyContacts],
    medicalHistory: {
      allergies: [...hSheet.medicalHistory.allergies],
      preExistingConditions: [...hSheet.medicalHistory.preExistingConditions],
      surgeries: [...hSheet.medicalHistory.surgeries],
    },
    healthGoalsAndLifestyle: {
      dietaryHabits: hSheet.healthGoalsAndLifestyle.dietaryHabits,
      exerciseRoutine: hSheet.healthGoalsAndLifestyle.exerciseRoutine,
      healthGoals: [...hSheet.healthGoalsAndLifestyle.healthGoals],
    },
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedDetails({
      personalInformation: {
        fullName: hSheet.personalInformation.fullName,
        image: hSheet.personalInformation.image,
        gender: hSheet.personalInformation.gender,
        dateOfBirth: hSheet.personalInformation.dateOfBirth,
        contactInformation: {
          address: hSheet.personalInformation.contactInformation.address,
          phoneNumber:
            hSheet.personalInformation.contactInformation.phoneNumber,
          email: hSheet.personalInformation.contactInformation.email,
        },
      },
      emergencyContacts: [...hSheet.emergencyContacts],
      medicalHistory: {
        allergies: [...hSheet.medicalHistory.allergies],
        preExistingConditions: [...hSheet.medicalHistory.preExistingConditions],
        surgeries: [...hSheet.medicalHistory.surgeries],
      },
      healthGoalsAndLifestyle: {
        dietaryHabits: hSheet.healthGoalsAndLifestyle.dietaryHabits,
        exerciseRoutine: hSheet.healthGoalsAndLifestyle.exerciseRoutine,
        healthGoals: [...hSheet.healthGoalsAndLifestyle.healthGoals],
      },
    });
  };

  const handleEmergencyContactChange = (index, field, value) => {
    const updatedEmergencyContacts = [...editedDetails.emergencyContacts];
    updatedEmergencyContacts[index] = {
      ...updatedEmergencyContacts[index],
      [field]: value,
    };
    setEditedDetails({
      ...editedDetails,
      emergencyContacts: updatedEmergencyContacts,
    });
  };

  const handleAddMedicalHistory = (field) => {
    setEditedDetails((prevData) => ({
      ...prevData,
      medicalHistory: {
        ...prevData.medicalHistory,
        [field]: [...prevData.medicalHistory[field], ""],
      },
    }));
  };

  const handleRemoveMedicalHistory = (field, index) => {
    setEditedDetails((prevData) => ({
      ...prevData,
      medicalHistory: {
        ...prevData.medicalHistory,
        [field]: prevData.medicalHistory[field].filter((_, i) => i !== index),
      },
    }));
  };

  const handleSurgeriesChange = (index, field, value) => {
    const updatedSurgeries = [...editedDetails.medicalHistory.surgeries];
    updatedSurgeries[index] = {
      ...updatedSurgeries[index],
      [field]: value,
    };
    setEditedDetails({
      ...editedDetails,
      medicalHistory: {
        ...editedDetails.medicalHistory,
        surgeries: updatedSurgeries,
      },
    });
  };

  const handleAddSurgeries = () => {
    setEditedDetails((prevData) => ({
      ...prevData,
      medicalHistory: {
        ...prevData.medicalHistory,
        surgeries: [
          ...prevData.medicalHistory.surgeries,
          { name: "", date: "" },
        ],
      },
    }));
  };

  const handleRemoveSurgeries = (index) => {
    setEditedDetails((prevData) => ({
      ...prevData,
      medicalHistory: {
        ...prevData.medicalHistory,
        surgeries: prevData.medicalHistory.surgeries.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const handleAddHealthGoal = () => {
    setEditedDetails((prevData) => ({
      ...prevData,
      healthGoalsAndLifestyle: {
        ...prevData.healthGoalsAndLifestyle,
        healthGoals: [...prevData.healthGoalsAndLifestyle.healthGoals, ""],
      },
    }));
  };

  const handleRemoveHealthGoal = (index) => {
    setEditedDetails((prevData) => ({
      ...prevData,
      healthGoalsAndLifestyle: {
        ...prevData.healthGoalsAndLifestyle,
        healthGoals: prevData.healthGoalsAndLifestyle.healthGoals.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const handleDownloadPdf = async () => {
    try {
      const pdfOptions = {
        margin: 10,
        filename: "health_sheet.pdf",
        image: { type: "jpeg", quality: 2.0 },
      };
      const healthSheet = document.getElementById("healthSheet");
      if (!healthSheet) {
        console.error('Element with id "healthSheet" not found.');
        return;
      }
      const downloadButton = document.querySelector(`.${styles.btnDiv}`);
      downloadButton.classList.add(styles.hideInPdf);
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = async () => {
        try {
          const canvas = await html2canvas(healthSheet, { useCORS: true });
          if (canvas) {
            const imgData = canvas.toDataURL("image/jpeg", 5.0);
            const pdf = new jsPDF("p", "mm", "a4");
            pdf.addImage(
              imgData,
              "JPEG",
              0,
              0,
              pdf.internal.pageSize.getWidth(),
              pdf.internal.pageSize.getHeight()
            );
            pdf.save(pdfOptions.filename);
            downloadButton.classList.remove(styles.hideInPdf);
          } else {
            console.error("Canvas not created.");
          }
        } catch (error) {
          console.error("PDF generation error:", error);
        }
      };
      image.src = hSheet.personalInformation.image;
    } catch (err) {
      console.error(err);
    }
  };

  function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  const ConvertImage = (e) => {
    e.preventDefault();
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

  const handleSaveChanges = async () => {
    try {
      if (editedImage) {
        editedDetails.personalInformation.image = editedImage;
      }
      const data = editedDetails;
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${baseURL}/h-sheet/update/user/` + userId,data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setEditedDetails(res.data.hSheet);
      setIsEditing(false);
      toast.success("Sheet Updated Successfully");
    } catch (error) {
      console.error("Error updating  details:", error);
    }
  };

  const dateOfBirth = hSheet.personalInformation.dateOfBirth;
  const age = calculateAge(dateOfBirth);

  const handleAddContact = () => {
    setEditedDetails((prevData) => ({
      ...prevData,
      emergencyContacts: [
        ...prevData.emergencyContacts,
        { name: "", phoneNumber: "", relationship: "" },
      ],
    }));
  };

  const handleRemoveContact = () => {
    setEditedDetails((prevData) => ({
      ...prevData,
      emergencyContacts: prevData.emergencyContacts.slice(0, -1),
    }));
  };

  return (
    <main className={styles.container}>
      <div className={styles.hSheet} id="healthSheet">
        <div className={styles.sheetHeader}>
          <span className={styles.hide}>
            <h3>Care</h3>Kerala
          </span>
          <h2>Health Sheet</h2>
          <div>
            <span>www.carekerala.in</span>
            <span>carekerala@gmail.com</span>
            <span>+91-62-000-62-626</span>
          </div>
        </div>
        {!isEditing && (
          <div className={styles.btnDiv}>
            <button onClick={handleDownloadPdf} className={styles.sheetBtn}>
              <img src={pdfIcon} alt="" />
              Download as PDF
            </button>

            <button onClick={handleEditClick} className={styles.sheetBtn}>
              {" "}
              <img src={editIcon} alt="" />
              Edit Details
            </button>
          </div>
        )}

        {isEditing ? (
          <div className={styles.sheetInnerDiv1}>
            <div className={styles.flexCol}>
              <img
                src={editedImage || editedDetails.personalInformation.image}
                alt=""
              />
              {!editedImage ? (
                <>
                  <input
                    type="file"
                    id="imageInput"
                    name="image"
                    style={{ display: "none" }}
                  />
                  <button onClick={ConvertImage} className={styles.btnDark}>
                    {" "}
                    change image
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditedImage("")}
                  className={styles.btnRed}
                >
                  Cancel
                </button>
              )}
              <h3>
                {" "}
                Name :
                <input
                  type="text"
                  value={editedDetails.personalInformation.fullName || ""}
                  onChange={(e) =>
                    setEditedDetails((prevData) => ({
                      ...prevData,
                      personalInformation: {
                        ...prevData.personalInformation,
                        fullName: e.target.value,
                      },
                    }))
                  }
                />
              </h3>
            </div>

            <div className={styles.flexCol}>
              <h5>Contact</h5>
              Address :{" "}
              <input
                type="text"
                value={
                  editedDetails.personalInformation.contactInformation
                    .address || ""
                }
                onChange={(e) =>
                  setEditedDetails((prevData) => ({
                    ...prevData,
                    personalInformation: {
                      ...prevData.personalInformation,
                      contactInformation: {
                        ...prevData.personalInformation.contactInformation,
                        address: e.target.value,
                      },
                    },
                  }))
                }
              />
              Email ;{" "}
              <input
                type="email"
                value={
                  editedDetails.personalInformation.contactInformation.email ||
                  ""
                }
                onChange={(e) =>
                  setEditedDetails((prevData) => ({
                    ...prevData,
                    personalInformation: {
                      ...prevData.personalInformation,
                      contactInformation: {
                        ...prevData.personalInformation.contactInformation,
                        email: e.target.value,
                      },
                    },
                  }))
                }
              />
              Phone Number :
              <input
                type="number"
                value={
                  editedDetails.personalInformation.contactInformation
                    .phoneNumber || ""
                }
                onChange={(e) =>
                  setEditedDetails((prevData) => ({
                    ...prevData,
                    personalInformation: {
                      ...prevData.personalInformation,
                      contactInformation: {
                        ...prevData.personalInformation.contactInformation,
                        phoneNumber: e.target.value,
                      },
                    },
                  }))
                }
              />
              <h5>Emergency Contacts</h5>
              {editedDetails.emergencyContacts.map(
                (emergencyContact, index) => (
                  <div key={index} className={styles.flexCol}>
                    <input
                      type="text"
                      placeholder="Edit Name"
                      value={emergencyContact.name || ""}
                      onChange={(e) =>
                        handleEmergencyContactChange(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Edit Phone Number"
                      value={emergencyContact.phoneNumber || ""}
                      onChange={(e) =>
                        handleEmergencyContactChange(
                          index,
                          "phoneNumber",
                          e.target.value
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Edit Relationship"
                      value={emergencyContact.relationship || ""}
                      onChange={(e) =>
                        handleEmergencyContactChange(
                          index,
                          "relationship",
                          e.target.value
                        )
                      }
                    />
                  </div>
                )
              )}
              {editedDetails.emergencyContacts.length > 1 && (
                <button
                  onClick={handleRemoveContact}
                  className={styles.btnSelfRed}
                >
                  Remove Contact
                </button>
              )}
              <button onClick={handleAddContact} className={styles.btnSelfDark}>
                + Add Contact
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.sheetInnerDiv1}>
            <div className={styles.flexCol}>
              <img src={editedDetails.personalInformation.image} alt="" />
              <h3>{editedDetails.personalInformation.fullName}</h3>
              <span>Gender : {hSheet.personalInformation.gender}</span>
              <span>Age : {age}</span>
            </div>

            <div className={styles.flexCol}>
              <h5>Contact</h5>
              <span>
                Address :{" "}
                {editedDetails.personalInformation.contactInformation.address}
              </span>
              <span>
                Email ;{" "}
                {editedDetails.personalInformation.contactInformation.email}
              </span>
              <span>
                Phone Number :{" "}
                {
                  editedDetails.personalInformation.contactInformation
                    .phoneNumber
                }
              </span>
              <h5>Emergency Contacts</h5>

              {editedDetails.emergencyContacts.map((d, index) => {
                return (
                  <div key={index} className={styles.flexCol}>
                    <span>Name : {d.name}</span>
                    <span>Phone Number : {d.phoneNumber}</span>
                    <span>Relationship : {d.relationship}</span>
                  </div>
                );
              })}
            </div>
            <div className={`${styles.flexCol} ${styles.hide}`}>
              <h5>Last Updated</h5>
              <span>Doctor : {hSheet.lastUpdated?.doctor?.name}</span>
              <span>
                hospital : {hSheet.lastUpdated?.hospital?.name}{" "}
                {hSheet.lastUpdated.place}
              </span>
              <span>date : {hSheet.lastUpdated?.date}</span>
            </div>
          </div>
        )}

        {isEditing ? (
          <div className={styles.sheetDetails}>
            <div className={styles.editingSheetDetails}>
              <div className={styles.editingDivCol}>
                <h5>Allergies</h5>
                {editedDetails.medicalHistory.allergies.map(
                  (allergy, index) => (
                    <div key={index} className={styles.flexCol}>
                      <input
                        className={styles.wFull}
                        type="text"
                        value={allergy || ""}
                        onChange={(e) =>
                          setEditedDetails((prevData) => ({
                            ...prevData,
                            medicalHistory: {
                              ...prevData.medicalHistory,
                              allergies: prevData.medicalHistory.allergies.map(
                                (item, i) =>
                                  i === index ? e.target.value : item
                              ),
                            },
                          }))
                        }
                      />
                      <button
                        onClick={() =>
                          handleRemoveMedicalHistory("allergies", index)
                        }
                        className={styles.btnSelfRed}
                      >
                        Remove
                      </button>
                    </div>
                  )
                )}
                <button
                  onClick={() => handleAddMedicalHistory("allergies")}
                  className={styles.btnSelfDark}
                >
                  + Add Allergy
                </button>
              </div>

              <div className={styles.editingDivCol}>
                <h5>Pre-Existing Conditions</h5>
                {editedDetails.medicalHistory.preExistingConditions.map(
                  (condition, index) => (
                    <div key={index} className={styles.flexCol}>
                      <input
                        className={styles.wFull}
                        type="text"
                        value={condition || ""}
                        onChange={(e) =>
                          setEditedDetails((prevData) => ({
                            ...prevData,
                            medicalHistory: {
                              ...prevData.medicalHistory,
                              preExistingConditions:
                                prevData.medicalHistory.preExistingConditions.map(
                                  (item, i) =>
                                    i === index ? e.target.value : item
                                ),
                            },
                          }))
                        }
                      />
                      <button
                        onClick={() =>
                          handleRemoveMedicalHistory(
                            "preExistingConditions",
                            index
                          )
                        }
                        className={styles.btnSelfRed}
                      >
                        Remove
                      </button>
                    </div>
                  )
                )}
                <button
                  onClick={() =>
                    handleAddMedicalHistory("preExistingConditions")
                  }
                  className={styles.btnSelfDark}
                >
                  + Add Pre-Existing Condition
                </button>
              </div>

              <div className={styles.editingDivCol}>
                <h5>Surgeries </h5>
                {editedDetails.medicalHistory.surgeries.map(
                  (surgeriesItem, index) => (
                    <div key={index} className={styles.flexCol}>
                      <input
                        className={styles.wFull}
                        type="text"
                        placeholder="Name"
                        value={surgeriesItem.name || ""}
                        onChange={(e) =>
                          handleSurgeriesChange(index, "name", e.target.value)
                        }
                      />
                      <input
                        type="date"
                        placeholder="Date"
                        value={surgeriesItem.date || ""}
                        onChange={(e) =>
                          handleSurgeriesChange(index, "date", e.target.value)
                        }
                      />

                      <button
                        onClick={() => handleRemoveSurgeries(index)}
                        className={styles.btnSelfRed}
                      >
                        Remove
                      </button>
                    </div>
                  )
                )}
                <button
                  onClick={handleAddSurgeries}
                  className={styles.btnSelfDark}
                >
                  + Add Surgery
                </button>
              </div>

              <div className={styles.editingDivCol}>
                <h5>Hietary Habits</h5>
                <input
                  className={styles.wFull}
                  type="text"
                  value={
                    editedDetails.healthGoalsAndLifestyle.dietaryHabits || ""
                  }
                  onChange={(e) =>
                    setEditedDetails((prevData) => ({
                      ...prevData,
                      healthGoalsAndLifestyle: {
                        ...prevData.healthGoalsAndLifestyle,
                        dietaryHabits: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div className={styles.editingDivCol}>
                <h5>Exercise Routine</h5>
                <input
                  type="text"
                  value={
                    editedDetails.healthGoalsAndLifestyle.exerciseRoutine || ""
                  }
                  onChange={(e) =>
                    setEditedDetails((prevData) => ({
                      ...prevData,
                      healthGoalsAndLifestyle: {
                        ...prevData.healthGoalsAndLifestyle,
                        exerciseRoutine: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div className={styles.editingDivCol}>
                <h5>Health Goals</h5>
                {editedDetails.healthGoalsAndLifestyle.healthGoals.map(
                  (goal, index) => (
                    <div key={index} className={styles.flexCol}>
                      <input
                        className={styles.wFull}
                        type="text"
                        value={goal || ""}
                        onChange={(e) =>
                          setEditedDetails((prevData) => ({
                            ...prevData,
                            healthGoalsAndLifestyle: {
                              ...prevData.healthGoalsAndLifestyle,
                              healthGoals:
                                prevData.healthGoalsAndLifestyle.healthGoals.map(
                                  (item, i) =>
                                    i === index ? e.target.value : item
                                ),
                            },
                          }))
                        }
                      />
                      <button
                        onClick={() => handleRemoveHealthGoal(index)}
                        className={styles.btnSelfRed}
                      >
                        Remove Health Goal
                      </button>
                    </div>
                  )
                )}
                <button
                  onClick={handleAddHealthGoal}
                  className={styles.btnSelfDark}
                >
                  + Add Health Goal
                </button>
              </div>
            </div>
            <div className={styles.bottomBtns}>
              <button onClick={handleCancelEdit} className={styles.btnCancel}>
                Cancel
              </button>
              <button onClick={handleSaveChanges} className={styles.btnSave}>
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.sheetDetails}>
            <div className={styles.bgDiv}>&nbsp;</div>
            <div className={styles.flexCol}>
              <h3>Medical History</h3>
              <span className={styles.flexRow}>
                PreExisting Conditions :{" "}
                {hSheet.medicalHistory.preExistingConditions?.map(
                  (d, index) => {
                    return <li key={index}>{d}</li>;
                  }
                )}
              </span>
              <span className={styles.flexRow}>
                Allergies :{" "}
                {hSheet.medicalHistory.allergies?.map((d, index) => {
                  return <li key={index}>{d}</li>;
                })}
              </span>
              <span>
                Surgeries :{" "}
                {hSheet.medicalHistory.surgeries.map((d, index) => {
                  return (
                    <li key={index} className={styles.flexCol}>
                      <span>Name : {d.name}</span>
                      <span>
                        Date :{" "}
                        {new Date(d.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </li>
                  );
                })}
              </span>
            </div>

            <div>
              <h3>Diagnostic Test Results</h3>
              {hSheet.diagnosticTestResults?.length > 0 ? (
                <ul>
                  {hSheet.diagnosticTestResults.map((d, index) => {
                    return (
                      <li key={index}>
                        <span>Type : {d.type}</span>
                        <span>Result : {d.result}</span>
                        <span>Date : {d.date}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No Diagnostic Test Results available.</p>
              )}
            </div>

            <div>
              <h3>Vital Signs</h3>
              {hSheet.vitalSigns ? (
                <div className={styles.listCol}>
                  <span>
                    Blood Pressure : {hSheet.vitalSigns.bloodPressure}
                  </span>
                  <span>
                    Body Temperature : {hSheet.vitalSigns.bodyTemperature}
                  </span>
                  <span>Heart Rate : {hSheet.vitalSigns.heartRate}</span>
                  <span>
                    Respiratory Rate : {hSheet.vitalSigns.respiratoryRate}
                  </span>
                </div>
              ) : (
                <p>No datas Available</p>
              )}
            </div>

            <div>
              <h3>Medications</h3>
              {hSheet.medications?.length > 0 ? (
                <ul>
                  {hSheet.medications.map((d, index) => {
                    return (
                      <li key={index}>
                        <span>Name : {d.name}</span>
                        <span>Dosage : {d.dosage}</span>
                        <span>Frequency : {d.frequency}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No medications available.</p>
              )}
            </div>

            <div>
              <h3>Health Report</h3>
              {hSheet.finalReport &&
              (hSheet.finalReport.date || hSheet.finalReport.report) ? (
                <>
                  <span>
                    Date :{" "}
                    {new Date(hSheet.finalReport.date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                  <p>{hSheet.finalReport.report}</p>
                </>
              ) : (
                <p>No Reports available.</p>
              )}
            </div>

            <div>
              <h3>Health Goals And Lifestyle</h3>
              <h6>Hietary Habits</h6>
              <p>{hSheet.healthGoalsAndLifestyle.dietaryHabits}</p>
              <h6>Exercise Routine</h6>
              <p>{hSheet.healthGoalsAndLifestyle.exerciseRoutine}</p>
              <h6>Health Goals</h6>
              {hSheet.healthGoalsAndLifestyle.healthGoals?.length > 0 ? (
                <p>
                  {hSheet.healthGoalsAndLifestyle.healthGoals.map(
                    (d, index) => {
                      return <li key={index}>{d}</li>;
                    }
                  )}
                </p>
              ) : (
                <p>No health Goals Added.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default HealthSheet;
