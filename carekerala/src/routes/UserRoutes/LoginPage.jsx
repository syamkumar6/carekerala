import styles from "./Login.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { addAuthDetails, addUserAuth } from "../../Redux/Features/AuthSlice";
import { useDispatch} from "react-redux";
import { useState } from "react";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";

const initialValues = {
  email: "",
  password: "",
};
const SignInSchema = Yup.object({
  email: Yup.string().email().required("Please Enter Your Email"),
  password: Yup.string().min(6).required("Please Enter Your Password"),
});

function LoginPage() {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [doctor, setDoctor] = useState(false);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const Formik = useFormik({
    initialValues,
    validationSchema: SignInSchema,
    onSubmit: (values) => {
      setLoading(true)
      const apiEndpoint = doctor
        ? `${baseURL}/doctors/login`
        : `${baseURL}/users/login`;
      axios
        .post(apiEndpoint, { values }, { timeout: 15000 })
        .then((res) => {
          if (res.data.Status === "success") {
            dispatch(addUserAuth(true));
            dispatch(addAuthDetails(res.data.user));
            navigate("/");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.Message);
          setLoading(false)
          console.log(err);
          Formik.resetForm();
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
              <p className={styles.error}>{Formik.errors.email}</p>
            ) : null}
            <label htmlFor="email" className={styles.formLabel}>
              Email
            </label>
          </div>
          <div className={styles.inputBox}>
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
              <p className={styles.error}>{Formik.errors.password}</p>
            ) : null}
            <label htmlFor="" className={styles.formLabel}>
              Password
            </label>
          </div>

          <div>
            <label htmlFor="role">Login as a doctor</label>
            <input type="radio" id="role" onClick={() => setDoctor(true)} />
          </div>

          <button type="submit" >
            {loading ? 
            <PulseLoader size={7}   color={'rgb(236, 236, 236)'} /> : 'Login'}</button>
        </form>
        <div className={styles.bottomDiv}>
          <span>or </span>
          <Link className={styles.link} to={"/users/register"}>
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
