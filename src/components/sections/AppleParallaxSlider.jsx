import React from "react";


const AppleParallaxSlider = () => {
  const images = [
    "/people/img1.jpg",
    "/people/img2.jpg",
    "/people/img3.jpg",
    "/people/img4.jpg",
    "/people/img5.jpg",
    "/people/img6.jpg",
    "/people/img7.jpg",
    "/people/img8.jpg",
  ];
  const doubled = [...images, ...images];
  return (
    <section className="w-full bg-white py-16 overflow-hidden relative">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-700 mb-10">
        Businesses Like Yours Trust QuickInvoice 
      </h2>
      {/* BACK LAYER (slow parallax) */}
      <div className="absolute top-0 left-0 w-full opacity-20 pointer-events-none">
        <div className="flex animate-scrollSlow hover:pause-scroll gap-8">
          {doubled.map((img, i) => (
            <img
              key={`bg-${i}`}
              src={img}
              alt="People"
              className="w-[180px] h-[120px] md:w-[220px] md:h-[150px] object-cover rounded-2xl shadow"
            />
          ))}
        </div>
      </div>
      {/* FRONT LAYER (fast parallax) */}
      <div className="relative">
        <div className="flex animate-scrollFast hover:pause-scroll gap-8">
          {doubled.map((img, i) => (
            <img
              key={`fg-${i}`}
              src={img}
              alt="people"
              className="
                w-[180px] h-[120px]
                md:w-[240px] md:h-[160px]
                object-cover rounded-2xl shadow-lg
                hover:scale-[1.06] transition-transform duration-500
              "
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default AppleParallaxSlider;