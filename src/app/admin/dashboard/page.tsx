"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  UserPlus,
  CheckCircle,
  Clipboard,
  Users,
  BarChart2,
} from "lucide-react";

const Dashboard = () => {
  // State to hold the data
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalAttendanceMarked: 0,
    totalTrackedStudents: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/api/dashboard");
        setDashboardData({
          totalStudents: response.data.studentCount,
          totalAttendanceMarked: response.data.attendanceCount,
          totalTrackedStudents: response.data.attendanceCount,
        });
      } catch (error) {
        toast.error("Failed to fetch dashboard data!");
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg mb-6">
        Welcome to the admin dashboard. Manage users, track attendance, and
        generate reports from here.
      </p>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg flex items-center justify-between bg-accent text-accent-content">
          <Users width={30} />
          <h2 className="text-xl font-semibold">Total Students</h2>
          <p className="text-2xl font-bold">{dashboardData.totalStudents}</p>
        </div>
        <div className="p-4 rounded-lg flex items-center justify-between bg-accent text-accent-content">
          <CheckCircle width={30} />
          <h2 className="text-xl font-semibold">Total Attendance Marked</h2>
          <p className="text-2xl font-bold">
            {dashboardData.totalAttendanceMarked}
          </p>
        </div>
        <div className="p-4 rounded-lg flex items-center justify-between bg-accent text-accent-content">
          <BarChart2 width={30} />
          <h2 className="text-xl font-semibold">Total Tracked Students</h2>
          <p className="text-2xl font-bold">
            {dashboardData.totalTrackedStudents}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-base-100 p-6 rounded-lg text-center cursor-pointer hover:bg-base-200 transition-all">
          <UserPlus className="mx-auto mb-3" width={40} height={40} />
          <h3 className="font-semibold">Enroll New Student</h3>
          <p>Enroll a new student into the system.</p>
        </div>
        <div className="bg-base-100 p-6 rounded-lg text-center cursor-pointer hover:bg-base-200 transition-all">
          <CheckCircle className="mx-auto mb-3" width={40} height={40} />
          <h3 className="font-semibold">Mark Attendance</h3>
          <p>Mark attendance for students using face recognition.</p>
        </div>
        <div className="bg-base-100 p-6 rounded-lg text-center cursor-pointer hover:bg-base-200 transition-all">
          <Clipboard className="mx-auto mb-3" width={40} height={40} />
          <h3 className="font-semibold">View Reports</h3>
          <p>Generate reports for attendance and student records.</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-base-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <div>
          {/* Example Activity Log */}
          <div className="flex justify-between mb-2">
            <span>New Student Enrolled: John Doe</span>
            <span>12/12/2024</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Attendance Marked for Student: Jane Doe</span>
            <span>12/12/2024</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>New Report Generated: Attendance Summary</span>
            <span>12/12/2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
