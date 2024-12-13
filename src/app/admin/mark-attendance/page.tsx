"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const MarkAttendance = () => {
  const [prn, setPrn] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAttendance = async () => {
    if (!prn) {
      toast.error("Please enter the PRN.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/mark-attendance", { prn });

      if (response.status === 200) {
        toast.success("Attendance marked successfully!");
        setPrn("");
      } else {
        toast.error(response.data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Failed to mark attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Mark Attendance</h1>

      <div className="form-control w-full max-w-md">
        <label className="label" htmlFor="prn">
          <span className="label-text">Enter PRN</span>
        </label>
        <input
          id="prn"
          type="text"
          value={prn}
          onChange={(e) => setPrn(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Enter PRN"
        />
      </div>

      <button
        className={`btn btn-primary mt-4 ${loading ? "loading" : ""}`}
        onClick={handleAttendance}
        disabled={loading}
      >
        {loading ? "Marking..." : "Mark Attendance"}
      </button>
    </div>
  );
};

export default MarkAttendance;
