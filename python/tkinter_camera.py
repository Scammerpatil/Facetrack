import tkinter as tk
from tkinter import Label, Button, messagebox
import cv2
from PIL import Image, ImageTk
import os
import csv
from datetime import datetime

def assure_path_exists(path):
    if not os.path.exists(path):
        os.makedirs(path)

def add_student_to_csv(name, student_id,student_branch):
    csv_file = "students.csv"
    if not os.path.exists(csv_file):
        with open(csv_file, "w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["Student ID", "Name","Branch", "Enrollment Timestamp"])
    with open(csv_file, "a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([student_id, name,student_branch, datetime.now().strftime("%Y-%m-%d %H:%M:%S")])

def tkinter_face_capture():
    student_name = os.getenv("STUDENT_NAME", "Unknown")
    student_id = os.getenv("STUDENT_ID", "Unknown")
    student_branch = os.getenv("STUDENT_BRANCH", "Unknown") 
    student_dir = os.getenv("STUDENT_DIR", "./CapturedImages")

    if not student_name or not student_id or not student_dir:
        print("Error: Missing student details.")
        return

    def capture_images():
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
        add_student_to_csv(student_name, student_id,student_branch)
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
    btn_capture = Button(root, text="Start Capture", command=capture_images, bg="blue", fg="white", font=("Arial", 12, "bold"))
    btn_capture.pack()
    show_live_feed()
    root.protocol("WM_DELETE_WINDOW", on_closing)
    root.mainloop()

tkinter_face_capture()
