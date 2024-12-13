import face_recognition
import os
import pickle

IMAGE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "./StudentImages") 
ENCODINGS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "encodings.pkl") 

encodings = []
names = []

for root, dirs, files in os.walk(IMAGE_DIR):
    for file_name in files:
        if file_name.endswith(".jpg") or file_name.endswith(".png"):
            image_path = os.path.join(root, file_name)
            student_name = os.path.basename(root)
            image = face_recognition.load_image_file(image_path)
            try:
                encoding = face_recognition.face_encodings(image)[0]
                encodings.append(encoding)
                names.append(student_name)
                print(f"Processed {file_name} for student {student_name}")
            except IndexError:
                print(f"No face found in {image_path}, skipping.")

with open(ENCODINGS_FILE, "wb") as file:
    pickle.dump({"encodings": encodings, "names": names}, file)
print("Encodings saved successfully.")
