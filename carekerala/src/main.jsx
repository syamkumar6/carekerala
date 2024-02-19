import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./Redux/Store";
import { Provider } from "react-redux";

import RootRoute from "./routes/RootRoute";
import ErrorPage from "./ErrorPage";
import HomePage, {loader as homepageloader,} from "./routes/UserRoutes/HomePage";
import RegisterPage from "./routes/UserRoutes/RegisterPage";
import LoginPage from "./routes/UserRoutes/LoginPage";
import BookingPage, {loader as bookingPageLoader} from "./routes/UserRoutes/BookingPage";
import SingleHospital, {loader as hospitalloader,} from "./routes/UserRoutes/SingleHospital";
import Hospitals, {loader as hospitalsLoader} from "./routes/UserRoutes/Hospitals";
import Doctors, {loader as doctorsoader} from "./routes/UserRoutes/Doctors";
import DoctorPage, {loader as doctorlloader,} from "./routes/UserRoutes/DoctorPage";
import UserProfile, {loader as userProfileLoader} from "./routes/UserRoutes/UserProfile";
import HealthSheet, {loader as healthsheetloader} from "./routes/UserRoutes/HealthSheet";

import HospitalRgister from "./routes/HospitalRoutes/HospitalRgister";
import HospitalLogin from "./routes/HospitalRoutes/HospitalLogin";
import HospitalDashboard, { loader as hospitalDashboardLoader,} from "./routes/HospitalRoutes/HospitalDashboard";
import Appointments, {loader as appointmentPageLoader} from "./routes/HospitalRoutes/Appointments"

import DoctorProfile, {loader as doctorProfileLoader} from "./routes/DoctorRoutes/DoctorProfile";

import AdminDashboard, {loader as adminloader} from "./routes/AdminRoutes/AdminDashboard";
import AdminLogin from "./routes/AdminRoutes/AdminLogin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        loader: homepageloader,
      },
      {
        path: "/users/register",
        element: <RegisterPage />,
      },
      {
        path: "/users/login",
        element: <LoginPage />,
      },
      {
        path: "/users/profile/:userId",
        element: <UserProfile />,
        loader: userProfileLoader
      },
      {
        path: "/hospitals",
        element: <Hospitals />,
        loader: hospitalsLoader
      },
      {
        path: "/doctors",
        element: <Doctors/>,
        loader: doctorsoader
      },
      {
        path: "/hospitel/:hospitalId",
        element: <SingleHospital />,
        loader: hospitalloader,
      },
      {
        path: "/doctors/:doctorId",
        element: <DoctorPage />,
        loader: doctorlloader,
      },
      {
        path: "/h-sheet/:userId",
        element: <HealthSheet/>,
        loader: healthsheetloader
      },
      {
        path: "/booking/:doctorId",
        element: <BookingPage />,
        loader: bookingPageLoader
      },
                                    //! Doctors Routes
      {
        path: "/doctors-profile/:userId",
        element: <DoctorProfile/>,
        loader: doctorProfileLoader
      },
                                    //! Hospitals Routes
      {
        path: "/hospitals/register",
        element: <HospitalRgister />,
      },
      {
        path: "/hospitals/login",
        element: <HospitalLogin />,
      },
      {
        path: "/hospital/dashboard/:hospitalId",
        element: <HospitalDashboard />,
        loader: hospitalDashboardLoader,
      },
      {
        path: "/hospital/dashmoard/:hospitalId/appointments",
        element: <Appointments/>,
        loader: appointmentPageLoader
      },
                                //! Admin routes
      {
        path: "/admin/:adminId",
        element: <AdminDashboard/>,
        loader: adminloader
      },
      {
        path: "/admin/login",
        element: <AdminLogin/>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
