import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const PrivacyPolicy = () => {
  return (
    
    <div className="min-h-screen bg-[#F9FAFB] ">
        <Navbar />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 md:p-12">
        
        <h1 className="text-3xl font-bold text-[#0046A5] mb-6 text-center">
          Privacy Policy & Terms of Use
        </h1>
        <p className="text-sm text-gray-500 text-center mb-10">
          Effective Date: October 2025
        </p>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#00B86B] mb-3">
            1. Introduction
          </h2>
          <p>
            Welcome to <strong>QuickInvoice NG</strong> (“we,” “our,” or “us”).
            By using our platform, you agree to the collection and use of
            information in accordance with this policy. This document also
            serves as our official <strong>Terms of Use</strong>, governing your
            access and use of QuickInvoice NG services.
          </p>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#00B86B] mb-3">
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Personal Information:</strong> Name, email address, phone
              number, and business details provided during registration.
            </li>
            <li>
              <strong>Financial Information:</strong> Data related to invoices,
              payments, and business transactions you process through the
              platform.
            </li>
            <li>
              <strong>Usage Data:</strong> Browser type, IP address, and device
              information used to improve service performance and security.
            </li>
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#00B86B] mb-3">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain QuickInvoice NG services.</li>
            <li>To process and track invoices and payments securely.</li>
            <li>To personalize user experience and improve our platform.</li>
            <li>To send notifications, updates, and promotional materials.</li>
            <li>To comply with legal obligations and regulatory requirements.</li>
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#00B86B] mb-3">
            4. Data Security
          </h2>
          <p>
            We use industry-standard security measures, including{" "}
            <strong>HTTPS/TLS encryption</strong>, regular vulnerability scans,
            and restricted database access, to protect your data against
            unauthorized access, alteration, or disclosure.
          </p>
          <p className="mt-3">
            However, while we strive to use commercially acceptable means to
            protect your personal information, we cannot guarantee absolute
            security. You are responsible for maintaining the confidentiality of
            your account credentials.
          </p>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#00B86B] mb-3">
            5. Data Retention
          </h2>
          <p>
            We retain your data only for as long as necessary to provide our
            services, comply with legal obligations, resolve disputes, and
            enforce agreements. You may request data deletion at any time by
            contacting us.
          </p>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#00B86B] mb-3">
            6. Your Rights
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Right to access and request copies of your data.</li>
            <li>Right to request correction or deletion of your data.</li>
            <li>Right to withdraw consent for data processing.</li>
            <li>
              Right to lodge a complaint under the Nigeria Data Protection Act
              (NDPA 2023).
            </li>
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#00B86B] mb-3">
            7. Acceptable Use
          </h2>
          <p>
            You agree to use QuickInvoice NG responsibly and not engage in
            unlawful, fraudulent, or abusive behavior. Any misuse, including
            unauthorized access, data scraping, or violation of our intellectual
            property rights, may result in immediate account termination.
          </p>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#00B86B] mb-3">
            8. Intellectual Property
          </h2>
          <p>
            All content, trademarks, and logos displayed on QuickInvoice NG are
            the exclusive property of Binary Technologies and are protected by
            copyright and trademark laws. You may not reproduce, modify, or
            redistribute any materials without written permission.
          </p>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#00B86B] mb-3">
            9. Limitation of Liability
          </h2>
          <p>
            QuickInvoice NG shall not be liable for any indirect, incidental, or
            consequential damages arising out of your use or inability to use
            our services. We do not guarantee uninterrupted or error-free
            operation of the platform.
          </p>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#00B86B] mb-3">
            10. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy and Terms of Use periodically.
            Updates will be communicated through the app or via email. Your
            continued use of the platform constitutes acceptance of any
            modifications.
          </p>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#00B86B] mb-3">
            11. Contact Us
          </h2>
          <p>
            For questions, feedback, or data-related requests, please contact
            us at:
          </p>
          <p className="mt-2">
            📧 <strong>support@quickinvoice.ng</strong>
          </p>
          <p>
            📍 Binary Technologies, Abuja, Nigeria.
          </p>
        </section>
        <p className="text-sm text-center text-gray-400 mt-12">
          &copy; {new Date().getFullYear()} QuickInvoice NG. All rights reserved.
        </p>
        
      </div>
      <Footer/>
    </div>
    
  );
};
export default PrivacyPolicy;