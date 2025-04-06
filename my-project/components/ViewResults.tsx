"use client";
import React from "react";
import { ResultType } from "@/lib/GlobalTypes";
import { X } from "lucide-react";

const ViewResults = ({
  results,
  viewResults,
  setViewResults,
}: {
  results: ResultType[];
  viewResults: boolean;
  setViewResults: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const StatItem = ({
    label,
    value,
    icon,
    className,
  }: {
    label: string;
    value: string | number;
    icon?: string;
    className?: string;
  }) => (
    <div className="flex items-center gap-2">
      {icon && <span className="text-sm">{icon}</span>}
      <div>
        <p className="text-xs sm:text-sm text-gray-500">{label}</p>
        <p
          className={`text-sm sm:text-base font-medium ${
            className || "text-gray-900"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );

  const MetricItem = ({ label, value }: { label: string; value: number }) => (
    <div className="flex justify-between text-sm sm:text-base">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value.toFixed(1)}</span>
    </div>
  );

  // Helper function for height conversion
  const cmToFeetInches = (cm: number) => {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };

  // Icons (import from your icon library)
  const ChartBarIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );

  const TrophyIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 14l9-5-9-5-9 5 9 5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
      />
    </svg>
  );
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-[#F2F4F7] z-[999] overflow-y-auto transition-all duration-300 ease-in-out 
        pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-[calc(env(safe-area-inset-top)+1.25rem)] sm:pt-0 sm:pb-0 ${
          viewResults
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        }`}
    >
      <div className="flex flex-col w-full h-full h-screen-safe">
        {/* Close Button */}
        <div className="flex justify-end m-3">
          <div className="p-1 transition duration-200 ease-in-out hover:bg-gray-300 rounded-full">
            <X
              className="text-gray-700 cursor-pointer text-[1.5rem] sm:text-[2rem]"
              onClick={() => setViewResults(false)}
            />
          </div>
        </div>

        <div className="flex-1 gap-3 overflow-y-auto">
          {/* Results List */}
          {results && results.length > 0 ? (
            results.map((result: ResultType, index: number) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 m-2"
              >
                <div className="p-4 sm:p-6">
                  {/* Header Section */}
                  <div className="mb-4 border-b pb-2">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                      {result.full_name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm sm:text-base font-medium text-gray-600">
                        {result.team}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        •
                      </span>
                      <span className="text-sm sm:text-base text-blue-600 font-medium">
                        {result.position}
                      </span>
                    </div>
                  </div>

                  {/* Key Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 h-auto">
                    <StatItem label="Age" value={result.age} icon="👤" />
                    <StatItem
                      label="Height"
                      value={`${cmToFeetInches(result.height)} (${
                        result.height
                      } cm)`}
                      icon="📏"
                    />
                    <StatItem
                      label="Salary"
                      value={result.salary}
                      icon="💰"
                      className="text-green-600"
                    />
                    <StatItem
                      label="Score"
                      value={result.score.toFixed(2)}
                      icon="⭐"
                      className="text-yellow-600"
                    />
                  </div>

                  {/* Performance Section */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <ChartBarIcon className="h-4 w-4" />
                      Performance Metrics
                    </h3>
                    <div className="space-y-1">
                      <MetricItem
                        label="Points"
                        value={result.average_points}
                      />
                      <MetricItem
                        label="Rebounds"
                        value={result.average_rebounds}
                      />
                      <MetricItem
                        label="Assists"
                        value={result.average_assists}
                      />
                      <MetricItem
                        label="Steals"
                        value={result.average_steals}
                      />
                      <MetricItem
                        label="Blocks"
                        value={result.average_blocks}
                      />
                    </div>
                  </div>

                  {/* Awards Section */}
                  {result.awards && (
                    <div className="mt-4">
                      <p className="text-sm sm:text-base text-gray-600 truncate">
                        <TrophyIcon className="h-4 w-4 inline-block mr-2 text-amber-500" />
                        {result.awards.split("; ").slice(0, 2).join(", ")}
                        {result.awards.split("; ").length > 2 && "..."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="w-full p-8 text-center">
              <p className="text-gray-500 text-lg sm:text-xl">
                No players found matching your criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewResults;
