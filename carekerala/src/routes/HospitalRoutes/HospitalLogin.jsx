/* eslint-disable react-hooks/exhaustive-deps */
import styles from "./HospitalLogin.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { addHospitalAuth, addAuthDetails } from "../../Redux/Features/AuthSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";

const initialValues = {
  email: "",
  password: "",
};
const SignInSchema = Yup.object({
  email: Yup.string().email().required("Please Enter Hospital Email"),
  password: Yup.string().min(6).required("Please Enter Hospital Password"),
});

function HospitalLogin() {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/hospitals/dashboard/verify`)
      .then((res) => {
        if (res.data.Status === "Verify Success") {
          dispatch(addHospitalAuth(true))
          dispatch(addAuthDetails(res.data.hospital))
          console.log(res.data)
          navigate("/hospital/dashboard/"+res.data.hospital.id)
        } else {
          console.log("Verification failed");
        }
      });
  },[]);

  const Formik = useFormik({
    initialValues,
    validationSchema: SignInSchema,
    onSubmit: (values) => {
      setLoading(true)
      axios.defaults.withCredentials = true;
      axios
        .post(`${baseURL}/hospitals/dashboard/login`, { values }, { timeout: 15000 })
        .then((res) => {
          if (res.data.Status === "success") {
            dispatch(addHospitalAuth(true))
            dispatch(addAuthDetails(res.data.hospital))
            navigate("/hospital/dashboard/"+res.data.hospital.id);
          }
        })
        .catch((err) => {
          toast.error(err.response.data.Message)
          setLoading(false)
          console.log(err);
          Formik.resetForm()
        });
    },
  });
  return (
    <main className={styles.loginPage}>
      <div className={styles.bgImg}>&nbsp;</div>
      <div className={styles.formContainer}>
      <div className={styles.formBg}>&nbsp;</div>
        <h2>Login</h2>

        <form onSubmit={Formik.handleSubmit} className={styles.loginForm}>
        <div className={styles.inputBox}>
          <label htmlFor="email">Hospital Email</label>
          <input
            type="email"
            id="email"
            required
            value={Formik.values.email}
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
            className={styles.formInput}
          />
          {Formik.errors.email && Formik.touched.email ? (
            <p>{Formik.errors.email}</p>
          ) : null}
        </div>

        <div className={styles.inputBox}>
          <label htmlFor="passsword" >Password</label>
          <input
            type="password"
            id="password"
            required
            value={Formik.values.password}
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
            className={styles.formInput}
          />
          {Formik.errors.password && Formik.touched.password ? (
            <p>{Formik.errors.password}</p>
          ) : null}
        </div>
          <button type="submit">{loading ?  <PulseLoader size={7}   color={'rgb(236, 236, 236)'} /> : 'login'}</button>
          <div className={styles.bottomDiv}>
          <span>Or</span>
          <Link to={"/hospitals/register"} className={styles.link}>Register</Link>
        </div>
        </form>
      </div>
    </main>
  );
}

export default HospitalLogin;
