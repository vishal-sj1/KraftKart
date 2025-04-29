import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid as Grid2,
  Paper,
  TextField,
  Typography,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddressCard from "../AddressCard/AddressCard";
import axios from "axios";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_default: false,
  });

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
  });

  // Fetch user details from the database on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user?.userId) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`http://localhost:5000/api/validate-token`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const updatedUser = response.data.user;
          setFormData({
            name: updatedUser.name || "",
            email: updatedUser.email || "",
            phone: updatedUser.phone_number || "",
          });
        } catch (error) {
          console.error("Error fetching user details:", error.message);
        }
      }
    };
    fetchUserDetails();
  }, [user?.userId]);

  // Fetch addresses from the database on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      if (user?.userId) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`http://localhost:5000/api/addresses/${user.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAddresses(response.data);
        } catch (error) {
          console.error("Error fetching addresses:", error.message);
        }
      }
    };
    fetchAddresses();
  }, [user?.userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateUser = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `http://localhost:5000/api/user/${user.userId}`,
          {
            name: formData.name,
            email: formData.email,
            phone_number: formData.phone,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        login({ ...user, ...formData });
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating user:", error.message);
      }
    };
    updateUser();
  };

  const handleAddAddress = async () => {
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
          address_line1: newAddress.address_line1,
          address_line2: newAddress.address_line2,
          city: newAddress.city,
          state: newAddress.state,
          postal_code: newAddress.postal_code,
          country: newAddress.country,
          is_default: newAddress.is_default,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAddresses([...addresses, response.data.address]);
      setNewAddress({
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        is_default: false,
      });
      setIsAddressDialogOpen(false);
      alert("Address added successfully!");
    } catch (error) {
      console.error("Error adding address:", error.message);
      alert("Failed to add address");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl bg-[#F9F6F2]">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        className="mb-6 text-[#333333] font-bold"
      >
        My Profile
      </Typography>

      <Grid2 container spacing={4}>
        {/* Left Column - User Info */}
        <Grid2 item xs={12} md={8}>
          <Paper elevation={3} className="p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-6 mb-6">
              <Avatar
                sx={{
                  bgcolor: "#6D8299", // Slate blue for avatar
                  width: 80,
                  height: 80,
                  fontSize: "2rem",
                }}
                aria-label="User Avatar"
              >
                {user?.name?.charAt(0) || "U"}
              </Avatar>
              <div>
                <Typography variant="h5" component="h2" className="text-[#333333]">
                  {user?.name || "User"}
                </Typography>
                <Typography variant="body1" className="text-[#757575]">
                  {user?.email || "user@example.com"}
                </Typography>
              </div>
              {!isEditing && (
                <Button
                  variant="outlined"
                  color="primary"
                  className="ml-auto top-1"
                  onClick={() => setIsEditing(true)}
                  sx={{
                    borderColor: "#6D8299",
                    color: "#6D8299",
                    "&:hover": { borderColor: "#A3BFFA", color: "#A3BFFA" },
                  }}
                >
                  Edit Profile
                </Button>
              )}
            </div>

            <Divider className="my-6 border-[#E0E0E0]" />

            {isEditing ? (
              <form onSubmit={handleSubmit} className="mt-5">
                <Grid2 container spacing={3}>
                  <Grid2 item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      InputProps={{
                        sx: { backgroundColor: "#FFFFFF", borderRadius: 1 },
                      }}
                    />
                  </Grid2>
                  <Grid2 item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      type="email"
                      disabled
                      InputProps={{
                        sx: { backgroundColor: "#F5F5F5", borderRadius: 1 },
                      }}
                    />
                  </Grid2>
                  <Grid2 item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        sx: { backgroundColor: "#FFFFFF", borderRadius: 1 },
                      }}
                    />
                  </Grid2>
                  <Grid2 item xs={12} className="flex justify-end gap-3 mt-4">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setIsEditing(false)}
                      sx={{
                        borderColor: "#757575",
                        color: "#757575",
                        "&:hover": { borderColor: "#A3BFFA", color: "#A3BFFA" },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{ backgroundColor: "#6D8299", "&:hover": { backgroundColor: "#A3BFFA" } }}
                    >
                      Save Changes
                    </Button>
                  </Grid2>
                </Grid2>
              </form>
            ) : (
              <Box className="mt-2">
                <Grid2 container spacing={3}>
                  <Grid2 item xs={12} sm={6}>
                    <Typography variant="subtitle1" className="text-[#757575]">
                      Full Name
                    </Typography>
                    <Typography variant="body1" className="text-[#333333]">
                      {formData.name || "Not provided"}
                    </Typography>
                  </Grid2>
                  <Grid2 item xs={12} sm={6}>
                    <Typography variant="subtitle1" className="text-[#757575]">
                      Email Address
                    </Typography>
                    <Typography variant="body1" className="text-[#333333]">
                      {formData.email || "Not provided"}
                    </Typography>
                  </Grid2>
                  <Grid2 item xs={12} sm={6}>
                    <Typography variant="subtitle1" className="text-[#757575]">
                      Phone Number
                    </Typography>
                    <Typography variant="body1" className="text-[#333333]">
                      {formData.phone || "Not provided"}
                    </Typography>
                  </Grid2>
                </Grid2>
              </Box>
            )}
          </Paper>
        </Grid2>

        {/* Right Column - Saved Addresses */}
        <Grid2 item xs={12} md={4}>
          <Paper elevation={3} className="p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h6" component="h3" className="text-[#333333]">
                Saved Addresses
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsAddressDialogOpen(true)}
                sx={{
                  borderColor: "#6D8299",
                  color: "#6D8299",
                  "&:hover": { borderColor: "#A3BFFA", color: "#A3BFFA" },
                }}
              >
                Add New
              </Button>
            </div>
            <Divider className="mb-6 border-[#E0E0E0]" />
            <div className="space-y-6">
              {addresses.length === 0 ? (
                <Typography
                  variant="body1"
                  className="text-[#757575] text-center py-4"
                >
                  No addresses saved yet
                </Typography>
              ) : (
                addresses.map((address, index) => (
                  <div key={address.address_id}>
                    <AddressCard address={address} />
                    {index < addresses.length - 1 && <Divider className="my-6 border-[#E0E0E0]" />}
                  </div>
                ))
              )}
            </div>
          </Paper>
        </Grid2>
      </Grid2>

      {/* Add Address Dialog */}
      <Dialog
        open={isAddressDialogOpen}
        onClose={() => setIsAddressDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { backgroundColor: "#FFFFFF" } }}
      >
        <DialogTitle className="text-[#333333]">Add New Address</DialogTitle>
        <DialogContent>
          <Grid2 container spacing={2} className="pt-4">
            <Grid2 item xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                name="address_line1"
                value={newAddress.address_line1}
                onChange={handleAddressChange}
                required
                variant="outlined"
                InputProps={{
                  sx: { backgroundColor: "#FFFFFF", borderRadius: 1 },
                }}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2"
                name="address_line2"
                value={newAddress.address_line2}
                onChange={handleAddressChange}
                variant="outlined"
                InputProps={{
                  sx: { backgroundColor: "#FFFFFF", borderRadius: 1 },
                }}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={newAddress.city}
                onChange={handleAddressChange}
                required
                variant="outlined"
                InputProps={{
                  sx: { backgroundColor: "#FFFFFF", borderRadius: 1 },
                }}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={newAddress.state}
                onChange={handleAddressChange}
                required
                variant="outlined"
                InputProps={{
                  sx: { backgroundColor: "#FFFFFF", borderRadius: 1 },
                }}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                name="postal_code"
                value={newAddress.postal_code}
                onChange={handleAddressChange}
                required
                variant="outlined"
                InputProps={{
                  sx: { backgroundColor: "#FFFFFF", borderRadius: 1 },
                }}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={newAddress.country}
                onChange={handleAddressChange}
                required
                variant="outlined"
                InputProps={{
                  sx: { backgroundColor: "#FFFFFF", borderRadius: 1 },
                }}
              />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsAddressDialogOpen(false)}
            sx={{ color: "#757575", "&:hover": { color: "#A3BFFA" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddAddress}
            variant="contained"
            sx={{ backgroundColor: "#6D8299", "&:hover": { backgroundColor: "#A3BFFA" } }}
          >
            Add Address
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfilePage;