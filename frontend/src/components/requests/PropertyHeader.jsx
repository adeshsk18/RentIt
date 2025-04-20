import { Circle, Home, IndianRupee, MapPin } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

import { getStatusColor } from "../../constanst";

const PropertyHeader = ({ request }) => {
  const { _id, title, rent, propertyType, location } = request.propertyId;
  const { status } = request;
  const details = [
    {
      icon: <Home className="h-5 w-5 text-gray-500" />,
      label: "Title",
      value: title,
    },
    {
      icon: <Circle className={`h-5 w-5 ${getStatusColor(status)}`} />,
      label: "Status",
      value: status,
    },
    {
      icon: <IndianRupee className="h-5 w-5 text-gray-500" />,
      label: "Rent",
      value: `₹${rent.toLocaleString()}/mo`,
    },
    {
      icon: <Home className="h-5 w-5 text-gray-500" />,
      label: "Type",
      value: propertyType,
    },
    {
      icon: <MapPin className="h-5 w-5 text-gray-500" />,
      label: "Location",
      value: location?.address,
    },
  ];

  return (
    <div className="border-b border-gray-200 bg-white p-4">
      <NavLink to={`/listing/${_id}`}>
        <div className="overflow-x-auto">
          <div className="flex flex-wrap gap-3">
            {details.map((detail, index) => (
              <div
                key={index}
                className="flex min-w-[150px] flex-1 items-center gap-3 rounded-lg bg-gray-50 p-3 shadow-sm"
              >
                <span className="flex-shrink-0">{detail.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500">{detail.label}</p>
                  <p className="truncate text-sm font-medium capitalize text-gray-900">
                    {detail.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </NavLink>
    </div>
  );
};

export default PropertyHeader;
