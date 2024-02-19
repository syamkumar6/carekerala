import styles from "./Overview.module.css";
import { Link } from "react-router-dom";

import posterImg from "../../../assets/homePoster.jpg"
import callIcon from "../../../assets/callIcon.svg";
import emerIcon from "../../../assets/emergency2.svg";
import facebookIcon from "../../../assets/facebook.svg";
import whatsappIcon from "../../../assets/whatsapp.svg";
import instagramIcon from "../../../assets/instagram.svg";
import linkedinIcon from "../../../assets/linkedin.svg";
import ratingIcon from "../../../assets/rating.png";
import npsIcon from "../../../assets/care.png";

function Overview() {
  return (
    <div>
      <div className={styles.overviewText}>
        <h2>Overview</h2>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum ut
          consectetur eaque hic similique molestias et facilis molestiae
          voluptatem. Nobis laboriosam, at nisi modi voluptatum repellendus
          neque rerum enim molestiae?Lorem ipsum, dolor sit amet consectetur
          adipisicing elit. Unde fugit a cumque, officia eos ipsum repellendus
          itaque nobis asperiores amet vel, vero corporis autem laudantium
          laborum placeat repellat nam magnam!
        </p>
        <p className={styles.overviewHide}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem,
          perferendis error natus neque minima dicta eaque debitis quia illo
          quaerat! Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Officia repellat tenetur eius molestias quia repellendus consequuntur?
          Quas quibusdam veritatis iste eligendi eveniet molestias dicta
          blanditiis.
        </p>
        <p className={styles.overviewHide}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. At aliquam
          eius deserunt. Inventore, nemo cumque minima tenetur totam voluptas
          ullam temporibus eos, ipsa harum tempore. Lorem, ipsum dolor sit amet
          consectetur adipisicing elit. Delectus molestiae dolore, incidunt
          sequi omnis saepe modi. Consequatur dignissimos ducimus reprehenderit
          harum eius hic, possimus similique.
        </p>
      </div>
      <div className={styles.posterDiv}>
        <img src={posterImg} alt="" className={styles.PosterImg}/>
        <div className={styles.sideDiv}>
          <h2 className={styles.sideDivH2}>Register</h2>
          <p className={styles.sideDivP}>
            Your information is secure with us, and we&apos;re excited to assist you
            on your health journey.
          </p>
          <Link className={styles.sideDivBtn}>Register for free</Link>
          <span className={styles.sideDivSpan}>
            <img src={emerIcon} alt="" />
            <strong>Emergency:</strong>
            155919
          </span>
          <span className={styles.sideDivSpan}>
            <img src={callIcon} alt="" />
            <strong>Helpline:</strong>
            +91-62-000-2-000-2
          </span>
          <div className={styles.socialMediaIcons}>
            <Link to={"#"}>
              <img src={facebookIcon} alt="" />
            </Link>
            <Link to={"#"}>
              <img src={whatsappIcon} alt="" />
            </Link>
            <Link to={"#"}>
              <img src={instagramIcon} alt="" />
            </Link>
            <Link to={"#"}>
              <img src={linkedinIcon} alt="" />
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.ratingsDiv}>
        <div className={styles.ratingsInnerDiv}>
          <img src={ratingIcon} alt="" />
          <div className={styles.ratingNote}>
            <h3>4.7</h3>
            <span>Google Ratings</span>
            <p>
              Our rating on Google given by our patients, explains our
              dedication towards them & the quality of service offered.
            </p>
          </div>
        </div>
        <div className={styles.ratingsInnerDiv}>
          <img src={npsIcon} alt="" />
          <div className={styles.ratingNote}>
            <h3>89%</h3>
            <span>NPS scores</span>
            <p>
              Our NPS score shows the highest level of satisfaction we offer to
              our patients
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
