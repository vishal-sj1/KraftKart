import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Radio, RadioGroup, FormControlLabel, Typography } from "@mui/material";
import AddressCard from "../AddressCard/AddressCard";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeliveryAddressForm = ({ onSubmit }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [formData, setFormData] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_default: false,
  });

  // Fetch addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      if (user?.userId) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`http://localhost:5000/api/addresses/${user.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAddresses(response.data);
          // Set the default address as selected, if any
          const defaultAddress = response.data.find((addr) => addr.is_default);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.address_id);
          }
        } catch (err) {
          console.error("Error fetching addresses:", err);
        }
      }
    };
    fetchAddresses();
  }, [user?.userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e) => {
    setSelectedAddressId(parseInt(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/addresses",
        {
          userId: user.userId,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          is_default: formData.is_default,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newAddress = response.data.address;
      setAddresses([...addresses, newAddress]);
      setSelectedAddressId(newAddress.address_id);
      alert("Address added successfully!");
      setFormData({
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        is_default: false,
      });
    } catch (err) {
      console.error("Error adding address:", err.response?.data || err.message);
      alert("Failed to add address: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeliverHere = () => {
    const selectedAddress = addresses.find((addr) => addr.address_id === selectedAddressId);
    if (selectedAddress) {
      onSubmit(selectedAddress);
    } else {
      alert("Please select an address or add a new one.");
    }
  };

  return (
    <div className="px-4 sm:px-8 lg:px-16 mt-4 mb-3 bg-[#F9FBFD]">
      <div className="flex flex-grow gap-4 sm:flex-col lg:flex-row">
        {/* Left Section - Address Selection */}
        <div className="w-full lg:w-4/12 border border-[#CBD5E0] rounded-md shadow-md bg-white p-5 max-h-[30rem] overflow-y-auto hover:bg-[#E6F0FA] transition-colors">
          <div className="border-b border-[#CBD5E0] pb-5">
            <Typography variant="h6" className="text-[#1A202C]" gutterBottom>
              Select Delivery Address
            </Typography>
            {addresses.length === 0 ? (
              <Typography variant="body2" className="text-[#718096]">
                No addresses saved yet. Add a new address below.
              </Typography>
            ) : (
              <RadioGroup value={selectedAddressId} onChange={handleRadioChange}>
                {addresses.map((addr) => (
                  <div key={addr.address_id} className="mb-4">
                    <FormControlLabel
                      value={addr.address_id}
                      control={<Radio sx={{ color: "#718096", "&.Mui-checked": { color: "#3B82F6" } }} />}
                      label={<AddressCard address={addr} />}
                    />
                  </div>
                ))}
              </RadioGroup>
            )}
            <Button
              sx={{
                mt: 2,
                bgcolor: "#3B82F6",
                width: "100%",
                color: "white",
                "&:hover": { bgcolor: "#93C5FD", color: "#1A202C" },
              }}
              size="large"
              variant="contained"
              disabled={!selectedAddressId}
              onClick={handleDeliverHere}
            >
              Deliver Here
            </Button>
          </div>
        </div>
        {/* Right Section - Address Form */}
        <div className="w-full lg:w-8/12">
          <div className="border border-[#CBD5E0] rounded-md shadow-md p-6 bg-white hover:bg-[#E6F0FA] transition-colors">
            <Typography variant="h6" className="text-[#1A202C]" gutterBottom>
              Add New Address
            </Typography>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <TextField
                    required
                    id="address_line1"
                    name="address_line1"
                    label="Address Line 1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                      "& .MuiInputLabel-root": { color: "#718096" },
                      "& .MuiInputBase-input": { color: "#1A202C" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#CBD5E0" },
                        "&:hover fieldset": { borderColor: "#3B82F6" },
                        "&.Mui-focused fieldset": { borderColor: "#3B82F6" },
                      },
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <TextField
                    id="address_line2"
                    name="address_line2"
                    label="Address Line 2"
                    value={formData.address_line2}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                      "& .MuiInputLabel-root": { color: "#718096" },
                      "& .MuiInputBase-input": { color: "#1A202C" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#CBD5E0" },
                        "&:hover fieldset": { borderColor: "#3B82F6" },
                        "&.Mui-focused fieldset": { borderColor: "#3B82F6" },
                      },
                    }}
                  />
                </div>
                <div>
                  <TextField
                    required
                    id="city"
                    name="city"
                    label="City"
                    value={formData.city}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                      "& .MuiInputLabel-root": { color: "#718096" },
                      "& .MuiInputBase-input": { color: "#1A202C" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#CBD5E0" },
                        "&:hover fieldset": { borderColor: "#3B82F6" },
                        "&.Mui-focused fieldset": { borderColor: "#3B82F6" },
                      },
                    }}
                  />
                </div>
                <div>
                  <TextField
                    required
                    id="state"
                    name="state"
                    label="State / Province / Region"
                    value={formData.state}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                      "& .MuiInputLabel-root": { color: "#718096" },
                      "& .MuiInputBase-input": { color: "#1A202C" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#CBD5E0" },
                        "&:hover fieldset": { borderColor: "#3B82F6" },
                        "&.Mui-focused fieldset": { borderColor: "#3B82F6" },
                      },
                    }}
                  />
                </div>
                <div>
                  <TextField
                    required
                    id="postal_code"
                    name="postal_code"
                    label="Zip / Postal Code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                      "& .MuiInputLabel-root": { color: "#718096" },
                      "& .MuiInputBase-input": { color: "#1A202C" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#CBD5E0" },
                        "&:hover fieldset": { borderColor: "#3B82F6" },
                        "&.Mui-focused fieldset": { borderColor: "#3B82F6" },
                      },
                    }}
                  />
                </div>
                <div>
                  <TextField
                    required
                    id="country"
                    name="country"
                    label="Country"
                    value={formData.country}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                      "& .MuiInputLabel-root": { color: "#718096" },
                      "& .MuiInputBase-input": { color: "#1A202C" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#CBD5E0" },
                        "&:hover fieldset": { borderColor: "#3B82F6" },
                        "&.Mui-focused fieldset": { borderColor: "#3B82F6" },
                      },
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FormControlLabel
                    control={
                      <Radio
                        checked={formData.is_default}
                        onChange={(e) =>
                          setFormData({ ...formData, is_default: e.target.checked })
                        }
                        sx={{ color: "#718096", "&.Mui-checked": { color: "#3B82F6" } }}
                      />
                    }
                    label="Set as default address"
                    sx={{ color: "#1A202C" }}
                  />
                </div>
                <div className="sm:col-span-2 text-center">
                  <Button
                    type="submit"
                    sx={{
                      mt: 2,
                      bgcolor: "#3B82F6",
                      width: "50%",
                      color: "white",
                      "&:hover": { bgcolor: "#93C5FD", color: "#1A202C" },
                    }}
                    size="large"
                    variant="contained"
                  >
                    Add Address
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddressForm;