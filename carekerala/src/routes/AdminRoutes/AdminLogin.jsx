import styles from "./AdminLogin.module.css"
import { useFormik } from 'formik'
import * as Yup from "yup"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { addAuthDetails } from "../../Redux/Features/AuthSlice";
import { useDispatch} from "react-redux";
import toast from "react-hot-toast";

const initialValues = {
  email: "",
  password: ""
}
const SignInSchema = Yup.object({
  email: Yup.string().email().required("Please Enter Your Email"),
  password: Yup.string().min(6).required("Please Enter Your Password")
})


function AdminLogin() {
    const baseURL = import.meta.env.VITE_BASE_URL
    const dispatch = useDispatch()
    const navigate = useNavigate();
  
    const Formik = useFormik({
      initialValues,
      validationSchema: SignInSchema,
      onSubmit: async (values) => {
        try {
          const res = await axios.post(`${baseURL}/users/admin/login`, {values});
          if (res.data.Status === "success") {
            dispatch(addAuthDetails(res.data.admin));
            navigate('/admin/' + res.data.admin.id);
          }
        } catch (err) {
          toast.error(err.response.data.Message)
          Formik.resetForm();
        }
      }
    });
    
  return (
    <main className={styles.loginPage}>
      <div className={styles.bgImg}>&nbsp;</div>
      <div className={styles.formContainer}>
      <div className={styles.formBg}>&nbsp;</div>
        <h2>Login</h2>

        <form onSubmit={Formik.handleSubmit} className={styles.loginForm}>
          <div className={styles.inputBox}>
          <input type="email" id="email"
          required
          value={Formik.values.email}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          className={styles.formInput}
          />
          {Formik.errors.email && Formik.touched.email ? (
          <p className={styles.error}>{Formik.errors.email}</p>) : null}
          <label htmlFor="email" className={styles.formLabel}>Email</label>
          </div>
          <div className={styles.inputBox}>
          <input type="password" id="password"
          required
          value={Formik.values.password}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          className={styles.formInput}
          />
          {Formik.errors.password && Formik.touched.password ? (
          <p className={styles.error}>{Formik.errors.password}</p>) : null}
          <label htmlFor=""className={styles.formLabel}>Password</label>
          </div>
          

          <button type="submit">login</button>
        </form>
      </div>
    </main>
  )
}

export default AdminLogin