import styles from "./RegisterPage.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";

const signUpSchema = Yup.object({
  name: Yup.string().min(2).max(25).required("Please Enter Name"),
  email: Yup.string().email().required("Please Enter  Email"),
  password: Yup.string().min(6).required("Please Enter  Password"),
  confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Please confirm password"),
});

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "user",
};

function SignupPage() {
  const [doctor, setDoctor] = useState(false)
  const [loading, setLoading] = useState(false)
  const baseURL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: signUpSchema,
    onSubmit: (values) => {
      setLoading(true)
      const apiEndpoint = doctor ? `${baseURL}/doctors/sign-up` : `${baseURL}/users/sign-up`;
      axios.post(apiEndpoint, { values }).then((res) => {
        if (res.data.message === "Successfully registered") {
          toast.success(res.data.message)
          navigate("/users/login");
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

      <form onSubmit={Formik.handleSubmit} className={styles.signupForm}>
      <div className={styles.formBg}>&nbsp;</div>
      <h2>Register</h2>
        <div className={styles.inputBox}>
          <input
            type="text"
            id="name"
            name="name"
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
            value={Formik.values.name}
            className={styles.formInput}
          />
          {Formik.errors.name && Formik.touched.name ? (
            <p className={styles.error}>{Formik.errors.name}</p>
          ) : null}
          <label className={styles.formLabel} htmlFor="name">
            Name
          </label>
        </div>

        <div className={styles.inputBox}>
          <input
            type="email"
            id="email"
            name="email"
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
            value={Formik.values.email}
            className={styles.formInput}
          />
          {Formik.errors.email && Formik.touched.email ? (
            <p className={styles.error}>{Formik.errors.email}</p>
          ) : null}
          <label className={styles.formLabel} htmlFor="email">
            Email
          </label>
        </div>

        <div className={styles.inputBox}>
          <input
            type="password"
            id="password"
            name="password"
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
            value={Formik.values.password}
            className={styles.formInput}
          />
          {Formik.errors.password && Formik.touched.password ? (
            <p className={styles.error}>{Formik.errors.password}</p>
          ) : null}
          <label htmlFor="password" className={styles.formLabel}>
            Password
          </label>
        </div>

        <div className={styles.inputBox}>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
            value={Formik.values.confirmPassword}
            className={styles.formInput}
          />
          {Formik.errors.confirmPassword && Formik.touched.confirmPassword ? (
            <p className={styles.error}>{Formik.errors.confirmPassword}</p>
          ) : null}
          <label htmlFor="confirmPassword" className={styles.formLabel}>
            Confirm Password
          </label>
        </div>

      <div className={styles.radioDiv}>
      <label htmlFor="role">Register as a doctor</label>
      <input type="radio" id="role" onClick={() => setDoctor(true)}/>
      </div>

        <button type="submit">
        {loading ?  <PulseLoader size={7}   color={'rgb(236, 236, 236)'} /> : 'Register'}
        </button>

        <div className={styles.bottomDiv}>
        <span>Already have an account ?</span>
        <Link className={styles.link} to={"/users/login"}>
          Login
        </Link>
      </div>
      </form>
    </main>
  );
}

export default SignupPage;
