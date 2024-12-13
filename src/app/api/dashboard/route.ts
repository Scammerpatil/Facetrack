import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

function readCSV(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    let rowCount = 0;
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", () => {
        rowCount++;
      })
      .on("end", () => {
        resolve(rowCount);
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

    if (!fs.existsSync(studentDetailsPath) || !fs.existsSync(attendancePath)) {
      return NextResponse.json(
        { error: "One or more files do not exist." },
        { status: 400 }
      );
    }

    const [studentCount, attendanceCount] = await Promise.all([
      readCSV(studentDetailsPath),
      readCSV(attendancePath),
    ]);

    return NextResponse.json(
      { studentCount, attendanceCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error reading CSV files:", error);
    return NextResponse.json(
      { error: "An error occurred while reading the files." },
      { status: 500 }
    );
  }
}
