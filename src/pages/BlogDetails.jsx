

import { useParams, Link } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
import { blogPosts } from "./data/blogPosts";

export default function BlogDetail({ posts }) {
  const { id } = useParams();

  

    const post = blogPosts.find((p)=> String(p.id)===id)

  // Simple reusable Button (defined locally)
  const Button = ({ children, className = "", ...props }) => (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
    >
      {children}
    </button>
  );

  if (!post) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p className="mb-4">Post not found.</p>
        <Link to="/blog">
          <Button className="bg-[#0046A5] text-white hover:bg-[#003a8c]">
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    

    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
  

  {/* Post header */}
  <h1 className="bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white rounded-2xl p-6 md:p-8 mb-8 shadow-xl text-4xl font-extrabold ">
    {post.title}
  </h1>
  <p className="text-gray-500 text-sm mb-10 border-b border-gray-200 pb-4">
    {post.date} • By{" "}
    <span className="font-medium text-gray-700">{post.author}</span>
  </p>

  {/* Post content */}
  <div
    className="prose prose-lg lg:prose-xl max-w-none text-gray-800 leading-relaxed 
               prose-headings:font-semibold prose-headings:text-gray-900 
               prose-a:text-[#0046A5] prose-a:no-underline hover:prose-a:underline 
               prose-img:rounded-lg prose-img:shadow-md prose-strong:text-gray-900"
    dangerouslySetInnerHTML={{ __html: post.content }}
  />

  {/* Bottom back button */}
  <div className="mt-12 flex justify-center">
    <Link to="/blog">
      <Button className="px-6 py-3 bg-[#0046A5] text-white font-semibold rounded-lg shadow-md hover:bg-[#003a8c] transition">
        Back to Blog
      </Button>
    </Link>
  </div>
</div>
  );
}

