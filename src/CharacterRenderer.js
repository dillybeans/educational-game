import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class CharacterRenderer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mixer = null;
        this.model = null;
        this.animations = {};
        this.currentAction = null;
        this.clock = new THREE.Clock();
        this.container = null;
        this.isInitialized = false;
        this.deathTimeout = null;
    }

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container || this.isInitialized) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        // Scene
        this.scene = new THREE.Scene();

        // Camera — pulled back to show full character with padding
        this.camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
        this.camera.position.set(0, 1.2, 12);
        this.camera.lookAt(0, 0.8, 0);

        // Renderer — transparent bg to blend with game
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.container.appendChild(this.renderer.domElement);

        // Lighting — neon aesthetic matching the game
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
        mainLight.position.set(3, 4, 5);
        this.scene.add(mainLight);

        const magentaLight = new THREE.PointLight(0xFF3AF2, 2, 8);
        magentaLight.position.set(-2, 1.5, 1);
        this.scene.add(magentaLight);

        const cyanLight = new THREE.PointLight(0x00F5D4, 1.5, 8);
        cyanLight.position.set(2, 0.5, 2);
        this.scene.add(cyanLight);

        const purpleLight = new THREE.PointLight(0x7B2FFF, 1, 8);
        purpleLight.position.set(0, 2, -2);
        this.scene.add(purpleLight);

        this.loadModel();
        this.animate();

        window.addEventListener('resize', () => this.onResize());

        // Listen for game events
        window.addEventListener('character:show', () => this.show());
        window.addEventListener('character:hide', () => this.hide());
        window.addEventListener('character:death', () => this.playDeath());
        window.addEventListener('character:idle', () => this.playIdle());
        window.addEventListener('character:punch', () => this.playPunch());

        this.isInitialized = true;
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load('src/models/platformer-character.glb', (gltf) => {
            this.model = gltf.scene;
            this.model.position.set(0, -0.2, 0);
            this.model.rotation.y = -0.3;
            this.model.scale.set(0.8, 0.8, 0.8);
            this.scene.add(this.model);

            this.mixer = new THREE.AnimationMixer(this.model);

            gltf.animations.forEach(clip => {
                this.animations[clip.name] = this.mixer.clipAction(clip);
                console.log('🎬 Animation:', clip.name, `(${clip.duration.toFixed(2)}s)`);
            });

            this.playIdle();
        },
            (xhr) => console.log(`Character ${(xhr.loaded / xhr.total * 100).toFixed(0)}% loaded`),
            (error) => console.error('Error loading character:', error));
    }

    playIdle() {
        if (!this.mixer || Object.keys(this.animations).length === 0) return;

        const idleName = Object.keys(this.animations).find(n =>
            n.toLowerCase().includes('idle')
        ) || Object.keys(this.animations)[0];

        if (!idleName) return;

        const action = this.animations[idleName];
        if (this.currentAction && this.currentAction !== action) {
            this.currentAction.fadeOut(0.4);
        }
        action.reset();
        action.setLoop(THREE.LoopRepeat);
        action.fadeIn(0.4);
        action.play();
        this.currentAction = action;
    }

    playDeath() {
        if (!this.mixer || Object.keys(this.animations).length === 0) return;

        if (this.deathTimeout) {
            clearTimeout(this.deathTimeout);
            this.deathTimeout = null;
        }

        const deathName = Object.keys(this.animations).find(n =>
            n.toLowerCase().includes('death')
        );
        if (!deathName) { console.warn('No Death animation found'); return; }

        const deathAction = this.animations[deathName];

        if (this.currentAction && this.currentAction !== deathAction) {
            this.currentAction.fadeOut(0.2);
        }

        deathAction.reset();
        deathAction.setLoop(THREE.LoopOnce);
        deathAction.clampWhenFinished = true;
        deathAction.fadeIn(0.2);
        deathAction.play();
        this.currentAction = deathAction;

        const duration = deathAction.getClip().duration;
        this.deathTimeout = setTimeout(() => {
            this.playIdle();
            this.deathTimeout = null;
        }, (duration + 1.0) * 1000);
    }

    playPunch() {
        if (!this.mixer || Object.keys(this.animations).length === 0) return;

        if (this.deathTimeout) {
            clearTimeout(this.deathTimeout);
            this.deathTimeout = null;
        }

        const punchName = Object.keys(this.animations).find(n =>
            n.toLowerCase().includes('punch')
        );
        if (!punchName) return;

        const punchAction = this.animations[punchName];

        if (this.currentAction && this.currentAction !== punchAction) {
            this.currentAction.fadeOut(0.2);
        }

        punchAction.reset();
        punchAction.setLoop(THREE.LoopOnce);
        punchAction.clampWhenFinished = false;
        punchAction.fadeIn(0.2);
        punchAction.play();
        this.currentAction = punchAction;

        const duration = punchAction.getClip().duration;
        this.deathTimeout = setTimeout(() => {
            this.playIdle();
            this.deathTimeout = null;
        }, (duration + 0.5) * 1000);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta);
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        if (w === 0 || h === 0) return;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }

    show() {
        if (this.container) { this.container.style.display = 'flex'; this.onResize(); }
    }

    hide() {
        if (this.container) this.container.style.display = 'none';
    }
}

window.characterRenderer = new CharacterRenderer();
export default window.characterRenderer;
