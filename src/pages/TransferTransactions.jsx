import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../components/SuccessfulModal";
import LoadingOverlay from "../components/LoadOverlay";


// const BASEURL = "http://localhost:4000";
const BASEURL= "https://quickinvoice-backend-1.onrender.com"

const TransferTransaction = () => {
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const [banks, setBanks] = useState([]);
  const [loadingAccountName, setLoadingAccountName] = useState(false);
  const navigate = useNavigate();



  const handleAccountNumberChange = async (e) => {
  const value = e.target.value;
  setAccountNumber(value);
  // Only trigger lookup when account number is exactly 10 digits
  if (value.length === 10) {
    try {
      // Ensure a bank has been selected
      if (!bank) {
        setAccountName("Select a Bank First");
        return;
      }
      const token = localStorage.getItem("token"); // assuming protected endpoint

      setLoadingAccountName(true)
     try {
        const res = await axios.get(
        `${BASEURL}/api/transactions/verify-account/${bank}/${value}`,
          {
            params: {
              bankCode: bank,      // bank is the selected nipCode from dropdown
              accountNumber: value
            },
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
       // If successful, update the accountName from response
      setAccountName(res.data?.accountName || "Name not found");
     } catch (error) {
        console.log(error);  
     } finally {
      setLoadingAccountName(false)
     }
      
    
      
      
    } catch (error) {
      console.error("Account lookup error:", error);
      setAccountName("Could not verify account");
    }
  } else {
    setAccountName("");
  }
};


  //send button click
  const handleSend = () => {
    setShowPinModal(true);
  };



  const handlePinSubmit = async () => {
    setShowOverlay(true)
    const token = localStorage.getItem("token");
    try {
      setShowPinModal(false);
      // :white_check_mark: 1. Verify PIN
      const verifyRes = await axios.post(
        `${BASEURL}/api/transactions/verifyPin`,
        { pin }, // hashed comparison will be done in backend
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (verifyRes.data?.message !== "OK") {
        toast.error("Incorrect PIN");
        return;
      }
    // ✅ 2. Create CounterParty
    const counterPartyRes = await axios.post(
      `${BASEURL}/api/transactions/create-counterparty`,
      {
        bankCode: bank,
        accountName: accountName,
        accountNumber: accountNumber
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const counterPartyId = counterPartyRes.data?.data?.id;
    if (!counterPartyId) {
      toast.error("Could not create counterparty");
      return;
    }
    // :white_check_mark: 3. Initiate Transfer
    const transferRes = await axios.post(
      `${BASEURL}/api/transactions/initiate-transfer`,
      {
        amount,
        currency: "NGN",
        reason,
        counterPartyId
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    // toast.success("Transfer Successful!");
    setShowOverlay(false)
    setShowSuccessModal(true);
    console.log("Transfer Response:", transferRes.data);
  } catch (error) {
    // console.error("Verify PIN Error:", {
    //   status: error.response?.status,
    //   data: error.response?.data,
    //   message: error.message,
    // });
    // :white_check_mark: Show backend message if available
    const backendMessage = error.response?.data?.message;
    if (backendMessage) {
      toast.error(backendMessage); // <-- Shows "Incorrect PIN"
    } else {
      toast.error("Something went wrong");
    }
  }
};

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/quickpay/dashboard");
  };

  const fetchBanks = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASEURL}/api/transactions/banks`, {
      headers: {
        Authorization: `Bearer ${token}`, // if using auth
      },
    });
    console.log("Banks:", res.data.data);
    setBanks(res.data.data || [])
  } catch (error) {
    console.error(
      error.response?.data?.message || "Failed to load bank list"
    );
  }
};

useEffect(() => {
  const loadBanks = async () => {
    try {
      const res = await fetchBanks(); // your existing function
      // Anchor usually responds with { data: [...] }
      setBanks(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch banks:", error);
    }
  };
  loadBanks();
}, []);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Transfer Money
        </h2>
        {/* Bank Selection */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2 font-medium">
            Select Bank
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            >
            <option value="">-- Choose Bank --</option>
            {banks.map((b, index) => (
                <option key={index} value={b.attributes?.nipCode}>
                {b.attributes?.name}
                </option>
            ))}
            </select>
        </div>
        {/* Account Number */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2 font-medium">
            Account Number
          </label>
          <input
            type="number"
            maxLength={10}
            value={accountNumber}
            onChange={handleAccountNumberChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
            placeholder="Enter 10-digit account number"
          />
          {loadingAccountName ? (
            <p className="text-sm text-gray-500 mt-2 flex items-center">
              <svg
                className="animate-spin h-4 w-4 mr-2 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Checking account name...
              </p>
            ) : (
              accountName && (
          <p className="text-sm text-gray-500 mt-2">
            Account Name: <span className="font-medium">{accountName}</span>
          </p>
              )
            )}
            </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-2 font-medium">
            Amount (₦)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
            placeholder="Enter amount"
          />

          <label className="block text-gray-600 mt-4 mb-2 font-medium">
            Description
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4  py-2 focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
            placeholder="Enter Description"
          />
        </div>
        {/* Send Button */}
        <button
          onClick={handleSend}
          className="w-full bg-[#0046A5] hover:bg-[#00398D] text-white py-3 rounded-lg font-semibold shadow-md"
        >
          Send
        </button>
      </div>

      {/* Floating Q Button at Bottom */}
      <button
        onClick={() => navigate("/quickpay/dashboard")}
        className="fixed bottom-4 right-4 bg-[#0046A5] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-green-700 transition"
      >
        Q
      </button>
      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Enter Transaction PIN</h3>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0046A5] text-center tracking-widest"
              placeholder="****"
            />
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowPinModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePinSubmit}
                className="px-4 py-2 bg-[#00B86B] text-white rounded-lg hover:bg-[#00965A]"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Overlay while waiting */}
      {showOverlay && <LoadingOverlay />}

      {showSuccessModal && (
        <SuccessModal
          message="Transaction Successful!"
          onClose={handleModalClose}
        />
      )}

    </div>
  );
};
export default TransferTransaction;