/* eslint-disable react/prop-types */
import styles from "./UserReview.module.css";
import profileImg from "../../assets/profile.jpg";


function UserReviewCard({ data }) {


  return (
    <div className={styles.cardBody}>
      <div>
        <img src={data?.image || profileImg} alt="" className={styles.userImg} />
      </div>

      <div className={styles.cardDetails}>
        <h4>{data.user?.name}</h4>
        <span>{data.user?.email}</span>
        <p>{data?.review}</p>
      </div>
    </div>
  );
}

export default UserReviewCard;
