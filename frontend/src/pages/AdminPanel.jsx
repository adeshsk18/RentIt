import { Avatar } from "@mui/material";
import {
  AlertCircle,
  CheckCircle,
  Home,
  RefreshCcw,
  Users,
  XCircle,
  UserCog,
  Trash2,
  UserMinus,
} from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";

import Loading from "../components/blocks/loading";
import useApproveProperty from "../hooks/admin/useApproveProperty";
import useGetORequests from "../hooks/admin/useGetORequests";
import useGetUProperties from "../hooks/admin/useGetUProperties";
import useRespondToORequest from "../hooks/admin/useRespondToORequest";
import { useGetUsers } from "../hooks/admin/useGetUsers";
import { getMediaPath } from "../services/utils";
import { useDeleteUser } from "../hooks/admin/useDeleteUser";
import { useRevertOwner } from "../hooks/admin/useRevertOwner";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("properties");
  const [properties, setProperties] = useState([]);
  const [ownerRequests, setOwnerRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const { loading: loadingp, getUProperties } = useGetUProperties();
  const { loading: loadingo, getORequests } = useGetORequests();
  const { loading: loadingu, getUsers } = useGetUsers();
  const { loading: loadingpa, approveProperty } = useApproveProperty();
  const { loading: loadingoa, respontToORequest } = useRespondToORequest();
  const { loading: loadingd, deleteUser } = useDeleteUser();
  const { loading: loadingr, revertOwner } = useRevertOwner();

  const loadProperties = async () => {
    const data = await getUProperties();
    setProperties(data || []);
  };

  const loadRequests = async () => {
    const data = await getORequests();
    setOwnerRequests(data || []);
  };

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data || []);
  };

  const handlePropertyAction = async (propertyId, flag) => {
    if (await approveProperty(propertyId, flag)) await loadProperties();
  };

  const handleOwnerRequest = async (requestId, flag) => {
    if (await respontToORequest(requestId, flag)) await loadRequests();
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      if (await deleteUser(userId)) {
        await loadUsers();
      }
    }
  };

  const handleRevertOwner = async (userId) => {
    if (window.confirm("Are you sure you want to revert this user's owner status?")) {
      if (await revertOwner(userId)) {
        await loadUsers();
      }
    }
  };

  const fetchAll = useCallback(async () => {
    if (activeTab === "properties") {
      await loadProperties();
    } else if (activeTab === "requests") {
      await loadRequests();
    } else if (activeTab === "users") {
      await loadUsers();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const getLoadingState = () => {
    if (activeTab === "properties") return loadingp || loadingpa;
    if (activeTab === "requests") return loadingo || loadingoa;
    if (activeTab === "users") return loadingu || loadingd || loadingr;
    return false;
  };

  const loading = getLoadingState();

  return (
    <div className="mt-4 min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              </div>
            </div>
            <button
              onClick={fetchAll}
              className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("properties")}
              className={`${
                activeTab === "properties"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              <Home className="mr-2 h-5 w-5" />
              Properties
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`${
                activeTab === "requests"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              <Users className="mr-2 h-5 w-5" />
              Owner Requests
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`${
                activeTab === "users"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              <UserCog className="mr-2 h-5 w-5" />
              User Management
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {loading ? (
            <Loading />
          ) : activeTab === "properties" ? (
            properties.length === 0 ? (
              <div className="rounded-lg bg-white p-6 text-center">
                <p className="text-gray-500">No properties pending approval</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                  <div
                    key={property._id}
                    className="rounded-lg bg-white p-6 shadow"
                  >
                    <NavLink to={`/listing/${property._id}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {property.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {property.location.address}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {`lon: ${property.location.coordinates[0]} lat: ${property.location.coordinates[1]}`}
                          </p>
                        </div>
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          Price: ₹{property.rent}
                        </p>
                        <p className="text-sm text-gray-500">
                          Type: {property.propertyType}
                        </p>
                      </div>
                    </NavLink>
                    <a
                      href={`https://www.google.com/maps?q=${property.location.coordinates[1]},${property.location.coordinates[0]}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-800"
                    >
                      Open Location in Google Maps
                    </a>
                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={() =>
                          handlePropertyAction(property._id, "accept")
                        }
                        className="inline-flex flex-1 items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handlePropertyAction(property._id, "reject")
                        }
                        className="inline-flex flex-1 items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : activeTab === "requests" ? (
            ownerRequests.length === 0 ? (
              <div className="rounded-lg bg-white p-6 text-center">
                <p className="text-gray-500">No owner requests pending</p>
              </div>
            ) : (
              <div className="space-y-6">
                {ownerRequests.map((request) => (
                  <div
                    key={request._id}
                    className="rounded-lg bg-white p-6 shadow"
                  >
                    <NavLink to={`/u/${request.requesterId.username}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <Avatar
                            src={getMediaPath(request.requesterId.profilePicture)}
                            alt={request.requesterId.name}
                            sx={{ width: 102, height: 102 }}
                          />
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              {request.requesterId.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {request.requesterId.email}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          Pending
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          Username: {request.requesterId.username}
                        </p>
                        <p className="text-sm text-gray-500">
                          Contact: {request.requesterId.contactNumber}
                        </p>
                      </div>
                    </NavLink>
                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={() => handleOwnerRequest(request._id, "accept")}
                        className="inline-flex flex-1 items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleOwnerRequest(request._id, "reject")}
                        className="inline-flex flex-1 items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            users.length === 0 ? (
              <div className="rounded-lg bg-white p-6 text-center">
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="rounded-lg bg-white p-6 shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <Avatar
                          src={getMediaPath(user.profilePicture)}
                          alt={user.name}
                          sx={{ width: 64, height: 64 }}
                        />
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-sm text-gray-500">
                            Username: {user.username}
                          </p>
                          {user.contactNumber && (
                            <p className="text-sm text-gray-500">
                              Contact: {user.contactNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.type === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.type === "owner"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                        </span>
                        {user.type !== "admin" && (
                          <div className="flex gap-2">
                            {user.type === "owner" && (
                              <button
                                onClick={() => handleRevertOwner(user._id)}
                                className="inline-flex items-center rounded-md border border-transparent bg-yellow-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                              >
                                <UserMinus className="mr-1 h-4 w-4" />
                                Revert Owner
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              <Trash2 className="mr-1 h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
