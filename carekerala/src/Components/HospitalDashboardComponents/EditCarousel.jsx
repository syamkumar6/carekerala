/* eslint-disable react/prop-types */
import styles from "./EditCarousel.module.css";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";

import addImageIcon from "../../assets/addIcon.svg";

function EditCarousel({ hospital, setHospital }) {
  const [loading, setLoading] = useState(false)
  const [loadingId, setLoadingId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");


  const handleAddImage = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setImagePreview(base64Data);
        console.log(imagePreview);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpdateImage = () => {
    setLoading(true)
    const hospitalId = hospital._id;
    axios.post(`${import.meta.env.VITE_BASE_URL}/hospitals/dashboard/add-image/` +hospitalId,
        { image: imagePreview },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then((res) => {
        setHospital(res.data.hospital);
        setLoading(false)
        setImagePreview("");
        toast.success(res.data.message);
      })
      .catch((error) => {
        console.error("Error updating image:", error);
        setLoading(false)
        toast.error("Failed to update image");
      });
  };

  const handleDelete = (carouselId, hospitalId) => {
    setLoadingId(carouselId)
    axios.defaults.withCredentials = true;
    axios.delete(`${import.meta.env.VITE_BASE_URL}/hospitals/dashboard/` +hospitalId +`/` +carouselId)
      .then((res) => {
        setHospital(res.data.hospital);
        setLoadingId(null)
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        setLoadingId(null)
        toast.error("Failed to delete image");
      });
  };

  return (
    <div className={styles.carouselDiv}>
      <h4>Edit carousel</h4>
      <ul>
        {hospital?.carousel?.map((carouselItem, index) => {
          return (
            <li key={index}>
              <img src={carouselItem.img} alt="" />
              <button
                onClick={() => handleDelete(carouselItem._id, hospital._id)}>
                {loadingId === carouselItem._id ? (
                        <PulseLoader size={5} color={"rgb(236, 236, 236)"} />
                      ) : (
                        "Delete"
                      )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.addImgDiv}>
        {!imagePreview && (
          <>
            <input
              type="file"
              id="imageInput"
              name="image"
              style={{ display: "none" }}
            />
            <button
              className={styles.addImg}
              onClick={() =>handleAddImage(hospital._id, setHospital, setImagePreview)}>
              <img src={addImageIcon} alt="" />
            </button>
          </>
        )}
        {imagePreview && (
          <div>
            <img src={imagePreview} alt="Image Preview" />
            <div className={styles.previewBtns}>
              <button
                onClick={() => setImagePreview("")}
                className={styles.addimgBtnRed}>
                Cancel
              </button>
              <button
                className={styles.btnDark}
                onClick={() => handleUpdateImage()}>
                {loading ?  <PulseLoader size={6}   color={'rgb(236, 236, 236)'} /> : 'Add Image'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditCarousel;
