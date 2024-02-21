import styles from "./HospitalRegister.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { useState } from "react";
import toast from "react-hot-toast";

const signUpSchema = Yup.object({
  name: Yup.string().min(2).max(25).required("Please Enter Name"),
  email: Yup.string().email().required("Please Enter  Email"),
  password: Yup.string().min(6).required("Please Enter  Password"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm password"),
});

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function HospitalRgister() {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      setLoading(true)
      axios.defaults.withCredentials = true;
      await axios.post(`${baseURL}/hospitals/dashboard/register`, { values }).then((res) => {
        if (res.data.Status === "Register Success") {
          navigate("/hospitals/login");
        }else{
          toast.error("Please try again")
          setLoading(false)
        }
      });
    },
  });
  return (
    <main className={styles.signupPage}>
      <div className={styles.bgImg}>&nbsp;</div>
      <div className={styles.formContainer}>
      <div className={styles.formBg}>&nbsp;</div>
        <h2>Register Hospital</h2>

        <form onSubmit={Formik.handleSubmit} className={styles.signupForm}>
          <label htmlFor="name">Hospital Name</label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
            value={Formik.values.name}
          />
          {Formik.errors.name && Formik.touched.name ? (
            <p>{Formik.errors.name}</p>
          ) : null}

          <label htmlFor="email"> Hospital Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
            value={Formik.values.email}
          />
          {Formik.errors.email && Formik.touched.email ? (
            <p>{Formik.errors.email}</p>
          ) : null}

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
            value={Formik.values.password}
          />
          {Formik.errors.password && Formik.touched.password ? (
            <p>{Formik.errors.password}</p>
          ) : null}

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
            value={Formik.values.confirmPassword}
          />
          {Formik.errors.confirmPassword && Formik.touched.confirmPassword ? (
            <p>{Formik.errors.confirmPassword}</p>
          ) : null}

          <button type="submit">Send a register requestRegister</button>
        </form>
        <div className={styles.bottomDiv}>
          <span>Already have an account ?</span>
          <Link to={"/hospitals/login"} className={styles.link}>Login</Link>
        </div>
      </div>
    </main>
  );
}

export default HospitalRgister;
