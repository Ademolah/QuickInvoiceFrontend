import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Smartphone, Chrome, Globe, Download } from "lucide-react";


export default function HowToInstall() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center px-6 py-16">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0046A5] mb-6 text-center">
            How to Install QuickInvoice NG
          </h1>
          <p className="text-gray-600 text-center mb-12">
            You can install QuickInvoice NG on your mobile device or desktop for a fast, app-like experience.
          </p>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Android Instructions */}
            <div className="bg-[#F9FAFB] rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="text-[#0046A5]" size={28} />
                <h2 className="text-xl font-semibold text-[#0046A5]">Android Users</h2>
              </div>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 leading-relaxed">
                <li>
                  Open <span className="font-semibold text-[#0046A5]">QuickInvoice NG</span> in{" "}
                  <span className="font-medium text-[#00B86B]">Google Chrome</span>.
                </li>
                <li>
                  Tap the <span className="font-semibold">menu (⋮)</span> icon in the top-right corner.
                </li>
                <li>Choose <span className="font-semibold">“Add to Home screen”</span>.</li>
                <li>Confirm and tap <span className="font-semibold">“Install”</span>.</li>
                <li>Now, QuickInvoice NG will appear on your home screen like a native app!</li>
              </ol>
              <div className="mt-6 flex justify-center">
                <Download className="text-[#00B86B]" size={40} />
              </div>
            </div>
            {/* iOS Instructions */}
            <div className="bg-[#F9FAFB] rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="text-[#0046A5]" size={28} />
                <h2 className="text-xl font-semibold text-[#0046A5]">iPhone / iPad Users</h2>
              </div>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 leading-relaxed">
                <li>
                  Open <span className="font-semibold text-[#0046A5]">QuickInvoice NG</span> in{" "}
                  <span className="font-medium text-[#00B86B]">Safari</span>.
                </li>
                <li>
                  Tap the <span className="font-semibold">Share</span> icon <span className="text-sm text-gray-500">(square with arrow)</span>.
                </li>
                <li>
                  Scroll down and select <span className="font-semibold">“Add to Home Screen”</span>.
                </li>
                <li>Tap <span className="font-semibold">Add</span> in the top-right corner.</li>
                <li>
                  You’ll now have QuickInvoice NG on your home screen just like a mobile app.
                </li>
              </ol>
              <div className="mt-6 flex justify-center">
                <Download className="text-[#00B86B]" size={40} />
              </div>
            </div>
          </div>
          {/* Browser Support Section */}
          <div className="mt-16 bg-[#0046A5] text-white rounded-2xl p-8 text-center">
            <Chrome className="mx-auto mb-3" size={36} />
            <h2 className="text-2xl font-semibold mb-3">Supported Browsers</h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              QuickInvoice NG works best on modern browsers like Google Chrome, Safari, and Microsoft Edge. 
              Make sure you’re using the latest version for the smoothest experience.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}












