
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Favour J.",
      role: "SweetToothiesByNk",
      feedback:
        "QuickInvoice NG has completely simplified my invoicing. I can send, track, and even share receipts instantly. It saves me hours every week.",
      rating: 4,
    },
    {
      name: "Eluonye U.",
      role: "HOMKELLA CLEANING AND LAUNDRY SERVICES",
      feedback:
        "The smart collections feature is a game changer. My clients pay faster and I always look professional. Worth every naira!",
      rating: 5,
    },
    {
      name: "Agoremi A.",
      role: "Charion Walkers Footwear",
      feedback:
        "I love how intuitive it is. From receipts to tracking payments, everything feels premium and easy to use.",
      rating: 5,
    },
    {
      name: "Aminu jr.",
      role: "Blaze Collections Footwear, Abuja",
      feedback:
        "QuickInvoice NG gives me control and confidence with my finances. It’s the tool I didn’t know I needed.",
      rating: 5,
    },
  ];

  // Duplicate list so it loops seamlessly
  const loopTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="bg-[#F9FAFB] py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center mb-10 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0046A5] font-poppins">
          Trusted by Businesses Across Nigeria
        </h2>
      </div>

      {/* Scrolling container */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 40,
            ease: "linear",
          }}
        >
          {loopTestimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white min-w-[300px] max-w-[350px] rounded-2xl shadow-md p-6 flex flex-col"
            >
              <div className="flex text-[#00B86B] mb-3">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 text-base font-inter mb-6">
                “{t.feedback}”
              </p>
              <div className="mt-auto">
                <p className="font-semibold text-[#0046A5]">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


