import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

// Function to read and parse CSV data
function readCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const rows: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => rows.push(data))
      .on("end", () => {
        resolve(rows);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

export async function GET() {
  try {
    const studentDetailsPath = path.join(
      process.cwd(),
      "python",
      "StudentDetails.csv"
    );
    const attendancePath = path.join(process.cwd(), "python", "attendance.csv");

    // Check if files exist
    if (!fs.existsSync(studentDetailsPath) || !fs.existsSync(attendancePath)) {
      return NextResponse.json(
        { error: "One or more files do not exist." },
        { status: 400 }
      );
    }

    // Read data from both CSV files
    const [studentData, attendanceData] = await Promise.all([
      readCSV(studentDetailsPath),
      readCSV(attendancePath),
    ]);

    // Return the full data to the frontend
    return NextResponse.json({ studentData, attendanceData }, { status: 200 });
  } catch (error) {
    console.error("Error reading CSV files:", error);
    return NextResponse.json(
      { error: "An error occurred while reading the files." },
      { status: 500 }
    );
  }
}
