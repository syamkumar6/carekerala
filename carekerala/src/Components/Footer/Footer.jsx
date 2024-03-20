import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import facebookIcon from "../../assets/facebook2.svg";
import whatsappIcon from "../../assets/wht2.svg";
import instagramIcon from "../../assets/insta2.svg";
import bookingIcon from "../../assets/bookingIcon.svg";
import sheetIcon from "../../assets/footerSheetIcon.svg";

function Footer() {
  const user = useSelector((state) => state.auth.authDetails);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };
  return (
    <div className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.firstSection}>
          <Link to={"/hospitals"} className={styles.innerBox} onClick={scrollToTop}>
            <img src={bookingIcon} alt="" />
            <div>
              <h4>Book Appointment</h4>
              <span>Find your hospital & book appointment</span>
            </div>
          </Link>
          <Link className={styles.innerBox} to={user ? `/h-sheet/${user.id}` : "/users/login"}>
            <img src={sheetIcon} alt="" />
            <div>
              <h4>Create a Health Sheet</h4>
              <span>Care your health with CareKerala</span>
            </div>
          </Link>
        </div>
        <div className={styles.secondSection}>
          <div>
            <h3 className={styles.innerh2}>Quick Links</h3>
            <div className={styles.innerContainer}>
              <Link to={"/hospitals"} className={styles.footerLink} onClick={scrollToTop}>Hospitals</Link>
              <Link to={"/doctors"} className={styles.footerLink} onClick={scrollToTop}>Doctors</Link>
              <Link className={styles.footerLink}>Contact Us</Link>
            </div>
          </div>

          <div className={styles.contactContainer}>
            <h3 className={styles.innerh2}>Call Us</h3>
            <dvi className={styles.innerContainer}>
              <span>Emergency: 155919</span>
              <span>Helpline: +91-62-000-2828</span>
              <span>Helpline2: +91-62-000-2525</span>
            </dvi>
          </div>

          <div>
            <h3 className={styles.innerh2}>Social Media</h3>
            <div className={styles.socialMediaIcons}>
              <Link to={"#"} className={styles.footerLink} aria-label="Facebook">
                <img src={facebookIcon} alt="" />
              </Link>
              <Link to={"#"} className={styles.footerLink} aria-label="Whatsapp">
                <img src={whatsappIcon} alt="" />
              </Link>
              <Link to={"#"} className={styles.footerLink} aria-label="Instagram">
                <img src={instagramIcon} alt="" />
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.lastSection}>
          <span>&copy;2024 CareKerala. All Rights Reserved </span>
          <span>Terms-privacy</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
