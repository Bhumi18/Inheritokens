import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import screenshot1 from "../assets/images/Screenshot1.png";
import m1 from "../assets/images/mobilescreenshot01.png";
import Cookies from "universal-cookie";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";

function InformationSlider({ setInformationSlider }) {
  const [formobile, setForMobile] = useState(
    window.innerWidth < 601 ? true : false
  );
  const cookies = new Cookies();
  // cookies.set("showInformation", 1, { path: "/" });
  // if (cookies.get("showInformation") !== 0) {
  //   cookies.set("showInformation", 1, { path: "/" });
  // }

  return (
    <>
      {formobile ? (
        <>
          <div
            className="overlay-home"
            onClick={() => {
              cookies.set("showInformation", 1, { maxAge: 200 });
              setInformationSlider(false);
            }}
          ></div>
          <div id="modal-home">
            <Swiper
              pagination={{
                dynamicBullets: true,
              }}
              modules={[Pagination]}
              className="mySwiper"
            >
              <SwiperSlide>
                <img src={m1} alt="screenshot1" width="100%" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={m1} alt="screenshot1" width="100%" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={m1} alt="screenshot1" width="100%" />
              </SwiperSlide>
            </Swiper>
          </div>
        </>
      ) : (
        <>
          <div
            className="overlay-home"
            onClick={() => {
              cookies.set("showInformation", 1, { maxAge: 200 });
              setInformationSlider(false);
            }}
          ></div>
          <div id="modal-home">
            <Swiper
              pagination={{
                dynamicBullets: true,
              }}
              modules={[Pagination]}
              className="mySwiper"
            >
              <SwiperSlide>
                <img src={screenshot1} alt="screenshot1" width="100%" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={screenshot1} alt="screenshot1" width="100%" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={screenshot1} alt="screenshot1" width="100%" />
              </SwiperSlide>
            </Swiper>
          </div>
        </>
      )}
    </>
  );
}

export default InformationSlider;
