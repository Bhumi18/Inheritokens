import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import screenshot1 from "../assets/images/Screenshot1.png";
import Cookies from "universal-cookie";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

function InformationSlider({ setInformationSlider }) {
  const cookies = new Cookies();
  if (cookies.get("showInformation") !== 0)
    cookies.set("showInformation", 1, { path: "/" });

  return (
    <>
      <div
        className="overlay"
        onClick={() => {
          cookies.set("showInformation", 0, { path: "/" });
          setInformationSlider(false);
        }}
      ></div>
      <div id="modal">
        <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
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
  );
}

export default InformationSlider;
