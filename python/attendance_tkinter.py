import tkinter as tk
from tkinter import Label, messagebox
import cv2
import face_recognition
import numpy as np
import os
import pickle
from PIL import Image, ImageTk
from datetime import datetime
import csv

ENCODINGS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "encodings.pkl") 

# Load encodings from encodings.pkl
def load_encodings(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Encodings file '{file_path}' not found.")
    with open(file_path, "rb") as file:
        return pickle.load(file)

# Save attendance with detailed information
def save_attendance(name, start_time, end_time, total_time, attentiveness):
    ATTENDANCE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "attendance.csv") 
    if not os.path.exists(ATTENDANCE_FILE):
        with open(ATTENDANCE_FILE, "w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["Name", "Start Time", "End Time", "Total Time (s)", "Attentiveness (%)"])
    with open(ATTENDANCE_FILE, "a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([
            name,
            start_time.strftime("%Y-%m-%d %H:%M:%S"),
            end_time.strftime("%Y-%m-%d %H:%M:%S"),
            f"{total_time:.2f}",
            f"{attentiveness:.2f}"
        ])

# Main Tkinter function
def tkinter_face_recognition():
    try:
        data = load_encodings(ENCODINGS_FILE)
        known_face_encodings = data["encodings"]
        known_face_names = data["names"]
    except FileNotFoundError as e:
        messagebox.showerror("Error", str(e))
        return

    face_tracking = {}
    start_time = datetime.now()

    root = tk.Tk()
    root.title("Facial Attendance System")

    cam = cv2.VideoCapture(0)
    if not cam.isOpened():
        messagebox.showerror("Error", "Unable to access the camera.")
        return

    lbl_video = Label(root)
    lbl_video.pack()

    lbl_status = Label(root, text="Initializing attendance...", font=("Arial", 12))
    lbl_status.pack()

    def process_frame():
        nonlocal face_tracking
        ret, frame = cam.read()
        if not ret:
            lbl_status.config(text="Unable to read from the camera.")
            return

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_frame)

        if not face_locations:
            lbl_status.config(text="No faces detected.")
        else:
            try:
                face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
                for face_encoding, face_location in zip(face_encodings, face_locations):
                    matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.6)
                    face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                    best_match_index = np.argmin(face_distances) if matches else None

                    if best_match_index is not None and matches[best_match_index]:
                        name = known_face_names[best_match_index]
                        lbl_status.config(text=f"{name} detected.")
                        face_tracking.setdefault(name, {"detected_frames": 0, "total_frames": 0})
                        face_tracking[name]["detected_frames"] += 1
                    else:
                        lbl_status.config(text="Unknown face detected.")
                    
                    for name in face_tracking.keys():
                        face_tracking[name]["total_frames"] += 1
            except Exception as e:
                print(f"Error in face recognition: {e}")
                lbl_status.config(text="Error in processing frame.")

        img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        imgtk = ImageTk.PhotoImage(image=img)
        lbl_video.imgtk = imgtk
        lbl_video.configure(image=imgtk)
        lbl_video.after(10, process_frame)

    def calculate_attentiveness():
        nonlocal face_tracking
        end_time = datetime.now()
        total_duration = (end_time - start_time).total_seconds()
        for name, data in face_tracking.items():
            if data["total_frames"] > 0:
                attentiveness = (data["detected_frames"] / data["total_frames"]) * 100
                save_attendance(name, start_time, end_time, total_duration, attentiveness)
        lbl_status.config(text="Attendance saved successfully.")

    def on_closing():
        calculate_attentiveness()
        cam.release()
        root.destroy()

    process_frame()
    root.protocol("WM_DELETE_WINDOW", on_closing)
    root.mainloop()

tkinter_face_recognition()
