import React from "react";
import { Typography } from "@mui/material";

const AddressCard = ({ address }) => {
  if (!address) {
    return (
      <Typography variant="body2" color="textSecondary">
        No address selected
      </Typography>
    );
  }

  return (
    <div className="address-card">
      <Typography variant="body1">
        {address.address_line1}
        {address.address_line2 && `, ${address.address_line2}`}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {address.city}, {address.state}, {address.postal_code}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {address.country}
      </Typography>
      {address.is_default && (
        <Typography variant="caption" color="primary">
          (Default)
        </Typography>
      )}
    </div>
  );
};

export default AddressCard;