// import React, { useEffect, useState } from "react";
// const PeopleSlider = () => {
//   const [images, setImages] = useState([]);
  
//   useEffect(() => {
//     const total = 10; 
//     const imgs = [];
//     for (let i = 1; i <= total; i++) {
//       imgs.push(`/people/img${i}.jpg`);
//     }
//     setImages(imgs);
//   }, []);
  
//   return (
//     <div className="w-full py-16 bg-white select-none">
//       <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-800 mb-10">
//         Loved by Businesses Everywhere
//       </h2>
//       <div className="relative overflow-hidden">
//         {/* Sliding row */}
//         <div className="flex animate-scrollSlide gap-6 items-center">
//           {[...images, ...images].map((img, idx) => (
//             <div
//               key={idx}
//               className="rounded-xl overflow-hidden shadow-xl
//                          transition-transform duration-700 hover:scale-105"
//               style={{
//                 minWidth: "300px",  // keeps images nice and wide
//                 height: "auto",
//               }}
//             >
//               <img
//                 src={img}
//                 alt="business-person"
//                 className="w-full h-full object-cover"
//                 style={{
//                   borderRadius: "12px",
//                 }}
//               />
//             </div>
//           ))}
//         </div>
//         {/* Left Fade */}
//         <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
//         {/* Right Fade */}
//         <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
//       </div>
//     </div>
//   );
// };


// export default PeopleSlider;


import React, { useEffect, useState } from "react";
const PeopleSlider = () => {
  const [images, setImages] = useState([]);
  useEffect(() => {
    const total = 10;
    const imgs = [];
    for (let i = 1; i <= total; i++) {
      imgs.push(`/people/img${i}.jpg`);
    }
    setImages(imgs);
  }, []);
  // Duplicate twice only (not 3×)
  const extendedImages = [...images, ...images, ...images];
  return (
    <div className="w-full py-14 bg-white select-none">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-800 mb-10">
        Loved by Businesses Everywhere
      </h2>
      <div className="relative overflow-hidden">
        <div
          className="
            flex
            animate-scrollFast
            gap-4
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
                shadow-lg
                hover:scale-[1.03]
                transition-transform
                duration-500
              "
              style={{
                minWidth: "160px", // much smaller, perfect for mobile
                maxWidth: "220px", // nice size for desktop
                height: "120px",   // consistent & clean
              }}
            >
              <img
                src={img}
                alt="business-person"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        {/* left fade */}
        <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        {/* right fade */}
        <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};
export default PeopleSlider;