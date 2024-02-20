/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "./UpdateSheet.module.css";
import axios from "axios";
import editIcon from "../../assets/editIcon.svg";
import { useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";

function UpdateSheet({ data }) {
  const doctor = useParams();
  console.log(doctor.userId)
  const [editSheet, setEditSheet] = useState(data.sheet);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false)
  const [editedDetails, setEditedDetails] = useState({
    vitalSigns: {
      bloodPressure: editSheet?.vitalSigns?.bloodPressure || "",
      heartRate: editSheet?.vitalSigns?.heartRate || "",
      respiratoryRate: editSheet?.vitalSigns?.respiratoryRate || "",
      bodyTemperature: editSheet?.vitalSigns?.bodyTemperature || "",
    },
    diagnosticTestResults: editSheet?.diagnosticTestResults
      ? [...editSheet.diagnosticTestResults]
      : [],
    medications: editSheet?.medications ? [...editSheet.medications] : [],
    finalReport: {
      date: editSheet?.finalReport?.date || "",
      report: editSheet?.finalReport?.report || "",
    },
    lastUpdated: {
      doctor: editSheet?.lastUpdated?.doctor || "",
      hospital: editSheet?.lastUpdated?.hospital || "",
      date: editSheet?.lastUpdated?.date,
    },
  });
  console.log(data)

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDetails({
      vitalSigns: {
        bloodPressure: editSheet?.vitalSigns?.bloodPressure || "",
        heartRate: editSheet?.vitalSigns?.heartRate || "",
        respiratoryRate: editSheet?.vitalSigns?.respiratoryRate || "",
        bodyTemperature: editSheet?.vitalSigns?.bodyTemperature || "",
      },
      diagnosticTestResults: editSheet?.diagnosticTestResults
        ? [...editSheet.diagnosticTestResults]
        : [],
      medications: editSheet?.medications ? [...editSheet.medications] : [],
      finalReport: {
        date: editSheet?.finalReport?.date || "",
        report: editSheet?.finalReport?.report || "",
      },
      lastUpdated: {
        doctor: editSheet?.lastUpdated?.doctor || "",
        hospital: editSheet?.lastUpdated?.hospital || "",
        date: editSheet?.lastUpdated?.date,
      },
    });
  };

  useEffect(() => {
    const fetchSheet = async () => {
      try {
        console.log("userid",data.userId)
        axios.defaults.withCredentials = true;
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/h-sheet/` + data.userId);

        setEditSheet(res.data);
        console.log("Sheet data fetched:", res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (data.userId) {
      fetchSheet();
    }
  }, [data.userId]);

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (data) {
        editedDetails.lastUpdated.doctor = doctor.userId;
        editedDetails.lastUpdated.hospital = data.hospitalId;
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        editedDetails.lastUpdated.date = formattedDate;
        editedDetails.finalReport.date = formattedDate;
      }
      const editedData = editedDetails;
      console.log(editedData);
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/h-sheet/update/doctor/` + data.userId,editedData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    
      setEditSheet(res.data.hSheet);
      setLoading(false)
      setIsEditing(false);
    } catch (err) {
      console.log(err);
      setLoading(false)
    }
  };

  const handleMedicationsChange = (index, field, value) => {
    const updatedMedicationsContacts = [...editedDetails.medications];
    updatedMedicationsContacts[index] = {
      ...updatedMedicationsContacts[index],
      [field]: value,
    };
    setEditedDetails({
      ...editedDetails,
      medications: updatedMedicationsContacts,
    });
  };

  const handleAddMedications = () => {
    setEditedDetails((prevData) => ({
      ...prevData,
      medications: [
        ...prevData.medications,
        { name: "", dosage: "", frequency: "" },
      ],
    }));
  };

  const handleRemoveMedications = () => {
    setEditedDetails((prevData) => ({
      ...prevData,
      medications: prevData.medications.slice(0, -1),
    }));
  };

  const handleTestResultChange = (index, field, value) => {
    const updatedTestResult = [...editedDetails.diagnosticTestResults];
    updatedTestResult[index] = {
      ...updatedTestResult[index],
      [field]: value,
    };
    setEditedDetails({
      ...editedDetails,
      diagnosticTestResults: updatedTestResult,
    });
  };

  const handleAddTestResult = () => {
    setEditedDetails((prevData) => ({
      ...prevData,
      diagnosticTestResults: [
        ...prevData.diagnosticTestResults,
        { type: "", result: "", date: "" },
      ],
    }));
  };

  const handleRemoveTestResult = () => {
    setEditedDetails((prevData) => ({
      ...prevData,
      diagnosticTestResults: prevData.diagnosticTestResults.slice(0, -1),
    }));
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
  const age = calculateAge(editSheet?.personalInformation.dateOfBirth);

  return (
    <div className={styles.container}>
      <div className={styles.sheetHeader}>
        <span>
          <h3>Care</h3>Kerala
        </span>
        <h2>Health Sheet</h2>
        <div>
          <span>www.carekerala.in</span>
          <span>carekerala@gmail.com</span>
          <span>+91-62-000-62-626</span>
        </div>
      </div>
      
        <div>
          {isEditing ? (
            <div>
              <div className={styles.sheetInnerDiv1}>
                <div className={styles.flexRow}>
                  <div className={styles.flexCol}>
                    <h6>Vital Signs</h6>
                    <span>Blood Pressure:</span>
                    <input
                      type="text"
                      value={editedDetails?.vitalSigns.bloodPressure || ""}
                      onChange={(e) =>
                        setEditedDetails((prevData) => ({
                          ...prevData,
                          vitalSigns: {
                            ...prevData.vitalSigns,
                            bloodPressure: e.target.value,
                          },
                        }))
                      }
                    />
                    <span>heart Rate :</span>
                    <input
                      type="text"
                      value={editedDetails?.vitalSigns.heartRate || ""}
                      onChange={(e) =>
                        setEditedDetails((prevData) => ({
                          ...prevData,
                          vitalSigns: {
                            ...prevData.vitalSigns,
                            heartRate: e.target.value,
                          },
                        }))
                      }
                    />
                    <span>respiratory Rate:</span>
                    <input
                      type="text"
                      value={editedDetails?.vitalSigns.respiratoryRate || ""}
                      onChange={(e) =>
                        setEditedDetails((prevData) => ({
                          ...prevData,
                          vitalSigns: {
                            ...prevData.vitalSigns,
                            respiratoryRate: e.target.value,
                          },
                        }))
                      }
                    />
                    <span>body Temperature: </span>
                    <input
                      type="text"
                      value={editedDetails?.vitalSigns.bodyTemperature || ""}
                      onChange={(e) =>
                        setEditedDetails((prevData) => ({
                          ...prevData,
                          vitalSigns: {
                            ...prevData.vitalSigns,
                            bodyTemperature: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className={styles.flexCol}>
                    <h6>Diagnostic Test Results</h6>
                    {editedDetails?.diagnosticTestResults.map(
                      (result, index) => (
                        <div key={index} className={styles.flexCol}>
                          <input
                            type="text"
                            placeholder="Type"
                            value={result.type || ""}
                            onChange={(e) =>
                              handleTestResultChange(
                                index,
                                "type",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="text"
                            placeholder="Result"
                            value={result.result || ""}
                            onChange={(e) =>
                              handleTestResultChange(
                                index,
                                "result",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="date"
                            placeholder="Date"
                            value={result.date || ""}
                            onChange={(e) =>
                              handleTestResultChange(
                                index,
                                "date",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )
                    )}
                    {editedDetails?.diagnosticTestResults.length > 1 && (
                      <button
                        onClick={handleRemoveTestResult}
                        className={styles.btnSelfRed}
                      >
                        Remove Test Result
                      </button>
                    )}
                    <button
                      onClick={handleAddTestResult}
                      className={styles.btnSelfDark}
                    >
                      + Add Test Result
                    </button>

                    <h6>Medications</h6>
                    {editedDetails?.medications.map((data, index) => (
                      <div key={index} className={styles.flexCol}>
                        <input
                          type="text"
                          placeholder="Name"
                          value={data.name || ""}
                          onChange={(e) =>
                            handleMedicationsChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                        />
                        <input
                          type="text"
                          placeholder="Dosage"
                          value={data.dosage || ""}
                          onChange={(e) =>
                            handleMedicationsChange(
                              index,
                              "dosage",
                              e.target.value
                            )
                          }
                        />
                        <input
                          type="text"
                          placeholder="Frequency"
                          value={data.frequency || ""}
                          onChange={(e) =>
                            handleMedicationsChange(
                              index,
                              "frequency",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                    {editedDetails?.medications.length > 1 && (
                      <button
                        onClick={handleRemoveMedications}
                        className={styles.btnSelfRed}
                      >
                        Remove Medications
                      </button>
                    )}
                    <button
                      onClick={handleAddMedications}
                      className={styles.btnSelfDark}
                    >
                      + Add Medications
                    </button>
                  </div>
                </div>
                <div>
                  <div>
                    <h6>Report</h6>
                    <textarea
                      value={editedDetails.finalReport.report || ""}
                      onChange={(e) =>
                        setEditedDetails((prevData) => ({
                          ...prevData,
                          finalReport: {
                            ...prevData.finalReport,
                            report: e.target.value,
                          },
                        }))
                      }
                      cols="30"
                      rows="10"
                    ></textarea>
                  </div>
                </div>
                <div className={styles.btnDiv}>
                  <button onClick={handleCancel} className={styles.btnRed}>Cancel</button>
                  <button onClick={handleSubmit} className={styles.btnGreen}>{loading ?  <PulseLoader size={7}   color={'rgb(236, 236, 236)'} /> : 'Save Changes'}</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.sheetInnerDiv1}>
                
                  <div className={styles.btnDiv}>
                    <button
                      onClick={() => setIsEditing(true)}
                      className={styles.sheetBtn}
                      disabled={editSheet?.updatePermission === false}
                    >
                      {" "}
                      <img src={editIcon} alt="" />
                      Edit Details
                    </button>
                  </div>
                
                <div className={styles.flexRow}>
                  <div className={styles.flexCol}>
                    <img src={editSheet?.personalInformation.image} alt="" />
                    <h3>{editSheet?.personalInformation.fullName}</h3>
                    <span>
                      Gender : {editSheet?.personalInformation.gender}
                    </span>
                    <span>Age : {age}</span>
                  </div>

                  <div className={styles.flexCol}>
                    <h5>Contact</h5>
                    <span>
                      Address :{" "}
                      {
                        editSheet?.personalInformation.contactInformation
                          .address
                      }
                    </span>
                    <span>
                      Email ;{" "}
                      {editSheet?.personalInformation.contactInformation.email}
                    </span>
                    <span>
                      Phone Number :{" "}
                      {
                        editSheet?.personalInformation.contactInformation
                          .phoneNumber
                      }
                    </span>
                    <h5>Emergency Contacts</h5>

                    {editSheet?.emergencyContacts.map((d, index) => {
                      return (
                        <div key={index} className={styles.flexCol}>
                          <span>Name : {d.name}</span>
                          <span>Phone Number : {d.phoneNumber}</span>
                          <span>Relationship : {d.relationship}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className={styles.flexCol}>
                    <h5>Last Updated</h5>
                    <span>Doctor : {editSheet?.lastUpdated.doctor?.name}</span>
                    <span>
                      hospital : {editSheet?.lastUpdated.hospital?.name}{" "}
                    </span>
                    <span>date : {editSheet?.lastUpdated.date}</span>
                  </div>
                </div>
              </div>

              <div className={styles.sheetDetails}>
              <div className={styles.bgDiv}>&nbsp;</div>
                <div className={styles.flexRow}>
                  <div className={styles.flexCol}>
                    <h3>Medical History</h3>
                    <span className={styles.flexCol}>
                      <h6>PreExisting Conditions :</h6>
                      {editSheet?.medicalHistory.preExistingConditions?.map(
                        (d, index) => {
                          return <li key={index}>{d}</li>;
                        }
                      )}
                    </span>
                    <span className={styles.flexCol}>
                      <h6>Allergies :</h6>
                      {editSheet?.medicalHistory.allergies?.map((d, index) => {
                        return <li key={index}>{d}</li>;
                      })}
                    </span>
                    <span className={styles.flexCol}>
                      <h6>Surgeries :</h6>
                      {editSheet?.medicalHistory.surgeries.map((d, index) => {
                        const formattedDate = new Date(
                          d.date
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        });
                        return (
                          <li key={index} className={styles.flexCol}>
                            <span>Name : {d.name}</span>
                            <span>Date : {formattedDate}</span>
                          </li>
                        );
                      })}
                    </span>
                  </div>
                  <div className={styles.flexCol}>
                    <div>
                      <h3>Diagnostic Test Results</h3>
                      {editSheet?.diagnosticTestResults?.length > 0 ? (
                        <ul>
                          {editSheet?.diagnosticTestResults.map((d, index) => {
                            return (
                              <li key={index} className={styles.flexCol}>
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
                      <div className={styles.flexCol}>
                        <span>
                          Blood Pressure :{" "}
                          {editSheet?.vitalSigns?.bloodPressure}
                        </span>
                        <span>
                          Body Temperature :{" "}
                          {editSheet?.vitalSigns?.bodyTemperature}
                        </span>
                        <span>
                          Heart Rate : {editSheet?.vitalSigns?.heartRate}
                        </span>
                        <span>
                          Respiratory Rate :{" "}
                          {editSheet?.vitalSigns?.respiratoryRate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3>Medications</h3>
                  {editSheet?.medications?.length > 0 ? (
                    <ul>
                      {editSheet.medications.map((d, index) => {
                        return (
                          <li key={index} className={styles.flexCol}>
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
                  <h3>Medical Report</h3>
                  {editSheet?.finalReport ? (
                    <>
                      <span>{editSheet.finalReport.date}</span>
                      <p>{editSheet.finalReport.report}</p>
                    </>
                  ) : (
                    <p>No Reports available.</p>
                  )}
                </div>

                <div>
                  <h3>Health Goals And Lifestyle</h3>
                  <h6>Hietary Habits</h6>
                  <p>{editSheet?.healthGoalsAndLifestyle.dietaryHabits}</p>
                  <h6>Exercise Routine</h6>
                  <p>{editSheet?.healthGoalsAndLifestyle.exerciseRoutine}</p>
                  <h6>Health Goals</h6>
                  {editSheet?.healthGoalsAndLifestyle.healthGoals?.length >
                  0 ? (
                    <p>
                      {editSheet?.healthGoalsAndLifestyle.healthGoals.map(
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
            </>
          )}
        </div>
      
    </div>
  );
}

export default UpdateSheet;
