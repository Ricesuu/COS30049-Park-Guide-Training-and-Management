import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function ImageCarousel({ images }) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      pagination={{ clickable: false }}
      allowTouchMove={false}
      loop={true}
      className="w-full h-full"
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
