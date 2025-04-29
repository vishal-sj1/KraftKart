import React, { useState } from 'react';
import {mainCarouselData} from "./MainCarouselData";
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

export default function MainCarousel() {

    const [error, setError] = useState(false);
    const handleImageError = () => {
        setError(true);
    };

    const items = mainCarouselData.map((item, index) => (
        <img 
            key={index}
            className='cursor-pointer' 
            role='presentation' 
            src={item.image} 
            alt={`Carousel item ${index + 1}`}
            onError={handleImageError}
        />
    ));

    return (
        <div className='m-10'>
            {error && <p className="text-red-500">Error loading carousel images</p>}
            <AliceCarousel 
                items={items}
                autoPlay
                autoPlayInterval={1000}
                infinite
                disableButtonsControls
            />
        </div>
    );
}
