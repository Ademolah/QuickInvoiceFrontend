// import React from "react";
// import { motion } from "framer-motion";
// import { Calendar, ArrowRight } from "lucide-react";
// import Footer from "../components/Footer";

// // Inline Button component
// const Button = ({ children, className, ...props }) => (
//   <button
//     {...props}
//     className={`px-4 py-2 rounded-lg font-medium border transition-all ${className}`}
//   >
//     {children}
//   </button>
// );

// // Inline Card component
// const Card = ({ children, className }) => (
//   <div
//     className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden ${className}`}
//   >
//     {children}
//   </div>
// );

// const CardContent = ({ children, className }) => (
//   <div className={`p-6 ${className}`}>{children}</div>
// );

// export default function Blog() {
//   // Sample blog data (replace with API or CMS later)
//   const posts = [
//     {
//       id: 1,
//       title: "Mastering Invoicing: 5 Tips to Get Paid Faster",
//       excerpt:
//         "Late payments can affect cash flow. Discover 5 powerful invoicing strategies to ensure your clients pay on time, every time.",
//       date: "Sept 13, 2025",
//       author: "QuickInvoice Team",
//       image:
//         "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format",
//     },
//     {
//       id: 2,
//       title: "Why Small Businesses Should Embrace Digital Invoicing",
//       excerpt:
//         "Switching to digital invoicing can save time, reduce errors, and boost your brand credibility. Here’s why it’s a must in 2025.",
//       date: "Sept 7, 2025",
//       author: "QuickInvoice Insights",
//       image:
//         "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format",
//     },
//     {
//       id: 3,
//       title: "Pro vs Free: Which QuickInvoice Plan is Right for You?",
//       excerpt:
//         "Choosing the right plan can impact your business growth. We break down the key differences between Free and Pro.",
//       date: "Aug 29, 2025",
//       author: "QuickInvoice NG",
//       image:
//         "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-[#F9FAFB]">
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-r from-[#0046A5] via-[#0046A5] to-[#00B86B] text-white py-20 px-6 text-center overflow-hidden">
//         <motion.h1
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-4xl md:text-5xl font-bold mb-4"
//         >
//           QuickInvoice NG Blog
//         </motion.h1>
//         <motion.p
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1 }}
//           className="text-lg md:text-xl max-w-2xl mx-auto"
//         >
//           Tips, features, and insights to help you stay on top of your business
//           game.
//         </motion.p>
//       </section>

//       {/* Blog Grid */}
//       <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
//         {posts.map((post) => (
//           <motion.div
//             key={post.id}
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <Card>
//               <img
//                 src={post.image}
//                 alt={post.title}
//                 className="w-full h-48 object-cover"
//               />
//               <CardContent>
//                 <h2 className="text-xl font-semibold text-[#0046A5] mb-2">
//                   {post.title}
//                 </h2>
//                 <p className="text-gray-600 mb-4">{post.excerpt}</p>
//                 <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//                   <span className="flex items-center gap-2">
//                     <Calendar className="w-4 h-4" /> {post.date}
//                   </span>
//                   <span>{post.author}</span>
//                 </div>
//                 <Button
//                   className="w-full border-[#0046A5] text-[#0046A5] hover:bg-[#0046A5] hover:text-white"
//                   onClick={() => alert("Navigate to blog details page")}
//                 >
//                   Read More <ArrowRight className="ml-2 w-4 h-4 inline" />
//                 </Button>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </section>
//       <Footer/>
//     </div>
//   );
// }

import React from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { blogPosts } from "./data/blogPosts";

// Inline Button component
const Button = ({ children, className, ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-lg font-medium border transition-all ${className}`}
  >
    {children}
  </button>
);

// Inline Card component
const Card = ({ children, className }) => (
  <div
    className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);


export default function Blog() {
//   Sample blog data (replace with API or CMS later)
//   const posts = [
//     {
//       id: 1,
//       title: "Mastering Invoicing: 5 Tips to Get Paid Faster",
//       excerpt:
//         "Late payments can affect cash flow. Discover 5 powerful invoicing strategies to ensure your clients pay on time, every time.",
//       date: "Sept 13, 2025",
//       author: "QuickInvoice Team",
//       image:
//         "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format",
//     },
//     {
//       id: 2,
//       title: "Why Small Businesses Should Embrace Digital Invoicing",
//       excerpt:
//         "Switching to digital invoicing can save time, reduce errors, and boost your brand credibility. Here’s why it’s a must in 2025.",
//       date: "Sept 7, 2025",
//       author: "QuickInvoice Insights",
//       image:
//         "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format",
//     },
//     {
//       id: 3,
//       title: "Pro vs Free: Which QuickInvoice Plan is Right for You?",
//       excerpt:
//         "Choosing the right plan can impact your business growth. We break down the key differences between Free and Pro.",
//       date: "Aug 29, 2025",
//       author: "QuickInvoice NG",
//       image:
//         "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format",
//     },
//   ];

  return (
    
    <div className="min-h-screen bg-[#F9FAFB]">
        <Navbar/>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#0046A5] via-[#0046A5] to-[#00B86B] text-white py-20 px-6 text-center overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          QuickInvoice NG Blog
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-lg md:text-xl max-w-2xl mx-auto"
        >
          Tips, features, and insights to help you stay on top of your business
          game.
        </motion.p>
      </section>

      {/* Blog Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <CardContent>
                <h2 className="text-xl font-semibold text-[#0046A5] mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {post.date}
                  </span>
                  <span>{post.author}</span>
                </div>

                <Link to={`/blog/${post.id}`}>
                <Button
                  className="w-full border-[#0046A5] text-[#0046A5] hover:bg-[#0046A5] hover:text-white"
                  // onClick={() => alert("Navigate to blog details page")}
                >
                  Read More <ArrowRight className="ml-2 w-4 h-4 inline" />
                </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>
      <Footer/>
    </div>
  );
}