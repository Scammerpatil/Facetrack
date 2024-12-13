"use client";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Student {
  Name: string;
  "Student ID": string;
}

interface AttendanceRecord {
  Name: string;
  "Start Time": string;
  "End Time": string;
  "Total Time (s)": string;
  "Attentiveness (%)": string;
}

const StudentHistory = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = axios.get("/api/attendance");
        toast.promise(response, {
          loading: "Fetching student history...",
          success: (data: AxiosResponse) => {
            const { studentData, attendanceData } = data.data;
            setStudents(studentData);
            setAttendanceData(attendanceData);
            return "Student history fetched successfully!";
          },
          error: "Failed to fetch student history.",
        });
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchAttendanceData();
  }, []);

  const getStudentAttendance = (studentName: string, student_id: string) => {
    const name = student_id + "_" + studentName.split(" ").join("_");
    return attendanceData.filter((record) => record.Name === name);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Student History</h1>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="space-y-4">
          {students.length === 0 ? (
            <p className="text-center">No students found.</p>
          ) : (
            students.map((student, index) => (
              <div
                key={index}
                className="collapse collapse-arrow bg-base-100 rounded-lg"
              >
                <input type="radio" name="student-history" />
                <div className="collapse-title text-lg font-medium">
                  {student.Name}
                </div>
                <div className="collapse-content">
                  <div className="overflow-x-auto">
                    {getStudentAttendance(student.Name, student["Student ID"])
                      .length > 0 ? (
                      <table className="table table-zebra w-full">
                        <thead className="bg-base-300 text-base">
                          <tr>
                            <th className="px-4 py-2">Start Time</th>
                            <th className="px-4 py-2">End Time</th>
                            <th className="px-4 py-2">Total Time (s)</th>
                            <th className="px-4 py-2">Attentiveness (%)</th>
                          </tr>
                        </thead>
                        <tbody className="table-zebra text-base">
                          {getStudentAttendance(
                            student.Name,
                            student["Student ID"]
                          ).map((record, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-2">
                                {record["Start Time"]}
                              </td>
                              <td className="px-4 py-2">
                                {record["End Time"]}
                              </td>
                              <td className="px-4 py-2">
                                {record["Total Time (s)"]}
                              </td>
                              <td className="px-4 py-2">
                                {record["Attentiveness (%)"]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No attendance records for {student.Name}.</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StudentHistory;
