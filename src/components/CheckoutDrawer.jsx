/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */


import axios from "axios"
import React from "react";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";

const API = "https://quickinvoice-backend-1.onrender.com";

const nigerianStates = [
  "Abia",
  "Federal Capital Territory",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara"
];


const CheckoutDrawer = ({
  isOpen,
  onClose,
  vendor,
  vendorId,
  cartItems,
  initialCheckoutData = {},
  onInitiatePayment // function(deliveryFee:number, courier:object, checkoutData:object)
}) => {
  const [checkoutData, setCheckoutData] = React.useState({
    name: initialCheckoutData.name || "",
    phone: initialCheckoutData.phone || "",
    email: initialCheckoutData.email || "",

    street: "",
    city:  "",
    state: "",
    country:  "Nigeria",

    address: initialCheckoutData.address || "",
    deliveryType: initialCheckoutData.deliveryType || "regular", // ui-level only
  });
  // Weight in KG (user-editable). Default: 1kg per item (fallback).
  const defaultWeight = React.useMemo(() => {
    if (!cartItems || cartItems.length === 0) return 1;
    const sum = cartItems.reduce((s, it) => s + (Number(it.weightKg) || 1), 0); // if product has weightKg
    // fallback to 1kg each if not present
    return sum || cartItems.length;
  }, [cartItems]);
  const [loading, setLoading] = React.useState(false);
  const [weightKg, setWeightKg] = React.useState(defaultWeight);
  const [lengthCm, setLengthCm] = React.useState(20); // default dims
  const [widthCm, setWidthCm] = React.useState(15);
  const [heightCm, setHeightCm] = React.useState(10);
  const [couriers, setCouriers] = React.useState([]); // fetched courier options
  const [loadingCouriers, setLoadingCouriers] = React.useState(false);
  const [selectedCourier, setSelectedCourier] = React.useState(null);
  const [deliveryFee, setDeliveryFee] = React.useState(0);

  const [isLoadingFee, setIsLoadingFee] = React.useState(false);

  const [senderCode, setSenderCode] = useState(null);
  const [receiverCode, setReceiverCode] = useState(null);

  const [shippingCourier, setShippingCourier] = useState(null);
  const [vendorAddress, setVendorAddress] = useState(null);


  const getVendorAddress = async () => {
  try {
    const res = await fetch(`${API}/api/logistics/vendor-address`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendorId })
    });
    const data = await res.json();
    setVendorAddress(data.data.state);
    return data;
  } catch (error) {
    console.log("Error getting vendor Address ", error);
    return { success: false, error: error.message };
  }
};

  useEffect(()=>{
    getVendorAddress()
  })

   const validateVendor = async () => {
      try {
        const res = await fetch(`${API}/api/logistics/validate-vendor-address`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendorId,           // you already said: vendorId = userId of the store owner
            cartItems           // the items being purchased
          })
        });
        const data = await res.json();
        setSenderCode(data.senderAddressCode); // { valid: true/false, message: "" }
        return data; // { valid: true/false, message: "" }
      } catch (error) {
        console.error("Vendor validation error:", error);
        return { valid: false, message: "Network error" };
      }
    };

    
    const validateCustomer = async () => {
      try {
        const res = await fetch(`${API}/api/logistics/validate-customer-address`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: checkoutData.name,
            email: checkoutData.email,
            phone: checkoutData.phone,
            address: checkoutData.address
          })
        });
        const data = await res.json();
        setReceiverCode(data.receiverAddressCode)
        return data; // { valid: true/false, message: "" }
      } catch (error) {
        console.error("Customer validation error:", error);
        return { valid: false, message: "Network error" };
      }
    };

    //automatically compose the values
    useEffect(()=> {
      const {street, city , state, country} = checkoutData;
      const fullAddress = [street, city, state, country].filter(Boolean).join(", ");
      setCheckoutData(prev => ({
        ...prev, address: fullAddress
      }));
    },[checkoutData.street, checkoutData.city, checkoutData.state, checkoutData.country])

  const hasValidateVendor = useRef(false)
  useEffect(()=>{
     if(!hasValidateVendor.current && isOpen && vendorId){
      hasValidateVendor.current = true;
      validateVendor()
     }
  }, [isOpen, vendorId])
  

  // 🔥 Step 2: Validate customer address as they type
  // useEffect(() => {
  //   if (checkoutData.state.trim().length > 0) {
  //     validateCustomer();
  //   }
  // }, [checkoutData.address]);
  const hasValidatedCustomer = useRef(false)
  useEffect(()=>{
    const state = checkoutData.state?.trim();

    if(!hasValidatedCustomer.current && state && checkoutData.street?.trim() && checkoutData.city?.trim()){
      hasValidatedCustomer.current = true;
      validateCustomer()
    }
  }, [checkoutData.state, checkoutData.street, checkoutData.city])

  // Step 3: When both address codes are ready → auto fetch couriers
  useEffect(() => {
    if (senderCode && receiverCode) {
      fetchCouriers();
    }
  }, [senderCode, receiverCode]);



  const handleSelectCourier = async (courier) => {
  try {
    toast.success(`${courier.name} selected`);
    setIsLoadingFee(true);
    setSelectedCourier(courier)

    const serviceCode = courier?.service; // required param
    if (!serviceCode) return;
    // Auto-generate pickup date (4 days from now)
    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() + 4);
    // Hardcoded optimal fallback package items
    const packageItems = [
      {
        name:  cartItems[0]?.name || "Item",
        description: cartItems[0]?.name || "Package",
        unit_weight: 1,
        unit_amount: grandTotal,
        quantity: 1,
      }
    ];
    // Hardcoded dimensions (small parcel)
    const packageDimension = {
      length: 10,
      width: 10,
      height: 10
    };
    const payload = {
      sender_address_code: senderCode,
      reciever_address_code: receiverCode,
      pickup_date: pickupDate.toISOString().split("T")[0],
      category_id: cartItems[0].shipping_category_id,
      package_items: packageItems,
      package_dimension: packageDimension,
      service_type: "pickup",
      delivery_instructions: "Handle with care"
    };
    const res = await axios.post(
      `${API}/api/logistics/selected-courier-rate/${serviceCode}`,
      payload
    );
    console.log("courier Data : ",res)
    // Extract delivery fee from response
    
    setShippingCourier(res.data?.data || null)
    
    const fee = res.data?.data?.couriers?.[0]?.total || 0;
    setDeliveryFee(fee);
  } catch (error) {
    console.log("Error fetching selected courier rates:", error.response?.data || error);
  } finally {
    setIsLoadingFee(false);
  }
};


const createShipment = async (orderId) => {
  try {
    const payload = {
      request_token: shippingCourier.request_token,
      service_code: shippingCourier.couriers[0].service_code,
      courier_id: shippingCourier.couriers[0].courier_id,
      orderId: orderId
    };
    console.log(payload);
    
    const response = await fetch(`${API}/api/logistics/create-shipment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),   // 
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Shipment creation failed");
    }
    console.log("shipment successfully created :", data);
    
    return data;
  } catch (error) {
    console.error("Create Shipment Error:", error);
    throw error;
  }
};


  // If vendor has pickup address in DB, show it & let vendor override later
  const pickupAddress = vendor?.pickupAddress || vendor?.address || `${vendor?.businessName || vendor?.name || ""}`;
  // Build payload for ship rates
  const buildRatePayload = () => ({
    pickup: {
      address: pickupAddress,
      // you can include coordinates if available: lat/lng
    },
    dropoff: {
      address: checkoutData.address,
    },
    // ShipBubble expects package attributes: weight (kg), dimensions (cm), contents value etc
    package: {
      weight_kg: Number(weightKg) || 1,
      dimensions_cm: {
        length: Number(lengthCm) || 20,
        width: Number(widthCm) || 15,
        height: Number(heightCm) || 10,
      },
      // optional: declared_value
      declared_value: Math.round(
        cartItems.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0)
      ),
      // optional: package category or fragile boolean
      category: "general",
    },
    // optional: currency or other buyer details
    currency: "NGN",
  });
  
  // };


const fetchCouriers = async () => {
  try {
    setLoadingCouriers(true);
    const res = await axios.get(`${API}/api/logistics/couriers`);
    // Top level
    const outer = res.data;
    if (outer.status === "success") {
      // inner object
      const inner = outer.data;
      if (inner.status === "success" && Array.isArray(inner.data)) {
        const mapped = inner.data.map((item) => ({
          name: item.name,
          pin_image: item.pin_image,
          id: item.service_code || item.name,
          service: item.service_code,
        }));
        setCouriers(mapped);
      } else {
        setCouriers([]);
      }
    } else {
      setCouriers([]);
    }
  } catch (err) {
    console.error("Fetch couriers error:", err);
    setCouriers([]);
  } finally {
    setLoadingCouriers(false);
  }
};


  // Trigger fetch when address or weight changes (debounced lightly)
  React.useEffect(() => {
    // small debounce
    const t = setTimeout(() => {
      if (checkoutData.address) fetchCouriers();
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutData.address, weightKg, lengthCm, widthCm, heightCm]);
  const cartSubtotal = React.useMemo(
    () =>
      cartItems.reduce(
        (acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 1),
        0
      ),
    [cartItems]
  );
  const grandTotal = cartSubtotal + (Number(deliveryFee) || 0);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="w-full sm:w-[420px] bg-white h-full p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Checkout Details</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="space-y-4 flex-1 overflow-y-auto">
          <div className="bg-gray-50 p-2 rounded">{pickupAddress}</div>
          <input
            type="text"
            placeholder="Full Name"
            value={checkoutData.name}
            onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B86B]"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={checkoutData.phone}
            onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B86B]"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={checkoutData.email}
            onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B86B]"
          />
          <label className="block text-gray-700 text-sm font-medium mb-1">
              Buyer Address
            </label>
          {/* <textarea
            placeholder="Delivery Address. Please follow this format and be very detailed(Street, City, State, Country)"
            value={checkoutData.address}
            onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B86B] resize-none"
            rows="3"
          /> */}
          <input
            type="text"
            placeholder="Street address"
            value={checkoutData.street}
            onChange={(e)=> setCheckoutData({...checkoutData, street: e.target.value})}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B86B]"
          />
          <input
            type="text"
            placeholder="City"
            value={checkoutData.city}
            onChange={(e)=> setCheckoutData({...checkoutData, city: e.target.value})}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B86B]"
          />
          {/* <input
            type="text"
            placeholder="State"
            value={checkoutData.state}
            onChange={(e)=> setCheckoutData({...checkoutData, state: e.target.value})}
            onBlur={validateCustomer}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B86B]"
          /> */}
          <select
            value={checkoutData.state}
            onChange={(e) =>
              setCheckoutData({ ...checkoutData, state: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B86B]"
          >
            <option value="">Select State</option>
            {nigerianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <input
            type="text"
            value="Nigeria"
            disabled
            className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-700"
          />

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Vendor Location
            </label>
            <input
              type="text"
              value={vendorAddress || ""}
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 leading-relaxed">
                <strong>Note:</strong> 
                If you're in the <strong>same state</strong> as the vendor, it is advised to choose 
                <strong className="text-blue-900"> Kwik</strong> courier service. 
                If you're <strong>not in the same state</strong>, choose either 
                <strong className="text-blue-900"> GIGL</strong> or 
                <strong className="text-blue-900"> Fez Delivery</strong>. 
                <p>
                    For food deliveries, always choose <strong className="text-blue-900">Chowdeck or Glovo</strong>.
                </p>
                <br /><br />
                After choosing a courier, please wait for the delivery fee to update before proceeding to payment.
            </p>
            </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Courier options</h3>
              <button
                onClick={fetchCouriers}
                className="text-sm text-[#0046A5] hover:underline"
              >
                Refresh
              </button>
            </div>
            {loadingCouriers ? (
            <div className="text-sm text-gray-500">Loading couriers…</div>
          ) : couriers.length === 0 && !selectedCourier ? (
            <div className="text-sm text-gray-500">No courier options yet. Enter address to fetch.</div>
          ) : selectedCourier ? (
            // SHOW ONLY SELECTED COURIER
            <div className="p-2 rounded border border-[#0046A5] bg-[#F0F7FF] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src={selectedCourier.pin_image} alt={selectedCourier.name} className="w-10 h-10 object-contain" />
                <div className="font-medium">{selectedCourier.name}</div>
              </div>
              <div className="text-right text-sm text-gray-500">{selectedCourier.service}</div>
            </div>
          ) : (
            // SHOW LIST (before selection)
            <div className="space-y-2">
              {couriers.map((c) => (
                <div
                  key={c.id}
                  className={`p-2 rounded border ${
                    selectedCourier?.id === c.id ? "border-[#0046A5] bg-[#F0F7FF]" : "border-gray-200"
                  } flex justify-between items-center cursor-pointer`}
                  onClick={() => handleSelectCourier(c)}
                >
                  <div className="flex items-center gap-3">
                    <img src={c.pin_image} alt={c.name} className="w-10 h-10 object-contain" />
                    <div className="font-medium">{c.name}</div>
                  </div>
                  <div className="text-right text-sm text-gray-500">{c.service}</div>
                </div>
              ))}
            </div>
          )}
          </div>
          {/* Totals */}
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <div className="text-sm text-gray-600">Subtotal</div>
              <div className="font-semibold">₦{cartSubtotal.toLocaleString()}</div>
            </div>
            <div className="flex justify-between mt-1">
              <div className="text-sm text-gray-600">Delivery Fee</div>
              <div className="font-semibold">₦{(Number(deliveryFee) || 0).toLocaleString()}</div>
            </div>
            <div className="flex justify-between mt-2 text-lg font-bold">
              <div>Total</div>
              <div className="text-[#00B86B]">₦{(grandTotal).toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() =>onInitiatePayment(deliveryFee,selectedCourier, checkoutData, setLoading, createShipment)}
            className={`w-full py-3 rounded-lg text-white font-semibold ${cartItems.length === 0 ? "bg-gray-400" : "bg-[#00B86B] hover:bg-[#009C5E]"}`}
            disabled={cartItems.length === 0}
          >
            {loading ? "Processing..." : `Pay ₦${grandTotal.toLocaleString()}`}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 mt-3 rounded-lg border text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


export default CheckoutDrawer;












