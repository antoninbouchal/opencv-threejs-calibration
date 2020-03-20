import cv2
import numpy as np
import glob
import json

images = glob.glob('calibration_images/*.jpg')

objp = np.zeros((6 * 7, 3), np.float32)
objp[:, :2] = np.mgrid[0:7, 0:6].T.reshape(-1, 2)

objpoints = []  # 3d point in real world space
imgpoints = []  # 2d points in image plane.

criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)

for imagePath in images:
    image = cv2.imread(imagePath)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    ret, corners = cv2.findChessboardCorners(gray, (7, 6), flags=cv2.CALIB_CB_FAST_CHECK)

    if ret == True:
        corners2 = cv2.cornerSubPix(gray, corners, (11, 11), (-1, -1), criteria)
        imgpoints.append(corners2)
        objpoints.append(objp)

ret, mtx, dist, rvecs, tvecs = cv2.calibrateCamera(objpoints, imgpoints, gray.shape[::-1], None, None)

data = {
    "mtx": mtx.tolist(),
    "dist": dist.tolist()
}

calibrationDataPath = "./temp/camera_calibration_data.json"

with open(calibrationDataPath, 'w') as outfile:
    json.dump(data, outfile)
    print("Saving calibration data to %s" % calibrationDataPath)