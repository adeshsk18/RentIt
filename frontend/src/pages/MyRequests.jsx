import { useEffect, useState } from "react";

import ChatSkeleton from "../components/ChatSkeleton";
import MessageInput from "../components/chat/MessageInput";
import ListerInfoCard from "../components/requests/ListerInfoCard";
import PropertHeader from "../components/requests/PropertyHeader";
import RequestState from "../components/requests/RequestState";
import useAuthStore from "../stores/useAuthStore";
import useRequestStore from "../stores/useRequestStore";

const InputField = () => {
  return (
    <RequestState blockPending={true}>
      <MessageInput />
    </RequestState>
  );
};
const MyRequests = () => {
  const { getRequestsArray, modifiedSwitch } = useRequestStore();
  const { userData } = useAuthStore();

  const [requestsList, setRequests] = useState([]);

  useEffect(() => {
    setRequests(
      getRequestsArray({
        key: "requesterId",
        value: userData.uid,
      })
    );
  }, [modifiedSwitch[0]]);

  return (
    <div className="min-h-[85vh] w-full bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <div className="sticky top-0 z-10 block border-b border-gray-200 bg-white p-4">
          <div className="flex items-center justify-start">
            <h2 className="text-lg font-bold md:text-xl">Your Requests</h2>
          </div>
        </div>

        <div>
          {requestsList.length === 0 ? (
            <div className="rounded-lg bg-white px-4 py-8 shadow-sm">
              <p className="text-center text-sm text-gray-600 sm:text-base">
                You haven't requested any properties yet
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-white shadow-sm">
              <ChatSkeleton
                allRequests={requestsList}
                userInfoKey="listedBy"
                InfoCard={ListerInfoCard}
                ChatInputField={InputField}
                MessageBoxHeader={PropertHeader}
                className="divide-y divide-gray-200"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRequests;
