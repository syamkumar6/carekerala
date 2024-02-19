/* eslint-disable react/prop-types */
import styles from "./Accordion.module.css"
import { useState } from "react";
import arrow from "../../assets/arrowDown.svg"

function Accordion({ data }) {
    const [activeIndex, setActiveIndex] = useState(0);
   const handleClick = (index) => {
      setActiveIndex(index === activeIndex ? -1 : index)};
  return (
    <div className={styles.accordion}>
        {data.map((d,index) => {
            return <div key={index}>
                <button onClick={() =>handleClick(index)} className={`${styles.accBtn} ${index === activeIndex ? styles.activeAccordion : ''}`}>
                    {d.heading} <img src={arrow} alt="" /></button>
                {index === activeIndex && <p className={styles.accdescripton}>{d.details}</p>}
            </div>
        })}
    </div>

  );
}

export default Accordion;
