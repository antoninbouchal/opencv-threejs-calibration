import * as THREE from 'three'
import Scene from "./Scene";
import {showCorners} from "./corners2DVisualize";
import DebugScene from "./DebugScene";
const {OrbitControls} = require('three/examples/jsm/controls/OrbitControls')

const poseData = require("../temp/pose_data")

const poseMatrix = new THREE.Matrix4()
poseMatrix.set(...poseData.T)



const sceneImage = new Image()
const targetImage = new Image()

sceneImage.src = "/test_images/scene.png"
targetImage.src = "/test_images/target.png"

Promise.all([
    new Promise((resolve, reject) => {
        sceneImage.onload = () => {
            resolve()
        }
    }),
    new Promise((resolve, reject) => {
        targetImage.onload = () => {
            resolve()
        }
    })
]).then(() => {
    showCorners(sceneImage, poseData.corners)

    const scene = new Scene(sceneImage, targetImage, poseMatrix)
    document.getElementById("scene-container").appendChild(scene.getDomElement())

    const debugScene = new DebugScene(
        scene.getCamera(),
        scene.getTargetImageObject().clone()
    )
    document.getElementById("debug-container").appendChild(debugScene.getDomElement())
})