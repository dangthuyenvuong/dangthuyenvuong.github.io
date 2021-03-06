class EffectShell {
    constructor(container = document.body, itemsWrapper = null) {
        this.container = container
        this.itemsWrapper = itemsWrapper
        if (!this.container || !this.itemsWrapper) return

        this.setup()
        this.initEffectShell().then(() => {
            console.log('load finished')
            this.isLoaded = true
        })
        this.createEventsListeners()
    }
    setup() {
        window.addEventListener('resize', this.onWindowResize.bind(this), false)

        // renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setSize(this.viewport.width, this.viewport.height)
        this.renderer.setPixelRatio = window.devicePixelRatio
        this.container.appendChild(this.renderer.domElement)

        // scene
        this.scene = new THREE.Scene()

        // camera
        this.camera = new THREE.PerspectiveCamera(
            40,
            this.viewport.aspectRatio,
            0.1,
            100
        )
        this.camera.position.set(0, 0, 3)

        // animation loop
        this.renderer.setAnimationLoop(this.render.bind(this))
    }

    render() {
        // called every frame
        this.renderer.render(this.scene, this.camera)
    }

    get viewport() {
        let width = this.container.clientWidth
        let height = this.container.clientHeight
        let aspectRatio = width / height
        return {
            width,
            height,
            aspectRatio
        }
    }

    onWindowResize() {
        this.camera.aspect = this.viewport.aspectRatio
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.viewport.width, this.viewport.height)
    }

    get itemsElements() {
        // convert NodeList to Array
        const items = [...this.itemsWrapper.querySelectorAll('.link')]

        //create Array of items including element, image and index
        return items.map((item, index) => ({
            element: item,
            img: item.querySelector('img') || null,
            index: index
        }))
    }

    initEffectShell() {
        let promises = []

        this.items = this.itemsElements

        const THREEtextureLoader = new THREE.TextureLoader()
        this.items.forEach((item, index) => {
            // create textures
            promises.push(
                this.loadTexture(
                    THREEtextureLoader,
                    item.img ? item.img.src : null,
                    index
                )
            )
        })

        return new Promise((resolve, reject) => {
            // resolve textures promises
            Promise.all(promises).then(promises => {
                // all textures are loaded
                promises.forEach((promise, index) => {
                    // assign texture to item
                    this.items[index].texture = promise.texture
                })
                resolve()
            })
        })
    }

    loadTexture(loader, url, index) {
        // https://threejs.org/docs/#api/en/loaders/TextureLoader
        return new Promise((resolve, reject) => {
            if (!url) {
                resolve({ texture: null, index })
                return
            }
            // load a resource
            loader.load(
                // resource URL
                url,

                // onLoad callback
                texture => {
                    resolve({ texture, index })
                },

                // onProgress callback currently not supported
                undefined,

                // onError callback
                error => {
                    console.error('An error happened.', error)
                    reject(error)
                }
            )
        })
    }

    createEventsListeners() {
        this.items.forEach((item, index) => {
            item.element.addEventListener(
                'mouseover',
                this._onMouseOver.bind(this, index),
                false
            )
        })

        this.container.addEventListener(
            'mousemove',
            this._onMouseMove.bind(this),
            false
        )
        this.itemsWrapper.addEventListener(
            'mouseleave',
            this._onMouseLeave.bind(this),
            false
        )
    }

    _onMouseLeave(event) {
        this.isMouseOver = false
        this.onMouseLeave(event)
    }

    _onMouseMove(event) {
        // get normalized mouse position on viewport
        this.mouse.x = (event.clientX / this.viewport.width) * 2 - 1
        this.mouse.y = -(event.clientY / this.viewport.height) * 2 + 1

        this.onMouseMove(event)
    }

    _onMouseOver(index, event) {
        this.onMouseOver(index, event)
    }

    get viewSize() {
        // https://gist.github.com/ayamflow/96a1f554c3f88eef2f9d0024fc42940f

        let distance = this.camera.position.z
        let vFov = (this.camera.fov * Math.PI) / 180
        let height = 2 * Math.tan(vFov / 2) * distance
        let width = height * this.viewport.aspectRatio
        return { width, height, vFov }
    }
}


class Effect extends EffectShell {
    constructor(container = document.body, itemsWrapper = null, options = {}) {
        super(container, itemsWrapper)
        if (!this.container || !this.itemsWrapper) return

        options.strength = options.strength || 0.25
        this.options = options

        this.init()
    }

    init() {
        this.position = new THREE.Vector3(0, 0, 0)
        this.scale = new THREE.Vector3(1, 1, 1)
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)
        this.uniforms = {
            uTexture: {
                //texture data
                value: null
            },
            uOffset: {
                //distortion strength
                value: new THREE.Vector2(0.0, 0.0)
            },
            uAlpha: {
                //opacity
                value: 0
            }

        }
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
          uniform vec2 uOffset;
          varying vec2 vUv;
    
          void main() {
            vUv = uv;
            vec3 newPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
          }
        `,
            fragmentShader: `
          uniform sampler2D uTexture;
          uniform float uAlpha;
          varying vec2 vUv;
    
          void main() {
            vec3 color = texture2D(uTexture,vUv).rgb;
            gl_FragColor = vec4(color,1.0);
          }
        `,
            transparent: true
        })
        this.plane = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.plane)
    }

    onMouseEnter() { }

    onMouseOver(index, e) {
        if (!this.isLoaded) return
        this.onMouseEnter()
        if (this.currentItem && this.currentItem.index === index) return
        this.onTargetChange(index)
    }

    onTargetChange(index) {
        // item target changed
        this.currentItem = this.items[index]
        if (!this.currentItem.texture) return

        //update texture
        this.uniforms.uTexture.value = this.currentItem.texture

        // compute image ratio
        let imageRatio =
            this.currentItem.img.naturalWidth / this.currentItem.img.naturalHeight

        // scale plane to fit image dimensions
        this.scale = new THREE.Vector3(imageRatio, 1, 1)
        this.plane.scale.copy(this.scale)
    }

    onMouseMove(event) {
        // project mouse position to world coordinates
        let x = this.mouse.x.map(
            -1,
            1,
            -this.viewSize.width / 2,
            this.viewSize.width / 2
        )
        let y = this.mouse.y.map(
            -1,
            1,
            -this.viewSize.height / 2,
            this.viewSize.height / 2
        )

        // update plane position
        this.position = new THREE.Vector3(x, y, 0)
        TweenLite.to(this.plane.position, 1, {
            x: x,
            y: y,
            ease: Power4.easeOut,
            onUpdate: this.onPositionUpdate.bind(this)
        })
    }

    onMouseEnter() {
        if (!this.currentItem || !this.isMouseOver) {
            this.isMouseOver = true
            // show plane
            TweenLite.to(this.uniforms.uAlpha, 0.5, {
                value: 1,
                ease: Power4.easeOut
            })
        }
    }

    onMouseLeave(event) {
        TweenLite.to(this.uniforms.uAlpha, 0.5, {
            value: 0,
            ease: Power4.easeOut
        })
    }

    onPositionUpdate() {
        // compute offset
        let offset = this.plane.position
            .clone()
            .sub(this.position) // velocity
            .multiplyScalar(-this.options.strength)
        this.uniforms.uOffset.value = offset
    }
}