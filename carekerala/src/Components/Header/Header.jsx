import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import logoImg from "../../assets/logo.png";
import profileIcon from "../../assets/profileIcon.svg";
import profileIcon2 from "../../assets/profileIcon2.svg";
import menuIcon from "../../assets/menuIcon.svg";
import closeIcon from "../../assets/closeIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { addAuthDetails } from "../../Redux/Features/AuthSlice";

function Header() {
  const userAuth = useSelector((state) => state.auth.UserAuthStatus);
  const user = useSelector((state) => state.auth.authDetails);
  const [isSideNavBarVisible, setIsSideNavBarVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseURL = import.meta.env.VITE_BASE_URL;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  const handleNavigateToHome = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      scrollToTop()
      navigate("/");
    } catch (error) {
      console.error("Error navigating to dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToHospital = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      scrollToTop()
      navigate("/hospitals");
    } catch (error) {
      console.error("Error navigating to dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToDoctors = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      scrollToTop()
      navigate("/doctors");
    } catch (error) {
      console.error("Error navigating to dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openSideNavBar = () => {
    setIsSideNavBarVisible(true);
  };

  const closeSideNavBar = () => {
    setIsSideNavBarVisible(false);
    scrollToTop()
  };

  const handleLogout = () => {
    try {
      axios.defaults.withCredentials = true;
      axios
        .post(`${baseURL}/hospitals/dashboard/logout`)
        .then(() => {
          dispatch(addAuthDetails(null));
          navigate("/hospitals/login");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <header className={styles.header}>
      <div className={styles.secondDiv}>
        <span className={styles.logoDiv}>
          <img src={logoImg} alt="" className={styles.logoImg} />
        </span>
        <nav>
          {user?.role === "hospital" ? (
            <ul className={styles.fnavList}>
              <li>
                <Link
                  to={"/hospital/dashboard/" + user.id}
                  className={styles.link}
                  onClick={scrollToTop}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to={"/hospital/dashmoard/" + user.id + "/appointments"}
                  className={styles.link}
                  onClick={scrollToTop}
                >
                  Appointment
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className={styles.btnRed}>
                  Log Out
                </button>
              </li>
            </ul>
          ) : (
            <>
              <ul className={styles.fnavList}>
                <li>
                  <Link to={"/"} className={styles.link}
                  onClick={() => handleNavigateToHome()}
                  style={{ cursor: isLoading ? "wait" : "pointer" }} 
                  disabled={isLoading}>
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    to={"/hospitals"}
                    className={styles.link}
                    onClick={() => handleNavigateToHospital()}
                    style={{ cursor: isLoading ? "wait" : "pointer" }} 
                    disabled={isLoading}
                  >
                      Hospitals
                  </Link>
                </li>

                <li>
                  <Link to={"/doctors"} className={styles.link}
                  onClick={() => handleNavigateToDoctors()}
                  style={{ cursor: isLoading ? "wait" : "pointer" }} // Change cursor style based on loading state
                  disabled={isLoading}>
                    Doctors
                  </Link>
                </li>

                {userAuth ? (
                  <>
                    <li>
                      <Link to={"/h-sheet/" + user.id} className={styles.link}>
                        H-Sheet
                      </Link>
                    </li>
                    {user?.role === "doctor" ? (
                      <li>
                        <Link
                          to={"/doctors-profile/" + user.id}
                          className={styles.link}
                          onClick={closeSideNavBar}
                        >
                          <img src={profileIcon} alt="" /> {user?.name}
                        </Link>
                      </li>
                    ) : (
                      <li>
                        <Link
                          to={"/users/profile/" + user.id}
                          className={styles.link}
                          onClick={closeSideNavBar}
                        >
                          <img src={profileIcon} alt="" /> {user?.name}
                        </Link>
                      </li>
                    )}
                  </>
                ) : (
                  <li>
                    <Link to={"/users/login"} className={styles.link}>
                      Register / Login
                    </Link>
                  </li>
                )}
              </ul>
              <button onClick={openSideNavBar} className={styles.menuBtn}>
                <img src={menuIcon} alt="" />
              </button>
            </>
          )}
        </nav>
        <div
          className={`${styles.sideNavBar} ${
            isSideNavBarVisible ? styles.sideNavBarVsbl : styles.sideNavBarHide
          }`}
        >
          <button onClick={closeSideNavBar} className={styles.btnClose}>
            <img src={closeIcon} alt="" />
          </button>
          <nav>
            {user?.role === "hospital" ? (
              <ul className={styles.snavList}>
                <li>
                  <Link
                    to={"/hospital/dashboard/" + user.id}
                    className={styles.link}
                    onClick={closeSideNavBar}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/hospital/dashmoard/" + user.id + "/appointments"}
                    className={styles.link}
                    onClick={closeSideNavBar}
                  >
                    Appointment
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className={styles.btnRed}>
                    Log Out
                  </button>
                </li>
              </ul>
            ) : (
              <>
                <ul className={styles.snavList}>
                  <li>
                    <Link
                      to={"/"}
                      className={styles.link}
                      onClick={closeSideNavBar}
                    >
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link
                      to={"/hospitals"}
                      className={styles.link}
                      onClick={closeSideNavBar}
                    >
                      Hospitals
                    </Link>
                  </li>

                  <li>
                    <Link
                      to={"/doctors"}
                      className={styles.link}
                      onClick={closeSideNavBar}
                    >
                      Doctors
                    </Link>
                  </li>

                  {userAuth ? (
                    <>
                      <li>
                        <Link
                          to={"/h-sheet/" + user.id}
                          className={styles.link}
                          onClick={closeSideNavBar}
                        >
                          H-Sheet
                        </Link>
                      </li>
                      {user?.role === "doctor" ? (
                        <li>
                          <Link
                            to={"/doctors-profile/" + user.id}
                            className={styles.link}
                            onClick={closeSideNavBar}
                          >
                            <img src={profileIcon2} alt="" /> {user?.name}
                          </Link>
                        </li>
                      ) : (
                        <li>
                          <Link
                            to={"/users/profile/" + user.id}
                            className={styles.link}
                            onClick={closeSideNavBar}
                          >
                            <img src={profileIcon2} alt="" /> {user?.name}
                          </Link>
                        </li>
                      )}
                    </>
                  ) : (
                    <li>
                      <Link
                        to={"/users/login"}
                        className={styles.link}
                        onClick={closeSideNavBar}
                      >
                        Register / Login
                      </Link>
                    </li>
                  )}
                </ul>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
