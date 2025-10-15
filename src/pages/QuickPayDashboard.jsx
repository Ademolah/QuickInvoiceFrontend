import React from "react";
import { useState, useEffect } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from 'react-hot-toast';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import api from "../utils/api";




// const BASEURL = "http://localhost:4000";

const BASEURL = "https://quickinvoice-backend-1.onrender.com"

const QuickPayDashboard = () => {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isPending, setIsPending] = useState(false); // to change modal text
  const [transactions, setTransactions] = useState([]);
  const [businessName, setBusinessName] = useState('');


  //NIN
  const [showNinModal, setShowNinModal] = useState(false)
  const [ninInput, setNinInput] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()


  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [accountDetails, setAccountDetails] = useState({
    bankName: "",
    accountName: "",
    accountNumber: ""
  });
  
  
  // useEffect(() => {
  //   const checkVerification = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const res = await axios.get(`${BASEURL}/api/anchor/check-customer`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       if (!res.data.verified) {
  //         setShowVerifyModal(true);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   checkVerification();
  // }, []);

  useEffect(() => {
  const checkTransactions = async () => {
    const res = await axios.get(`${BASEURL}/api/users/fetchTransactions`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (res.data.count >= 5 && !res.data.user.valid_NIN) {
      setShowNinModal(true);
    }
  };
  checkTransactions();
  }, []);

  const handleNinSubmit = async () => {
    if (!/^\d{11}$/.test(ninInput)) {
      return alert("NIN must be exactly 11 digits");
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASEURL}/api/users/verify-nin`,
        { nin: ninInput },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.status === 200) {
        setShowNinModal(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };


  useEffect(()=> {
    const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASEURL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBusinessName(res.data.businessName || '');
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  }
  fetchUser()
  })
  

  const handleReceiveFunds = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${BASEURL}/api/anchor/account/details`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const data = res.data?.data;
    console.log(data);
    
    // const included = res.data?.included?.[0]?.attributes;
    const included = data?.included?.[0]?.attributes;
    console.log(included);
    
    
    if (!data || !included) {
      console.error("Invalid response format");
      return;
    }
    // Extract details
    const bankName = included?.bank?.name || "N/A";
    const accountName = included?.name || "N/A";
    const accountNumber = included?.accountNumber || "N/A";
    setAccountDetails({
      bankName,
      accountName,
      accountNumber
    });
    setShowReceiveModal(true);
  } catch (err) {
    console.error("Error fetching account details:", err);
  }
};

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // const user = JSON.parse(localStorage.getItem('user'))

     
      const res = await axios.get(`${BASEURL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` } 
      })


      const customerId = res.data?.anchor?.customerId;
      

      if(!customerId){
        console.log("No customer ID found for this user");
        return
      }
      setIsPending(true);
      await axios.post(
        `${BASEURL}/api/anchor/verify-customer/${customerId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendMoney = () => {
    navigate("/transfer")
  }


  //for transaction history
  // const accountBalance = transactions[0]?.accountBalance || "---"
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 7; // same as backend default

  useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${BASEURL}/api/transactions/history?page=${currentPage}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetched Transactions:", res.data.transactions);
      setTransactions(res.data.transactions);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching paginated transactions:", err);
    }
  };
  fetchTransactions();
}, [currentPage]);

const handleNext = () => {
  if (currentPage < totalPages) {
    setCurrentPage((prev) => prev + 1);
  }
};
const handlePrev = () => {
  if (currentPage > 1) {
    setCurrentPage((prev) => prev - 1);
  }
};
  
//   useEffect(() => {
//   const fetchTransactions = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${BASEURL}/api/transactions/history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("Transactions: ",res.data.transactions);
      
//       setTransactions(res.data.transactions);
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   fetchTransactions();
// }, []);


  useEffect(() => {
  let interval;
  if (isPending) {
    interval = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASEURL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // If user is verified, stop polling and close modal
        if (res.data?.anchor?.verified === true) {
          clearInterval(interval);
          setIsPending(false);
          setShowVerifyModal(false); // CLOSE MODAL
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000); // checks every 5 seconds
  }
  return () => clearInterval(interval);
}, [isPending]);


const handleDownloadPDF = async () => {
  const { jsPDF } = await import("jspdf");
  const html2canvas = (await import("html2canvas")).default;
  const receiptElement = document.getElementById("receipt-content");
  const buttons = receiptElement.querySelector(".receipt-actions"); // :white_check_mark: Select the buttons wrapper
  // :white_check_mark: Hide buttons before capture
  if (buttons) buttons.style.display = "none";
  const canvas = await html2canvas(receiptElement, { scale: 2 });
  // :white_check_mark: Show buttons again
  if (buttons) buttons.style.display = "flex";
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const imgProps = pdf.getImageProperties(imgData);
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`transaction_${selectedTxn._id}.pdf`);
};

const handleShare = async (txn) => {
  try {
    const { jsPDF } = await import("jspdf");
    const html2canvas = (await import("html2canvas")).default;

    const receiptElement = document.getElementById("receipt-content");
    const buttons = receiptElement.querySelector(".receipt-actions");

    // Hide buttons temporarily
    if (buttons) buttons.style.display = "none";

    const canvas = await html2canvas(receiptElement, { scale: 2 });
    if (buttons) buttons.style.display = "flex";

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Convert to Blob for sharing
    const pdfBlob = pdf.output("blob");

    if (navigator.share) {
      const file = new File([pdfBlob], `transaction_${txn._id}.pdf`, {
        type: "application/pdf",
      });

      await navigator.share({
        title: "Transaction Receipt",
        text: "Here is your transaction receipt.",
        files: [file],
      });
    } else {
      alert("Sharing not supported on this device. Use Download instead.");
    }
  } catch (error) {
    console.error("Share failed:", error);
    alert("Unable to share receipt.");
  }
};


// useEffect(() => {
//   const checkInitialVerification = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${BASEURL}/api/users/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data?.anchor?.verified === true) {
//         setShowVerifyModal(false);
//         setIsPending(false);
//       }
//     } catch (err) {
//       console.error("Initial verification check error:", err);
//     }
//   };
//   checkInitialVerification();
// }, []);

const [showReceipt, setShowReceipt] = useState(false);
const [selectedTxn, setSelectedTxn] = useState(null);
const handleOpenReceipt = (txn) => {
  setSelectedTxn(txn);
  setShowReceipt(true);  // You can use modal or navigate to a new screen
};

useEffect(() => {
  const checkVerification = async () => {
    try {
      const token = localStorage.getItem("token");
      // :white_check_mark: First, get the full user data
      const userRes = await axios.get(`${BASEURL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const isVerified = userRes.data?.anchor?.verified === true;
      if (isVerified) {
        setShowVerifyModal(false);
        setIsPending(false);
        return; // :white_check_mark: No need to check again
      }
      // :white_check_mark: If not verified, double-check using check-customer
      const anchorRes = await axios.get(`${BASEURL}/api/anchor/check-customer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!anchorRes.data?.verified) {
        setShowVerifyModal(true);
      } else {
        setShowVerifyModal(false);
      }
    } catch (err) {
      console.error("Verification check error:", err);
    }
  };
  checkVerification();
}, []);





  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">

      {/* MODAL */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm shadow-lg text-center">
            {!isPending ? (
              <>
                <h2 className="text-lg font-semibold mb-4">Verify Your Account</h2>
                <p className="text-sm mb-4">
                  You need to verify your account to continue using QuickPay.
                </p>
                <button
                  onClick={handleVerify}
                  className="bg-[#0046A5] hover:bg-[#00398D] text-white px-6 py-2 rounded-lg"
                >
                  Verify
                </button>
              </>
            ) : (
              <h2 className="text-lg font-semibold">Verification Pending...</h2>
            )}
          </div>
        </div>
      )}

        {showReceiveModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm shadow-lg text-center">
              <h2 className="text-lg font-semibold mb-4">Receive Funds</h2>
              {/* Bank Name */}
              <div className="mb-3 flex justify-between items-center">
                <p>
                  <strong>Bank Name:</strong> {accountDetails.bankName}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(accountDetails.bankName);
                    toast.success("Bank Name copied!");
                  }}
                  className="text-sm text-[#0046A5] underline"
                >
                  Copy
                </button>
              </div>
              {/* Account Name */}
              <div className="mb-3 flex justify-between items-center">
                <p>
                  <strong>Account Name:</strong> {accountDetails.accountName}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(accountDetails.accountName);
                    toast.success("Account Name copied!");
                  }}
                  className="text-sm text-[#0046A5] underline"
                >
                  Copy
                </button>
              </div>
              {/* Account Number */}
              <div className="mb-4 flex justify-between items-center">
                <p>
                  <strong>Account Number:</strong> {accountDetails.accountNumber}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(accountDetails.accountNumber);
                    toast.success("Account Number copied!");
                  }}
                  className="text-sm text-[#0046A5] underline"
                >
                  Copy
                </button>
              </div>
              {/* Copy All Button */}
              <button
                onClick={() => {
                  const allDetails = `
                Bank Name: ${accountDetails.bankName}
                Account Name: ${accountDetails.accountName}
                Account Number: ${accountDetails.accountNumber}
                  `;
                  navigator.clipboard.writeText(allDetails.trim());
                  toast.success("Account details copied!");
                }}
                className="bg-[#00B86B] hover:bg-[#056a40] text-white px-4 py-2 rounded-lg mb-3 w-full"
              >
                Copy All
              </button>
              {/* Close Button */}
              <button
                onClick={() => setShowReceiveModal(false)}
                className="bg-[#0046A5] hover:bg-[#00398D] text-white px-6 py-2 rounded-lg w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Receipt Modal */}
       
        {showReceipt && selectedTxn && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    {/* :white_check_mark: Wrap ONLY this div */}
    <div
      id="receipt-content"
      className="bg-white w-[95%] max-w-md rounded-xl shadow-2xl p-6 border-t-4 border-[#0046A5] relative"
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
          {/* Q Icon Box */}
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gradient-to-br from-[#0046A5] to-[#00B86B] shadow-md">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          {/* Text */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#0046A5] leading-tight">
              Transaction Receipt
            </h2>
            <p className="text-sm text-gray-500 -mt-1">QuickPay</p>
          </div>
        </div>
      {/* Details */}
      <div className="space-y-4 text-gray-700 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Amount:</span>
            <span
              className={`font-semibold ${
                selectedTxn.transactionType === "INBOUND_TRANSFER"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {selectedTxn.transactionType === "INBOUND_TRANSFER" ? "+" : "-"}
              ₦{selectedTxn.transactionAmount?.toLocaleString()}
            </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Account Name:</span>
          <span>{selectedTxn.transactionDetail?.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Bank Name:</span>
          <span>{selectedTxn.transactionDetail?.bank}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Account Number:</span>
          <span>{selectedTxn.transactionDetail?.accountNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Description:</span>
          <span>{selectedTxn?.transactionDescription || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Transaction Status:</span>
          <span className="text-green-600">{selectedTxn?.transactionStatus || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Reference:</span>
          <span>{selectedTxn?.transactionReference || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Date & Time:</span>
          <span>{new Date(selectedTxn.createdAt).toLocaleString()}</span>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex justify-between mt-8">
        {/* Buttons */}
        <div className="flex justify-between mt-8 receipt-actions">
          <button
            onClick={() => setShowReceipt(false)}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition mr-4"
          >
            Close
          </button>
          
          <button
            onClick={() => handleShare(selectedTxn)}
            className="px-4 py-2 rounded-md bg-[#0046A5] hover:bg-[#00398D] text-white transition mr-4"
          >
            Share
          </button>

          <button
            onClick={() => handleDownloadPDF(selectedTxn)}
            className="px-4 py-2 rounded-md bg-[#0046A5] hover:bg-[#00398D] text-white transition"
          >
            Download
          </button>
        </div>
              </div>
              {/* Footer */}
              <div className="mt-6 text-center text-xs text-gray-500">
                Generated by{" "}
                <span className="text-[#0046A5] font-semibold">QuickInvoice NG</span> © 2025
              </div>
            </div>
          </div>
        )}


      {/* HEADER */}
      <h1 className="text-3xl font-bold text-[#0046A5] mb-6">
        Hi, {businessName}
      </h1>
      {/* BALANCE CARD */}
      <div className="bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white rounded-2xl shadow-lg p-6 mb-8 flex justify-between items-center">
        <div>
          <p className="text-lg opacity-80">Account Balance</p>
          <h2 className="text-4xl font-bold mt-1">₦{(transactions[0]?.accountBalance || "---").toLocaleString("en-US")}</h2>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 opacity-30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
          >
            <path d="M12 8c-3.75 0-7.5 1.5-7.5 4.5S8.25 17 12 17s7.5-1.5 7.5-4.5S15.75 8 12 8z" />
          </svg>
        </div>
      </div>
      {/* ACTION BUTTONS */}
        <div className="flex flex-row gap-4 mb-10">
          <button
            className="bg-[#0046A5] hover:bg-[#00398D] text-white px-6 py-3 rounded-lg shadow-md w-full md:w-auto"
            onClick={handleSendMoney}
          >
            Send Money
          </button>
          <button
            className="bg-[#00B86B] hover:bg-[#00965A] text-white px-6 py-3 rounded-lg shadow-md w-full md:w-auto"
            onClick={handleReceiveFunds}
          >
            Receive Money
          </button>
        </div>
      {/* TRANSACTIONS History TABLE */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold text-[#0046A5] mb-4">
          Transaction History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="p-3">Type</th>
                <th className="p-3">Name</th>
                <th className="p-3">Bank</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((txn) => (
                  <tr
                    key={txn._id} 
                    onClick={()=> handleOpenReceipt(txn)}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* :white_check_mark: Type (Display Credit/Debit based on transactionType) */}
                    <td
                      className={`p-3 font-medium ${
                        txn.transactionType === "INBOUND_TRANSFER"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {txn.transactionType === "INBOUND_TRANSFER"
                        ? "Credit"
                        : "Debit"}
                    </td>
                    {/* ✅ Name */}
                    <td className="p-3">
                      {txn.transactionDetail?.name || "N/A"}
                    </td>
                    {/* ✅ Bank */}
                    <td className="p-3">
                      {txn.transactionDetail?.bank || "N/A"}
                    </td>
                    {/* ✅ Amount */}
                    <td className="p-3">
                      ₦{txn.transactionAmount?.toLocaleString() || "0"}
                    </td>
                    <td>
                      {new Date(txn.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        // hour: "2-digit",
                        // minute: "2-digit",
                        // second: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* PAGINATION */}
        <div className="flex justify-end items-center mt-4 space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Prev
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Next
          </button>
        </div>

        {/* Floating Q Button at Bottom */}
        <button
          onClick={() => navigate("/dashboard")}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-green-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-green-700 transition"
        >
          Q
        </button>
      </div>

      {/* NIN MODAL */}

      {showNinModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-bold mb-3">Identity Verification Required</h2>
          <p className="text-sm mb-4">For compliance purposes, please verify your NIN to continue.</p>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter 11-digit NIN"
            value={ninInput}
            onChange={(e) => setNinInput(e.target.value)}
          />
          <button
            className="w-full bg-[#0046A5] text-white py-2 rounded-lg mt-4"
            onClick={handleNinSubmit}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Submit"}
          </button>
        </div>
      </div>
    )}
    
    </div>
  );
};
export default QuickPayDashboard