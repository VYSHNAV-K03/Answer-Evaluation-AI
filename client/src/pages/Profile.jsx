import React, { useEffect, useState } from "react";

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData(user);
    }
  }, []);

  if (!userData) {
    return <div className="container mt-5 text-center">Loading Profile...</div>;
  }

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4 p-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-4 text-center">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
              style={{ width: "120px", height: "120px", fontSize: "40px" }}
            >
              {getInitials(userData.username)}
            </div>
            <h5 className="mt-3">{userData.username}</h5>
            <span className="badge bg-secondary mt-2">
              {userData.role === "teacher" ? "Teacher" : "Student"}
            </span>
          </div>

          <div className="col-md-8">
            <h4 className="mb-3 border-bottom pb-2">Profile Information</h4>
            <div className="row">
              <div className="col-6 mb-3">
                <small className="text-muted">Email</small>
                <div>{userData.email}</div>
              </div>
              <div className="col-6 mb-3">
                <small className="text-muted">Phone</small>
                <div>{userData.phone}</div>
              </div>
              {userData.role !== "teacher" && (
                <div className="col-6 mb-3">
                  <small className="text-muted">Roll Number (RNO)</small>
                  <div>{userData.rno || "N/A"}</div>
                </div>
              )}
              <div className="col-6 mb-3">
                <small className="text-muted">Verified</small>
                <div>{userData.isVerified ? "Yes" : "No"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
