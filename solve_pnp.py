import cv2
import numpy as np
import json

scene_path = "./test_images/scene.png"
target_path = "./test_images/target.png"
calibration_data_path = "./temp/camera_calibration_data.json"

pose_data_path = "./temp/pose_data.json"

with open(calibration_data_path) as json_file:
    calibration_data = json.load(json_file)

scene = cv2.imread(scene_path)
target = cv2.imread(target_path)

target_image_width = target.shape[1]
target_image_height = target.shape[0]

# object_points = np.array([
#     (-target_image_width / 2, -target_image_height / 2, 0),
#     (-target_image_width / 2, target_image_height / 2, 0),
#     (target_image_width / 2, target_image_height / 2, 0),
#     (target_image_width / 2, -target_image_height / 2, 0),
# ], dtype=np.float32)

object_points = np.array([
    (0, 0, 0),
    (0, target_image_height, 0),
    (target_image_width, target_image_height, 0),
    (target_image_width, 0, 0),
], dtype=np.float32)

corners = np.array([
    [ 1113.8246, 643.63635 ],
    [ 1073.5529, 1290.5548 ],
    [ 2609.2234, 1223.0352 ],
    [ 2441.5803, 624.71985 ],
])

retval, rvec, tvec = cv2.solvePnP(object_points, corners, np.array(calibration_data['mtx']), np.array(calibration_data['dist']), flags=5)

axis = np.float32([
    [0, 0, 0],
    [0, 0, -250],
    [0, 250, 0],
    [250, 0, 0],
])

cube_points = np.float32([
    # base
    [0, 0, 0],
    [0, target_image_height, 0],
    [target_image_width, target_image_height, 0],
    [target_image_width, 0, 0],

    # top
    [0, 0, -150],
    [0, target_image_height, -150],
    [target_image_width, target_image_height, -150],
    [target_image_width, 0, -150],
])

points, jacobian = cv2.projectPoints(cube_points, rvec, tvec, np.array(calibration_data['mtx']), np.array(calibration_data['dist']))

points = np.int32([point[0].tolist() for point in points])

cv2.polylines(scene, [points[:4]], 1, (0,0,255), 4)
cv2.polylines(scene, [points[4:]], 1, (0,255,0), 4)

block_visualization_path = "test_images/solve_pnp_visualize.png"

cv2.imwrite(block_visualization_path, scene)

print("Block visualization written to: %s" % block_visualization_path)

R, _ = cv2.Rodrigues(rvec)

rot180XMat = np.array([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1]).reshape((4, 4))

Rt = R.T
# tvec = -Rt * tvec

T = np.zeros((4, 4), dtype=float)
T[0:3, 0:3] = Rt
T[0:3, 3] = tvec[:,0]
T[3, 3] = 1

# T = T * rot180XMat

data = {
    "corners": corners.tolist(),
    "rvec": rvec.flatten().tolist(),
    "tvec": tvec.flatten().tolist(),
    "R": R.flatten().tolist(),
    "T": T.flatten().tolist(),
    "target_image_width": target_image_width,
    "target_image_height": target_image_height
}

with open(pose_data_path, 'w') as outfile:
    json.dump(data, outfile)
    print("Pose data to %s" % pose_data_path)