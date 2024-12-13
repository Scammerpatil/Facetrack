import os
import subprocess
import tkinter as tk
from tkinter import Label, Button, messagebox
import cv2
from PIL import Image, ImageTk
import csv
from datetime import datetime
import os



IMAGE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "StudentImages")
CSV_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "StudentDetails.csv")

def assure_path_exists(path):
    if not os.path.exists(path):
        os.makedirs(path)

def add_student_to_csv(name, student_id, student_branch):
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, "w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["Student ID", "Name", "Branch", "Enrollment Timestamp"])
    with open(CSV_FILE, "a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([student_id, name, student_branch, datetime.now().strftime("%Y-%m-%d %H:%M:%S")])

def capture_images():
    student_name = os.getenv("STUDENT_NAME")
    student_id = os.getenv("STUDENT_ID")
    student_branch = os.getenv("STUDENT_BRANCH")

    if not student_name or not student_id or not student_branch:
        print("Error: Missing student details.")
        return

    student_dir = os.path.join(IMAGE_DIR, f"{student_id}_{student_name.replace(' ', '_')}")
    assure_path_exists(student_dir)

    def capture_images_gui():
        image_count = 0
        while image_count < 100:
            ret, frame = cam.read()
            if ret:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
                for (x, y, w, h) in faces:
                    face = frame[y:y + h, x:x + w]
                    image_path = os.path.join(student_dir, f"{student_id}_{image_count + 1}.jpg")
                    cv2.imwrite(image_path, face)
                    image_count += 1
                    img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    img = Image.fromarray(img)
                    imgtk = ImageTk.PhotoImage(image=img)
                    lbl_video.imgtk = imgtk
                    lbl_video.configure(image=imgtk)
                    if image_count >= 100:
                        break
            else:
                print("Failed to capture image")
        messagebox.showinfo("Success", "Image capture completed successfully!")
        add_student_to_csv(student_name, student_id, student_branch)
        lbl_status.config(text="Image capture and enrollment completed!", fg="green")

    def show_live_feed():
        ret, frame = cam.read()
        if ret:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
            img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(img)
            imgtk = ImageTk.PhotoImage(image=img)
            lbl_video.imgtk = imgtk
            lbl_video.configure(image=imgtk)
        lbl_video.after(10, show_live_feed)

    def on_closing():
        cam.release()
        root.destroy()

    root = tk.Tk()
    root.title(f"Face Capture - {student_name} ({student_id})")
    cam = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not cam.isOpened():
        print("Error: Cannot access the camera")
        return

    haarcascade_path = "python/haarcascade_frontalface_default.xml"
    if not os.path.isfile(haarcascade_path):
        print("Error: Haarcascade file not found!")
        return

    face_cascade = cv2.CascadeClassifier(haarcascade_path)

    lbl_video = Label(root)
    lbl_video.pack()

    lbl_status = Label(root, text="Ready to capture images.", font=("Arial", 12))
    lbl_status.pack()

    btn_capture = Button(root, text="Start Capture", command=capture_images_gui, bg="blue", fg="white", font=("Arial", 12, "bold"))
    btn_capture.pack()

    show_live_feed()
    root.protocol("WM_DELETE_WINDOW", on_closing)
    root.mainloop()

if __name__ == "__main__":
    capture_images()
