import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ActiveUsers from "./screens/ActiveUsers.js";
import UserActivity from "./screens/UserActivity.js";


function Home() {
  return (
    <div
      style={{
        padding: "50px",
        textAlign: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div>
        <Link to="/active-users">
          <button
            style={{
              margin: "10px",
              padding: "15px 30px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#ff7f50",
              color: "#fff",
              cursor: "pointer",
              transition: "transform 0.2s, background-color 0.2s",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#ff5722")
            }
            onMouseOut={(e) => (e.target.style.backgroundColor = "#ff7f50")}
          >
            Active Users
          </button>
        </Link>
        <Link to="/user-activity">
          <button
            style={{
              margin: "10px",
              padding: "15px 30px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#00bfff",
              color: "#fff",
              cursor: "pointer",
              transition: "transform 0.2s, background-color 0.2s",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#007fff")
            }
            onMouseOut={(e) => (e.target.style.backgroundColor = "#00bfff")}
          >
            User Activity
          </button>
        </Link>
      </div>
    </div>
  );
}




function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Define the Home Page */}
        <Route path="/" element={<Home />} />

        {/* Define Routes for Other Pages */}
        <Route path="/active-users" element={<ActiveUsers />} />
        <Route path="/user-activity" element={<UserActivity />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
