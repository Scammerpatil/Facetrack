import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const { prn } = await req.json();
  try {
    await execAsync(`python python/attendance_tkinter.py`);

    return NextResponse.json({ message: "Attendance Marked" }, { status: 200 });
  } catch (error: any) {
    console.error("Error executing script:", error);
    return NextResponse.json(
      { error: "Error executing Python script." },
      { status: 500 }
    );
  }
}
