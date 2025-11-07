'use client';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { Activities as Activity } from "../types/attendee-dashboard";
import { activitiesData} from '../data/activities-data';

// Define the filter types we'll use
type FilterType = 'All' | 'Workshop' | 'Activity';

export default function ActivitiesSection() {
  const [filter, setFilter] = useState<FilterType>('All');

  const filteredActivities = activitiesData.filter(activity => {
    if (filter === 'All') {
      return true;
    }
    return activity.type === filter;
  });

  // Helper function for styling the filter buttons
  const getButtonClass = (buttonFilter: FilterType) => {
    // Increased padding and rounded-3xl for bigger and rounder buttons
    const baseClass = "px-6 py-3 rounded-3xl font-mont font-medium transition-colors text-lg"; 
    if (filter === buttonFilter) {
      // Active button style - now yellow
      return `${baseClass} bg-[#FBF574] text-purple-900 shadow-md`; 
    }
    // Inactive button style - yellow outline, slightly darker background
    return `${baseClass} bg-[#FBF574]/20 text-[#FBF574] border border-[#FBF574] hover:bg-yellow-400/40`;
  };

  // Helper function for styling the activity/workshop "pills"
  const getPillClass = (type: Activity['type']) => {
    if (type === 'Workshop') {
      return "bg-purple-200 text-purple-800";
    }
    return "bg-green-200 text-green-800";
  };

  return (
    <section className="mx-auto px-4 py-12 w-full max-w-6xl font-mont"> {/* Set default font to mont */}
      <h2 className="drop-shadow-lg mb-12 font-bagel text-[#FBF574] text-6xl text-center"> {/* Yellow, bigger font-bagel */}
        Activities & Workshops
      </h2>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setFilter('All')}
          className={getButtonClass('All')}
        >
          All
        </button>
        <button
          onClick={() => setFilter('Workshop')}
          className={getButtonClass('Workshop')}
        >
          Workshops
        </button>
        <button
          onClick={() => setFilter('Activity')}
          className={getButtonClass('Activity')}
        >
          Activities
        </button>
      </div>

      {/* Activities Grid */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredActivities.map((activity, index) => (
          <div 
            key={index} 
            className="flex flex-col bg-purple-900/75 shadow-xl backdrop-blur-sm p-6 border border-purple-700 rounded-2xl text-white"
          >
            {/* Card Header */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="pr-2 font-semibold text-2xl"> {/* Font mont for titles within cards */}
                {activity.name}
              </h3>
              <span 
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${getPillClass(activity.type)}`}
              >
                {activity.type}
              </span>
            </div>

            {/* Card Body */}
            <p className="mb-4 text-purple-200 text-base"> {/* Font mont for description */}
              {activity.description}
            </p>
            
            {/* Card Footer (Details) */}
            <div className="space-y-2 mt-auto pt-4 border-purple-700 border-t text-sm">
              <p className="text-purple-300"> {/* Font mont for details */}
                <span className="font-medium text-purple-50">Time:</span> {activity.time}
              </p>
              <p className="text-purple-300">
                <span className="font-medium text-purple-50">Location:</span> {activity.location}
              </p>
              
              {activity.organizers && (
                <p className="text-purple-300">
                  <span className="font-medium text-purple-50">Organizers:</span> {activity.organizers}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Handle empty state */}
      {filteredActivities.length === 0 && (
        <p className="mt-8 font-mont text-purple-300 text-base text-center">
          No {filter === 'All' ? '' : filter.toLowerCase() + 's'} found.
        </p>
      )}
    </section>
  );
}