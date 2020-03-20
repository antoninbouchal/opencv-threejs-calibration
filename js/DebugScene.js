import * as THREE from 'three'
const {OrbitControls} = require('three/examples/jsm/controls/OrbitControls')

export default class DebugScene {
    constructor(camera, object, width = 500, height = 500) {
        this._debugObject = object.clone()
        this._sourceCamera = camera

        this._setScene()
        this._setRenderer(width, height)
        this._setCamera()
        this._setCameraObject()
        this._setDomElement()
    }

    _setScene() {
        this._scene = new THREE.Scene()

        const lights = [];
        lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

        lights[ 0 ].position.set( 0, 20000, 0 );
        lights[ 1 ].position.set( 10000, 20000, 10000 );
        lights[ 2 ].position.set( - 10000, - 20000, - 10000 );

        this._scene.add( lights[ 0 ] );
        this._scene.add( lights[ 1 ] );
        this._scene.add( lights[ 2 ] );

        this._scene.add(this._debugObject)
    }

    _setRenderer(width, height) {
        this._renderer = new THREE.WebGLRenderer()
        this._renderer.setSize(500, 500)
    }

    _setCamera() {
        this._camera = new THREE.PerspectiveCamera(45, 1, 0.01, 10000000)
        this._camera.position.set(500, 500, 4500)
    }

    _setCameraObject() {
        const cameraGeometry = new THREE.ConeGeometry( 200, 200, 4 );
        const cameraMaterial = new THREE.MeshLambertMaterial( {color: 0xffff00} );
        const cameraObject = new THREE.Mesh( cameraGeometry, cameraMaterial );

        cameraObject.rotation.set(Math.PI/2, Math.PI/4, 0)

        const cameraAxesHelper = new THREE.AxesHelper( 200 );

        const cameraObjectScene = new THREE.Scene()
        cameraObjectScene.add(cameraObject, cameraAxesHelper)

        this._cameraObject = cameraObjectScene

        this._scene.add(this._cameraObject)
    }

    _render() {
        this._controls.update();

        this._renderer.render(this._scene, this._camera)

        this._cameraObject.position.set(0, 0, 0)
        this._cameraObject.rotation.set(0, 0, 0)

        this._cameraObject.applyMatrix4(this._sourceCamera.matrixWorld)

        requestAnimationFrame(() => {
            this._render()
        });
    }

    _setDomElement() {
        this._canvas = this._renderer.domElement
        this._controls = new OrbitControls(this._camera, this._canvas)

        this._canvas.setAttribute("id", "debug-canvas")

        this._render()
    }

    getDomElement() {
        return this._canvas
    }
}