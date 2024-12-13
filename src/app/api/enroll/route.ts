import { exec } from "child_process";
import { promisify } from "util";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const { studentName, prn, branch } = await req.json();
  const env = {
    STUDENT_NAME: studentName,
    STUDENT_ID: prn,
    STUDENT_BRANCH: branch,
  };

  try {
    const { stdout } = await execAsync(`python python/enroll.py`, {
      env: { ...process.env, ...env },
    });
    try {
      console.log("Encoding.pkl buliding...");
      await execAsync(`python python/encoding.py`);
    } catch (error) {
      return NextResponse.json(
        { message: "Encoding.pkl Failed to bulid" },
        { status: 500 }
      );
    }
    return NextResponse.json({ output: stdout }, { status: 200 });
  } catch (error: any) {
    console.error("Error executing script:", error);
    return NextResponse.json(
      { error: "Error executing Python script." },
      { status: 500 }
    );
  }
}
