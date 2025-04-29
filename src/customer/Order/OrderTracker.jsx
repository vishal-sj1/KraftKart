import { Step, StepLabel, Stepper } from "@mui/material";
import React from "react";

const steps = [
  "Placed",
  "Order Confirmed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
];

const statusToStep = {
  placed: 0,
  order_confirmed: 1,
  shipped: 2,
  out_for_delivery: 3,
  delivered: 4,
  cancelled: 0, // Stays at "Placed" until admin updates
};

const OrderTracker = ({ status }) => {
  const activeStep = statusToStep[status] || 0;

  return (
    <div className="w-full">
      <Stepper activeStep={activeStep} sx={{ "& .MuiStepLabel-root .Mui-active": { color: "#38A3A5" }, "& .MuiStepLabel-root .Mui-completed": { color: "#38A3A5" }, "& .MuiStepLabel-root": { color: "#CBD5E1" } }}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel sx={{ fontSize: "14px" }}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {status === "cancelled" && (
        <p className="text-[#EF4444] mt-2 text-center">Order Cancelled</p>
      )}
    </div>
  );
};

export default OrderTracker;