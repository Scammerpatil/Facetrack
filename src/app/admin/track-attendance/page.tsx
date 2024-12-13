"use client";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AttendanceRecord {
  Name: string;
  "Start Time": string;
  "End Time": string;
  "Total Time (s)": string;
  "Attentiveness (%)": string;
}

const TrackAttendance = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = axios.get("/api/attendance");
        toast.promise(response, {
          loading: "Fetching attendance data...",
          success: (data: AxiosResponse) => {
            setAttendanceData(data.data.attendanceData);
            return "Attendance data fetched successfully!";
          },
          error: "Failed to fetch attendance data.",
        });
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchAttendanceData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Track Attendance</h1>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full border border-base-content">
            <thead className="text-base text-center">
              <tr className="bg-base-200">
                <th className="border border-base-content px-4 py-2">Name</th>
                <th className="border border-base-content px-4 py-2">
                  Start Time
                </th>
                <th className="border border-base-content px-4 py-2">
                  End Time
                </th>
                <th className="border border-base-content px-4 py-2">
                  Total Time (s)
                </th>
                <th className="border border-base-content px-4 py-2">
                  Attentiveness (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length !== 0 ? (
                attendanceData.map((record, index) => (
                  <tr key={index} className="hover:bg-base-300">
                    <td className="border border-base-content px-4 py-2">
                      {record.Name}
                    </td>
                    <td className="border border-base-content px-4 py-2">
                      {record["Start Time"]}
                    </td>
                    <td className="border border-base-content px-4 py-2">
                      {record["End Time"]}
                    </td>
                    <td className="border border-base-content px-4 py-2">
                      {record["Total Time (s)"]}
                    </td>
                    <td className="border border-base-content px-4 py-2">
                      {record["Attentiveness (%)"]}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center border border-gray-300 px-4 py-2"
                  >
                    No Record Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrackAttendance;
