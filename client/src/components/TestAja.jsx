/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";

function UserCount() {
  const [userCount, setUserCount] = useState(0);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/users-count")
  //     .then((response) => {
  //       console.log("Response data:", response.data);
  //       setUserCount(response.data.count);
  //     })
  //     .catch((error) => console.error("Error fetching user count:", error));
  // }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/users-count")
      .then((response) => {
        console.log("Data fetched:", response.data); // Debugging
        setUserCount(response.data.count);
      })
      .catch((error) => console.error("Error fetching user count:", error));
  }, []);

  return (
    <div>
      <h1>Total Users: {userCount}</h1>
    </div>
  );
}

export default UserCount;
