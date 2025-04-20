import { Calendar, Clock, User, Users } from "lucide-react";

const RequestHeader = ({ request }) => {
  const requestDetails = [
    {
      icon: <Users className="h-5 w-5 text-gray-500" />,
      label: "Type",
      value: request.details.tenantType,
    },
    {
      icon: <Clock className="h-5 w-5 text-gray-500" />,
      label: "Duration",
      value: `${request.details.noOfMonths} month${request.details.noOfMonths > 1 ? "s" : ""}`,
    },
    {
      icon: <Users className="h-5 w-5 text-gray-500" />,
      label: "People",
      value: request.details.headCount,
    },
    {
      icon: <Calendar className="h-5 w-5 text-gray-500" />,
      label: "Entry",
      value: new Date(request.details.enterDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
    },
    {
      icon: <Users className="h-5 w-5 text-gray-500" />,
      label: "Age",
      value: request.details.age || "Na",
    },
    {
      icon: <User className="h-5 w-5 text-gray-500" />,
      label: "Gender",
      value: request.details.gender || "Na",
    },
  ];

  return (
    <div className="border-b border-gray-200 bg-white p-4">
      <div className="overflow-x-auto">
        <div className="flex flex-wrap gap-3">
          {requestDetails.map((detail, index) => (
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
    </div>
  );
};

export default RequestHeader;
