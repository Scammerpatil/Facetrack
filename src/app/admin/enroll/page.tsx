"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EnrollStudent = () => {
  // State to store form data
  const [studentName, setStudentName] = useState("");
  const [prn, setPrn] = useState("");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !prn || !branch) {
      toast.error("All fields are required!");
      return;
    }
    const enrollmentData = {
      studentName,
      prn,
      branch,
      timestamp: new Date().toISOString(),
    };
    setLoading(true);

    try {
      const response = axios.post("/api/enroll", enrollmentData);
      toast.promise(response, {
        loading: "Enrolling student...",
        success: () => {
          setStudentName("");
          setPrn("");
          setBranch("");
          return "Student enrolled successfully!";
        },
        error: "Failed to enroll student!",
      });
      setStudentName("");
      setPrn("");
      setBranch("");
    } catch (error) {
      toast.error("Failed to enroll student!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl text-center font-bold mb-4">
        Enroll New Student
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 bg-base-200 rounded-lg"
      >
        <div>
          <label htmlFor="studentName" className="block text-lg font-semibold">
            Student Name
          </label>
          <input
            type="text"
            id="studentName"
            className="input input-bordered w-full"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="prn" className="block text-lg font-semibold">
            PRN
          </label>
          <input
            type="text"
            id="prn"
            className="input input-bordered w-full"
            value={prn}
            onChange={(e) => setPrn(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="branch" className="block text-lg font-semibold">
            Branch
          </label>
          <input
            type="text"
            id="branch"
            className="input input-bordered w-full"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            required
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className={`btn btn-primary ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Enrolling..." : "Enroll Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnrollStudent;
