/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./HealthSheetForm.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function HealthSheetForm() {
  const { userId } = useParams();
  const [editedImage, setEditedImage] = useState();
  const initialValues = {
    personalInformation: {
      image: "",
      fullName: "",
      dateOfBirth: "",
      gender: "",
      contactInformation: {
        address: "",
        phoneNumber: "",
        email: "",
      },
    },
    medicalHistory: {
      preExistingConditions: "",
      allergies: "",
      surgeries: [
        {
          name: "",
          date: "",
        },
      ],
    },
    emergencyContacts: [
      {
        name: "",
        relationship: "",
        phoneNumber: "",
      },
    ],
    healthGoalsAndLifestyle: {
      healthGoals: "",
      dietaryHabits: "",
      exerciseRoutine: "",
    },
  };

  const validationSchema = Yup.object({
    personalInformation: Yup.object({
      image: Yup.string().required("image is required"),
      fullName: Yup.string().required("Full Name is required"),
      dateOfBirth: Yup.date().required("Date of Birth is required"),
      gender: Yup.string().required("Gender is required"),
      contactInformation: Yup.object({
        address: Yup.string(),
        phoneNumber: Yup.string(),
        email: Yup.string().email("Invalid email address"),
      }),
    }),
    medicalHistory: Yup.object({
      preExistingConditions: Yup.string(),
      allergies: Yup.string(),
      surgeries: Yup.array().of(
        Yup.object({
          name: Yup.string(),
          date: Yup.date(),
        })
      ),
    }),
    emergencyContacts: Yup.array().of(
      Yup.object({
        name: Yup.string(),
        relationship: Yup.string(),
        phoneNumber: Yup.string(),
      })
    ),
    healthGoalsAndLifestyle: Yup.object({
      healthGoals: Yup.string(),
      dietaryHabits: Yup.string(),
      exerciseRoutine: Yup.string(),
    }),
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const data = {
        ...values,
        user: userId,
        personalInformation: {
          ...values.personalInformation,
          image: editedImage,
        },
      };
      axios.defaults.withCredentials = true;
      axios.post(`${import.meta.env.VITE_BASE_URL}/h-sheet/create/` + userId,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          if (res.data.message === "Health sheet created successfully") {
            console.log(res.data)
              formik.resetForm();
              toast.success(res.data.message)
              window.location.reload();
          } else {
            toast.error("Submition failed. Please try again");
          }
        });
    },
  });

  const ConvertImage = (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      setEditedImage(base64Data);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit} className={styles.formTag}>
        <h2>Create a health sheet</h2>
        <div className={styles.div1}>
          <h3>Personal Information</h3>
          <div className={styles.flexRow}>
            <div className={styles.flexCol}>
              <div className={styles.imgPreview}>
               {editedImage && ( <img src={editedImage} alt="" />)}
                {!editedImage && (
                  <>
                    <label htmlFor="personalInformation.image"></label>
                    <input
                      type="file"
                      id="imageInput"
                      name="personalInformation.image"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        formik.handleChange(e);
                        handleImageChange(e);
                      }}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.personalInformation?.image &&
                    formik.errors.personalInformation?.image ? (
                      <div className={styles.error}>
                        {formik.errors.personalInformation.image}
                      </div>
                    ) : null}
                    <button
                      disabled={formik.isSubmitting}
                      type="button"
                      onClick={ConvertImage}
                      className={styles.addImage}
                    >
                      {" "}
                     + Add image
                    </button>
                  </>
                )}
              </div>
              {editedImage && (
                <button
                disabled={formik.isSubmitting}
                type="button"
                onClick={() => setEditedImage("")}
                className={styles.btnRed}
              >
                Remove
              </button>
              )}

              <label htmlFor="personalInformation.fullName">Full Name</label>
              <input
                type="text"
                id="personalInformation.fullName"
                name="personalInformation.fullName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.personalInformation.fullName}
              />
              {formik.touched.personalInformation?.fullName &&
              formik.errors.personalInformation?.fullName ? (
                <div>{formik.errors.personalInformation.fullName}</div>
              ) : null}

              <label htmlFor="personalInformation.dateOfBirth">
                Date of Birth
              </label>
              <input
                type="date"
                id="personalInformation.dateOfBirth"
                name="personalInformation.dateOfBirth"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.personalInformation.dateOfBirth}
              />
              {formik.touched.personalInformation?.dateOfBirth &&
              formik.errors.personalInformation?.dateOfBirth ? (
                <div>{formik.errors.personalInformation.dateOfBirth}</div>
              ) : null}
            </div>

            <div className={styles.flexCol}>

            <label htmlFor="personalInformation.gender">Gender</label>
              <select
                id="personalInformation.gender"
                name="personalInformation.gender"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.personalInformation.gender}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {formik.touched.personalInformation?.gender &&
              formik.errors.personalInformation?.gender ? (
                <div>{formik.errors.personalInformation.gender}</div>
              ) : null}


              <label htmlFor="personalInformation.contactInformation.address">
                Address
              </label>
              <input
                type="text"
                id="personalInformation.contactInformation.address"
                name="personalInformation.contactInformation.address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={
                  formik.values.personalInformation.contactInformation.address
                }
              />
              {formik.touched.personalInformation?.contactInformation
                ?.address &&
              formik.errors.personalInformation?.contactInformation?.address ? (
                <div>
                  {formik.errors.personalInformation.contactInformation.address}
                </div>
              ) : null}

              <label htmlFor="personalInformation.contactInformation.phoneNumber">
                Phone Number
              </label>
              <input
                type="text"
                id="personalInformation.contactInformation.phoneNumber"
                name="personalInformation.contactInformation.phoneNumber"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={
                  formik.values.personalInformation.contactInformation
                    .phoneNumber
                }
              />
              {formik.touched.personalInformation?.contactInformation
                ?.phoneNumber &&
              formik.errors.personalInformation?.contactInformation
                ?.phoneNumber ? (
                <div>
                  {
                    formik.errors.personalInformation.contactInformation
                      .phoneNumber
                  }
                </div>
              ) : null}

              <label htmlFor="personalInformation.contactInformation.email">
                Email
              </label>
              <input
                type="text"
                id="personalInformation.contactInformation.email"
                name="personalInformation.contactInformation.email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={
                  formik.values.personalInformation.contactInformation.email
                }
              />
              {formik.touched.personalInformation?.contactInformation?.email &&
              formik.errors.personalInformation?.contactInformation?.email ? (
                <div>
                  {formik.errors.personalInformation.contactInformation.email}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className={styles.div2}>
          <div className={styles.flexRow}>
            <div className={styles.flexCol}>
            <h3>Medical History</h3>
              <label htmlFor="medicalHistory.preExistingConditions">
                Pre-Existing Conditions
              </label>
              <input
                type="text"
                id="medicalHistory.preExistingConditions"
                name="medicalHistory.preExistingConditions"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.medicalHistory.preExistingConditions}
              />
              {/* Show error if there's any */}
              {formik.touched.medicalHistory?.preExistingConditions &&
              formik.errors.medicalHistory?.preExistingConditions ? (
                <div>{formik.errors.medicalHistory.preExistingConditions}</div>
              ) : null}

              <label htmlFor="medicalHistory.allergies">Allergies</label>
              <input
                type="text"
                id="medicalHistory.allergies"
                name="medicalHistory.allergies"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.medicalHistory.allergies}
              />
              {/* Show error if there's any */}
              {formik.touched.medicalHistory?.allergies &&
              formik.errors.medicalHistory?.allergies ? (
                <div>{formik.errors.medicalHistory.allergies}</div>
              ) : null}
            </div>
            <div className={styles.flexCol}>
              <h3>Surgeries</h3>
              {formik.values.medicalHistory.surgeries.map((surgery, index) => (
                <div key={index} className={styles.flexCol}>
                  <label htmlFor={`medicalHistory.surgeries[${index}].name`}>
                    Surgery Name
                  </label>
                  <input
                    type="text"
                    id={`medicalHistory.surgeries[${index}].name`}
                    name={`medicalHistory.surgeries[${index}].name`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={surgery.name}
                  />

                  <label htmlFor={`medicalHistory.surgeries[${index}].date`}>
                    Surgery Date
                  </label>
                  <input
                    type="date"
                    id={`medicalHistory.surgeries[${index}].date`}
                    name={`medicalHistory.surgeries[${index}].date`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={surgery.date}
                  />
                </div>
              ))}
              {/* Show errors for surgeries if any */}
              {formik.touched.medicalHistory?.surgeries &&
              formik.errors.medicalHistory?.surgeries ? (
                <div>{formik.errors.medicalHistory.surgeries}</div>
              ) : null}

              {/* Add Surgery Button */}
              <button
                disabled={formik.isSubmitting}
                type="button"
                onClick={() =>
                  formik.setFieldValue("medicalHistory.surgeries", [
                    ...formik.values.medicalHistory.surgeries,
                    { name: "", date: "" },
                  ])
                }
                className={styles.btnDark}
              >
               + Add More
              </button>
            </div>
          </div>
        </div>

        <div className={styles.flexRow}>
          <div className={styles.flexCol}>
            <h3>Emergency Contacts</h3>
            {formik.values.emergencyContacts.map((emergencyContact, index) => (
              <div key={index} className={styles.flexCol}>
                <label htmlFor={`emergencyContacts[${index}].name`}>
                  Contact Name
                </label>
                <input
                  type="text"
                  id={`emergencyContacts[${index}].name`}
                  name={`emergencyContacts[${index}].name`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={emergencyContact.name}
                />

                <label htmlFor={`emergencyContacts[${index}].relationship`}>
                  Relationship
                </label>
                <input
                  type="text"
                  id={`emergencyContacts[${index}].relationship`}
                  name={`emergencyContacts[${index}].relationship`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={emergencyContact.relationship}
                />

                <label htmlFor={`emergencyContacts[${index}].phoneNumber`}>
                  Phone Number
                </label>
                <input
                  type="text"
                  id={`emergencyContacts[${index}].phoneNumber`}
                  name={`emergencyContacts[${index}].phoneNumber`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={emergencyContact.phoneNumber}
                />
              </div>
            ))}

            {/* Show errors for emergencyContacts if any */}
            {formik.touched.emergencyContacts &&
            formik.errors.emergencyContacts ? (
              <div>{formik.errors.emergencyContacts}</div>
            ) : null}

            {/* Add Emergency Contact Button */}
            <button
              disabled={formik.isSubmitting}
              type="button"
              onClick={() =>
                formik.setFieldValue("emergencyContacts", [
                  ...formik.values.emergencyContacts,
                  { name: "", relationship: "", phoneNumber: "" },
                ])
              }
              className={styles.btnDark}
            >
              + Add More
            </button>
          </div>

          <div className={styles.flexCol}>
            <h3>Health Goals and Lifestyle</h3>

            <label htmlFor="healthGoalsAndLifestyle.healthGoals">
              Health Goals
            </label>
            <input
              type="text"
              id="healthGoalsAndLifestyle.healthGoals"
              name="healthGoalsAndLifestyle.healthGoals"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.healthGoalsAndLifestyle.healthGoals}
            />
            {formik.touched.healthGoalsAndLifestyle?.healthGoals &&
            formik.errors.healthGoalsAndLifestyle?.healthGoals ? (
              <div>{formik.errors.healthGoalsAndLifestyle.healthGoals}</div>
            ) : null}

            <label htmlFor="healthGoalsAndLifestyle.dietaryHabits">
              Dietary Habits
            </label>
            <input
              type="text"
              id="healthGoalsAndLifestyle.dietaryHabits"
              name="healthGoalsAndLifestyle.dietaryHabits"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.healthGoalsAndLifestyle.dietaryHabits}
            />
            {formik.touched.healthGoalsAndLifestyle?.dietaryHabits &&
            formik.errors.healthGoalsAndLifestyle?.dietaryHabits ? (
              <div>{formik.errors.healthGoalsAndLifestyle.dietaryHabits}</div>
            ) : null}

            <label htmlFor="healthGoalsAndLifestyle.exerciseRoutine">
              Exercise Routine
            </label>
            <input
              type="text"
              id="healthGoalsAndLifestyle.exerciseRoutine"
              name="healthGoalsAndLifestyle.exerciseRoutine"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.healthGoalsAndLifestyle.exerciseRoutine}
            />
            {formik.touched.healthGoalsAndLifestyle?.exerciseRoutine &&
            formik.errors.healthGoalsAndLifestyle?.exerciseRoutine ? (
              <div>{formik.errors.healthGoalsAndLifestyle.exerciseRoutine}</div>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          className={styles.btnDark2}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default HealthSheetForm;
