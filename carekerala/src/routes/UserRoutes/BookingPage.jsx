/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import styles from "./Booking.module.css";
import locationIcon from "../../assets/locationIcon2.svg";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoaderData } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addUserAuth, addAuthDetails } from "../../Redux/Features/AuthSlice";
import toast from "react-hot-toast";

export async function loader({ params }) {
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors/` + params.doctorId);
  const doctor = res.data;
  return { doctor };
}

const initialValues = {
  title: "",
  fname: "",
  lname: "",
  date: "",
  phone: "",
  doctor: "",
};

const BookingSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  fname: Yup.string().min(2).max(25).required("First Name is required"),
  lname: Yup.string(),
  date: Yup.date().required("Appointment date is required").min(new Date(), "Appointment date must be in the future"),
  phone: Yup.string().required("Mobile Number is required").matches(/^\d{10}$/, "Invalid mobile number"),
});

function BookingPage() {
  const { doctor } = useLoaderData();
  const hospital = useSelector((state) => state.booking.hospital);
  const user = useSelector((state) => state.auth.authDetails);
  const [hSheet, setSheet] = useState({});
  const baseURL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        axios.defaults.withCredentials = true;
        const verifyRes = await axios.post(`${baseURL}/users/verify`);
        if (verifyRes.data.Status === "Verify-Success") {
          dispatch(addUserAuth(true));
          dispatch(addAuthDetails(verifyRes.data.user));
        } else {
          alert(verifyRes.data.Meassage);
          return;
        }

        const hSheetRes = await axios.get(`${baseURL}/h-sheet/` + verifyRes.data.user.id);
        setSheet(hSheetRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: BookingSchema,
    onSubmit: (values) => {
      if (!user || !doctor) {
        formik.resetForm();
        toast.error("Please login before submitting a request")
        return;
      }
      let formData = {
        ...values,
        doctor: doctor._id,
        user: user.id,
      };
      if (hospital) {
        formData = {
          ...formData,
          hospital: hospital._id,
        };
      }
      if (hSheet) {
        formData = {
          ...formData,
          hSheet: hSheet._id,
        };
      }
      console.log(formData)
      axios.post(`${import.meta.env.VITE_BASE_URL}/appointments/users/booking`,formData)
        .then((res) => {
          if (res.data.message === "success") {
            toast.success("Request Submited Successfully");
            formik.resetForm();
          } else {
            toast.error("Request failed Please try again");
          }
        });
    },
  });
  return (
    <main>
      {hospital && (
        <div className={styles.Header}>
          <h1>{hospital.name}</h1>
          <div className={styles.addressDiv}>
            <img src={locationIcon} alt="" />
            <span>
              {hospital.address.length > 30
                ? `${hospital.address.substring(0, 30)}...`
                : hospital.address}
            </span>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <form onSubmit={formik.handleSubmit}>
            <h2>Request an Appointment</h2>
            {user?.id === doctor?._id && (
              <div className={styles.messageDiv}>
                <span>You are on your appointment booking page</span>
              </div>
            )}
            <div className={styles.fieldContainer}>
              <div>
                <label htmlFor="title">Title</label>
                <select
                  name="title"
                  id="title"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.title}
                >
                  <option>select</option>
                  <option value="Ms">Ms</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Dr">Dr</option>
                </select>
                {formik.touched.title && formik.errors.title ? (
                  <p className={styles.error}>{formik.errors.title}</p>
                ) : null}

                <label htmlFor="fname">First Name</label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fname}
                />
                {formik.touched.fname && formik.errors.fname ? (
                  <p className={styles.error}>{formik.errors.fname}</p>
                ) : null}

                <label htmlFor="lname">Last Name</label>
                <input
                  type="text"
                  id="lname"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lname}
                />
                {formik.touched.lname && formik.errors.lname ? (
                  <p className={styles.error}>{formik.errors.lname}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="doctor">Doctor</label>
                <input
                  type="doctor"
                  id="doctor"
                  value={doctor ? doctor.name : ""}
                  readOnly
                />

                <label htmlFor="date">Appointment date</label>
                <input
                  type="date"
                  id="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.date}
                />
                {formik.touched.date && formik.errors.date ? (
                  <p className={styles.error}>{formik.errors.date}</p>
                ) : null}

                <label htmlFor="phone">Mobile Number</label>
                <input
                  type="number"
                  id="phone"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                />
                {formik.touched.phone && formik.errors.phone ? (
                  <p className={styles.error}>{formik.errors.phone}</p>
                ) : null}
              </div>
            </div>
            <button type="submit" className={styles.submitBtn}>
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default BookingPage;
