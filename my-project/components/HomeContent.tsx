"use client";
import React from "react";
import { useState } from "react";
import ReviewForm from "./ReviewForm";
import GuessYourLegend from "./GuessYourLegend";

const HomeContent = () => {
  const [page, setPage] = useState("form");

  const handlePageChange = (newPage: string) => {
    setPage(newPage);
  };

  return (
    <div className="flex flex-col w-full h-full gap-3">
      <div className="flex items-center justify-between transition duration-200 ease-in-out w-full h-[60px] sm:h-[100px] text-md sm:text-lg text-black">
        <button
          onClick={() => handlePageChange("form")}
          className={`flex w-full h-full items-center justify-center transition duration-200 ease-in-out hover:bg-gray-300 active:bg-gray-300 ${
            page === "form" ? "bg-gray-100" : ""
          }`}
        >
          Find your Legend
        </button>
        <button
          onClick={() => handlePageChange("guess")}
          className={`flex w-full h-full items-center justify-center transition duration-200 ease-in-out hover:bg-gray-300 active:bg-gray-300 ${
            page === "guess" ? "bg-gray-100" : ""
          }`}
        >
          Guess your legend
        </button>
      </div>
      <div className="flex items-center justify-center w-full h-full">
        {page === "form" ? <ReviewForm /> : <GuessYourLegend />}
      </div>
    </div>
  );
};

export default HomeContent;
