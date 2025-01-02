from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2 as cv
import numpy as np
from io import BytesIO

# create the app
app = Flask(__name__)
# enable CORS
CORS(app)

DEFAULT_FONT=cv.FONT_HERSHEY_PLAIN

# load models
faceProto = "modelNweight/opencv_face_detector.pbtxt"
faceModel = "modelNweight/opencv_face_detector_uint8.pb"
ageProto = "modelNweight/age_deploy.prototxt"
ageModel = "modelNweight/age_net.caffemodel"
genderProto = "modelNweight/gender_deploy.prototxt"
genderModel = "modelNweight/gender_net.caffemodel"

# from dataset
MODEL_MEAN_VALUES = (78.4263377603, 87.7689143744, 114.895847746)
AGE_LIST = ['(0-2)', '(4-6)', '(8-12)', '(15-20)', '(25-32)', '(38-43)', '(48-53)', '(60-100)']
GENDER_LIST = ['Male', 'Female']
PADDING = 20

# load models
try:
    face_net = cv.dnn.readNet(faceModel, faceProto)
    age_net = cv.dnn.readNet(ageModel, ageProto)
    gender_net = cv.dnn.readNet(genderModel, genderProto)
except Exception as e:
    print(e)
    exit(1)



def get_face_box(net, frame, conf_threshold=0.7):
    """to find the face in the frame"""
    frame_copy = frame.copy()
    h, w = frame_copy.shape[:2]
    
    # create a blob from the frame
    blob = cv.dnn.blobFromImage(frame_copy, 1.0, (300, 300), [104, 117, 123], True, False)
    net.setInput(blob)
    detections = net.forward()
    bboxes = []

    # draw rectange around face
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > conf_threshold:
            x1 = int(detections[0, 0, i, 3] * w)
            y1 = int(detections[0, 0, i, 4] * h)
            x2 = int(detections[0, 0, i, 5] * w)
            y2 = int(detections[0, 0, i, 6] * h)
            bboxes.append([x1, y1, x2, y2])
            cv.rectangle(frame_copy, (x1, y1), (x2, y2), (0, 255, 0), 2)

    return frame_copy, bboxes



def process_image(file):
    """to process the image"""
    image = cv.imdecode(np.frombuffer(file.read(), np.uint8), cv.IMREAD_COLOR)

    if image is None:
        return None, "Failed to read image."

    # detect faces
    frame_face, bboxes = get_face_box(face_net, image, conf_threshold=0.7)

    # if no face detected
    if not bboxes:
        cv.putText(image,"No face detected",(50, 100),DEFAULT_FONT,5.0,(0, 0, 255),8,cv.LINE_AA)                
        return image, None

    # otherwise, predict age and gender
    for bbox in bboxes:
        x1, y1, x2, y2 = bbox
        face = image[
            max(0, y1 - PADDING) : min(y2 + PADDING, image.shape[0] - 1),
            max(0, x1 - PADDING) : min(x2 + PADDING, image.shape[1] - 1),
        ]
        blob = cv.dnn.blobFromImage(face, 1.0, (227, 227), MODEL_MEAN_VALUES, swapRB=False)

        # predict gender (sex)
        gender_net.setInput(blob)
        gender_preds = gender_net.forward()
        gender = GENDER_LIST[gender_preds[0].argmax()]

        # predict age
        age_net.setInput(blob)
        age_preds = age_net.forward()
        age = AGE_LIST[age_preds[0].argmax()]

        label = f"{gender}, {age}"
        cv.putText(frame_face,label,(x1, y1 - 10),DEFAULT_FONT,1.5,(0, 255, 255),3,cv.LINE_AA)

    return frame_face, None


# route to upload image
@app.route("/upload", methods=["POST"])


def upload_image():

    # check if the file is present
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    # read the file
    file = request.files["file"]
    processed_image, error = process_image(file)

    # if there is an error
    if processed_image is None:
        return jsonify({"error": error}), 400

    # convert to jpeg
    _, buffer = cv.imencode(".jpg", processed_image)
    image_stream = BytesIO(buffer)
    return send_file(image_stream, mimetype="image/jpeg")


# run the app
if __name__ == "__main__":
    app.run(debug=True)
