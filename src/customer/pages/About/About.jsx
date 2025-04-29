import React from "react";
import { Link } from "react-router-dom";
const About = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              About KraftKart
            </h2>
            <p className="text-lg text-justify text-gray-600 mb-6">
              At KraftKart, we empower creativity by providing a seamless
              platform for customized product design. Whether it’s a
              personalized t-shirt, mug, or tote bag, we bring your ideas to
              life with high-quality craftsmanship
            </p>
            <p className="text-lg text-justify text-gray-600 mb-6">
              Our mission is to bridge innovation with personalization, allowing
              users to create unique, one-of-a-kind products effortlessly. With
              a vast selection of templates and design tools, we ensure everyone
              can express their style.
            </p>
            <Link to="/about">
            <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors">
              Learn More
            </button></Link>
          </div>
          <div className=" ml-5 mt-8 lg:mt-0 lg:w-1/2">
            <img
              src="./Aboutus.jpg"
              alt="About Us"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;