// Visualize scene corners
const sceneCanvas = document.createElement("canvas")
const sceneContext = sceneCanvas.getContext("2d")
sceneCanvas.setAttribute("id", "scene-image")

document.getElementById("corners-container").appendChild(sceneCanvas)

export function showCorners(sceneImage, corners) {
    sceneCanvas.width = sceneImage.width
    sceneCanvas.height = sceneImage.height
    sceneContext.drawImage(sceneImage, 0, 0)

    sceneContext.fillStyle = "red";
    sceneContext.font = "100px Georgia";

    corners.forEach((corner, i) => {
        sceneContext.fillRect(corner[0] - 15, corner[1] - 15, 30, 30)
        sceneContext.fillText(i, corner[0] - 15, corner[1] - 15);
    })
}