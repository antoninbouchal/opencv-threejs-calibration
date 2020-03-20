import * as THREE from 'three'

export default class Scene {
    constructor(sceneImage, targetImage, cameraMatrix4) {
        this._sceneImage = sceneImage
        this._targetImage = targetImage

        this._setScene()
        this._setRenderer()
        this._setCamera()
        this._setTargetImageObject()
        this._setDomElement()

        this.setCameraMatrix(cameraMatrix4)
    }

    _setScene() {
        this._scene = new THREE.Scene()
    }

    _setRenderer() {
        this._renderer = new THREE.WebGLRenderer()
        this._renderer.setSize(this._sceneImage.width, this._sceneImage.height)
    }

    _setCamera() {
        this._camera = new THREE.PerspectiveCamera(45, this._sceneImage.width / this._sceneImage.height, 0.01, 10000000)
    }

    _setTargetImageObject() {
        const texture = new THREE.Texture(this._targetImage)
        texture.needsUpdate = true;

        const geometry = new THREE.PlaneGeometry( this._targetImage.width, this._targetImage.height, 1 );
        const material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, map: texture} );

        this._targetImageObject = new THREE.Mesh( geometry, material );

        this._scene.add(this._targetImageObject)
    }

    _render() {
        this._renderer.render(this._scene, this._camera)

        requestAnimationFrame(() => {
            this._render()
        });
    }

    setCameraMatrix(matrix4) {
        this._camera.position.set(0, 0, 0)
        this._camera.rotation.set(0, 0, 0)

        this._camera.applyMatrix4(matrix4)

        this._camera.rotateX(-Math.PI/4)
    }

    _setDomElement() {
        this._canvas = this._renderer.domElement
        this._canvas.setAttribute("id", "pose-canvas")

        this._render()
    }

    getDomElement() {
        return this._canvas
    }

    getCamera() {
        return this._camera
    }

    getTargetImageObject() {
        return this._targetImageObject
    }
}