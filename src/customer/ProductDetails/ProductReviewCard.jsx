import { Avatar, Box, Grid2, Rating } from '@mui/material'
import React from 'react'

const ProductReviewCard = () => {
  return (
    <div>
        <Grid2 container spacing={2} gap={3}>
            <Grid2 item xs={1}>
                <Box>
                    <Avatar className='text-white' sx={{width:56, height:56, bgcolor:"#5A9E9F"}}>
                        V
                    </Avatar>
                </Box>
            </Grid2>
            <Grid2 item xs={9}>
                <div className="space-y-2">
                    <div>
                        <p className='font-semibold text-lg text-[#2D2D2D]'>Vick</p>
                        <p className='opacity-60 text-[#8A8A8A]'>Jan 20, 2025</p>
                    </div>
                </div>

                <Rating
                  name="half-rating"
                  value={4.5}
                  readOnly
                  precision={0.5}
                  sx={{ color: "#E8B923" }} // Golden yellow for stars
                />
                <p className='text-[#2D2D2D]'>This product is comfortable, fits perfectly, and is made of high-quality materials</p>
            </Grid2>
        </Grid2>
    </div>
  )
}

export default ProductReviewCard;