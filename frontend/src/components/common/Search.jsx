import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");

  // Debounce query to reduce unnecessary calls
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceQuery(query.trim());
    }, 500);
    return () => clearTimeout(timeout);
  }, [query]);

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", debounceQuery],
    queryFn: async () => {
      if (!debounceQuery) {
        return { data: [] };
      }
      const res = await fetch(`/api/users?query=${debounceQuery}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          `API Error (${res.status}): ${data.message || res.statusText}`
        );
      }
      return data;
    },
    enabled: debounceQuery.length > 0,
    retry: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
      <div className="p-4 w-full">
        <form
          className="flex gap-2 items-center w-full max-w-lg mx-auto"
          onSubmit={handleSubmit}
        >
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-4 text-gray-400" />
            <input
              type="text"
              id="search"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input input-bordered w-full pl-10 pr-3 py-2 rounded-full bg-gray-900 text-white"
            />
          </div>
        </form>
      </div>
      <div className="sticky border-b border-gray-700 w-20 md:w-full"></div>
      <div className="p-4">
        {isLoading ? (
          <div className="h-screen flex justify-center items-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="h-screen flex justify-center items-center">
            <p>{error.message}</p>
          </div>
        ) : users?.data?.length > 0 ? (
          <ul>
            {users.data.map((user) => (
              <li key={user._id} className="mb-4">
                <div className="flex flex-row gap-2">
                  <div className="avatar">
                    <Link
                      to={`/profile/${user.username}`}
                      className="w-8 h-8 rounded-full overflow-hidden"
                    >
                      <img
                        src={user.profileImg || "/avatar-placeholder.png"}
                        className="w-full h-full object-cover rounded-full"
                        alt="avatar"
                      />
                    </Link>
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <p className="font-bold">{user.fullName}</p>
                    </div>
                    <div>
                      <p className="text-gray-700 flex gap-1 text-sm">
                        @{user.username}
                      </p>
                    </div>
                    <div>
                      <p>{user.bio}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Oh no! So lonely here 😔</h2>
              <p>Search and follow to never feel alone</p>
              <div className="card-actions justify-end"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
