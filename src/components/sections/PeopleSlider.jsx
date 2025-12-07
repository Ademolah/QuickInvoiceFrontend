import React, { useEffect, useState } from "react";
const PeopleSlider = () => {
  const [images, setImages] = useState([]);
  useEffect(() => {
    const total = 10; // number of images
    const imgs = [];
    for (let i = 1; i <= total; i++) {
      imgs.push(`/people/img${i}.jpg`);
    }
    setImages(imgs);
  }, []);
  const extendedImages = [...images, ...images, ...images];
  // tripled for smooth mobile scrolling
  return (
    <div className="w-full py-16 bg-white select-none">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-800 mb-10">
        Loved by Businesses Everywhere
      </h2>
      <div className="relative overflow-hidden">
        <div
          className="
            flex
            animate-scrollSlide
            gap-6
            items-center
            whitespace-nowrap
          "
        >
          {extendedImages.map((img, idx) => (
            <div
              key={idx}
              className="
                flex-none
                rounded-xl
                overflow-hidden
                shadow-xl
                transition-transform
                duration-700
                hover:scale-105
              "
              style={{
                minWidth: "260px",    // mobile: wide enough to create long row
                height: "auto",
              }}
            >
              <img
                src={img}
                alt="business-person"
                className="w-full h-full object-cover"
                style={{ borderRadius: "12px" }}
              />
            </div>
          ))}
        </div>
        {/* Left Fade */}
        <div className="absolute top-0 left-0 w-24 md:w-40 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        {/* Right Fade */}
        <div className="absolute top-0 right-0 w-24 md:w-40 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default PeopleSlider;