/* eslint-disable react/prop-types */
import styles from "./EditCarousel.module.css";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

import addImageIcon from "../../assets/addIcon.svg";

function EditCarousel({ hospital, setHospital }) {
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
        setImagePreview("");
        toast.success(res.data.message);
      })
      .catch((error) => {
        console.error("Error updating image:", error);
        toast.error("Failed to update image");
      });
  };

  const handleDelete = (carouselId, hospitalId) => {
    axios.defaults.withCredentials = true;
    axios.delete(`${import.meta.env.VITE_BASE_URL}/hospitals/dashboard/` +hospitalId +`/` +carouselId)
      .then((res) => {
        setHospital(res.data.hospital);
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
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
                Delete image
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
                Add Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditCarousel;
