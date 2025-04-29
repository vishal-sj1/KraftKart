import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";
import DeliveryAddressForm from "./DeliveryAddressForm";
import OrderSummary from "./OrderSummary";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";

const steps = ["Login", "Delivery Address", "Order Summary", "Payment", "Order Placed"];

const StyledModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: 24,
  padding: theme.spacing(4),
  textAlign: "center",
}));

export default function CheckOut() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedAddress, setSelectedAddress] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const querySearch = new URLSearchParams(location.search);
  const step = parseInt(querySearch.get("step")) || 0;

  React.useEffect(() => {
    setActiveStep(step);
  }, [step]);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    navigate(`/checkout?step=${activeStep - 1}`);
  };

  const handleNext = async () => {
    if (activeStep === 1) {
      if (!selectedAddress) {
        alert("Please select or add a delivery address.");
        return;
      }
    }

    if (activeStep === 2) {
      if (!user) {
        navigate("/login");
        return;
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      navigate(`/checkout?step=${activeStep + 1}`);
    } else if (activeStep === 3) {
      await handlePayment();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      navigate(`/checkout?step=${activeStep + 1}`);
    }
  };

  const handleAddressSubmit = (address) => {
    setSelectedAddress(address);
    handleNext();
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      if (!selectedAddress || !selectedAddress.address_id) {
        throw new Error("No delivery address selected");
      }

      const cartResponse = await axios.get(
        `http://localhost:5000/api/cart/${user.userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const cartItems = cartResponse.data.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: parseFloat(item.discounted_price) || 0,
        customId: item.custom_id,
        size: item.size,
      }));

      if (!cartItems.length) {
        alert("Cart is empty");
        return;
      }

      const paymentResponse = await axios.post(
        "http://localhost:5000/api/payment/orders",
        { userId: user.userId, addressId: selectedAddress.address_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { orderId, totalAmount, currency, items } = paymentResponse.data;

      console.log("Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency,
        order_id: orderId,
        name: "KraftKart",
        description: "Order Payment",
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

          const verifyResponse = await axios.post(
            "http://localhost:5000/api/payment/verify",
            {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              userId: user.userId,
              addressId: selectedAddress.address_id,
              items,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verifyResponse.data.success) {
            setActiveStep(4);
            navigate(`/checkout?step=4`);
            setOpenModal(true);
          } else {
            alert("Payment verification failed: " + verifyResponse.data.message);
          }
        },
        theme: { color: "#3B82F6" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      alert("Payment failed! " + (error.response?.data?.message || error.message));
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate("/orders");
  };

  return (
    <div className="px-10 lg:px-20 bg-[#F9FBFD]">
      <Box sx={{ width: "100%", bgcolor: "#F9FBFD", py: 6 }}>
        <Stepper
          activeStep={activeStep}
          sx={{
            "& .MuiStepLabel-label": { color: "#718096" },
            "& .MuiStepLabel-label.Mui-active": { color: "#3B82F6" },
            "& .MuiStepLabel-label.Mui-completed": { color: "#22C55E" },
            "& .MuiStepIcon-root": { color: "#CBD5E0" },
            "& .MuiStepIcon-root.Mui-active": { color: "#3B82F6" },
            "& .MuiStepIcon-root.Mui-completed": { color: "#22C55E" },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length ? (
          <Typography sx={{ mt: 2, mb: 1, color: "#1A202C", fontWeight: "bold" }}>
            Unexpected error: Step out of bounds
          </Typography>
        ) : (
          <React.Fragment>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 4 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{
                  mr: 1,
                  color: "#718096",
                  "&:hover": { bgcolor: "#E6F0FA", color: "#1A202C" },
                }}
              >
                Back
              </Button>
              {activeStep === 2 && (
                <Button
                  onClick={handleNext}
                  sx={{
                    bgcolor: "#3B82F6",
                    color: "white",
                    "&:hover": { bgcolor: "#93C5FD", color: "#1A202C" },
                  }}
                >
                  Place Order
                </Button>
              )}
              {activeStep === 3 && (
                <Button
                  onClick={handlePayment}
                  sx={{
                    bgcolor: "#22C55E",
                    color: "white",
                    "&:hover": { bgcolor: "#A7F3D0", color: "#1A202C" },
                  }}
                >
                  Pay Now
                </Button>
              )}
            </Box>
            <div className="mt-10">
              {activeStep === 1 ? (
                <DeliveryAddressForm onSubmit={handleAddressSubmit} />
              ) : activeStep === 2 ? (
                <OrderSummary selectedAddress={selectedAddress} />
              ) : activeStep === 3 ? (
                <Typography sx={{ mt: 2, mb: 1, color: "#1A202C" }}>
                  Please complete the payment to place your order.
                </Typography>
              ) : activeStep === 4 ? (
                <Modal open={openModal} onClose={handleCloseModal}>
                  <StyledModalBox>
                    <Typography variant="h6" sx={{ color: "#1A202C", fontWeight: "bold" }}>
                      Payment Completed
                    </Typography>
                    <Typography sx={{ mt: 2, color: "#718096" }}>
                      Your order has been successfully placed!
                    </Typography>
                    <Button
                      onClick={handleCloseModal}
                      sx={{
                        mt: 3,
                        bgcolor: "#22C55E",
                        color: "white",
                        "&:hover": { bgcolor: "#A7F3D0", color: "#1A202C" },
                      }}
                    >
                      Go to Orders
                    </Button>
                  </StyledModalBox>
                </Modal>
              ) : null}
            </div>
          </React.Fragment>
        )}
      </Box>
    </div>
  );
}