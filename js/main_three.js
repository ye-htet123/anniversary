import * as THREE from 'three';
import { loadVideos } from './video_loader.js';
import { ScrollEngine } from './scroll_engine.js';

let scene, camera, renderer, engine;
let videoMeshes = [];
let isAudioEnabled = false;

export function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x050505, 0.005);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 60;

    const canvas = document.querySelector('#three-canvas');
    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    engine = new ScrollEngine();

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    addParticles();

    // Video များနှင့် ဓာတ်ပုံကို load လုပ်ခြင်း
    videoMeshes = loadVideos(scene);

    animate();
    window.addEventListener('resize', onWindowResize);
}

function addParticles() {
    const heartCanvas = document.createElement('canvas');
    heartCanvas.width = 64; heartCanvas.height = 64;
    const ctx = heartCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(32, 48);
    ctx.bezierCurveTo(32, 45, 12, 35, 12, 20);
    ctx.bezierCurveTo(12, 10, 25, 10, 32, 18);
    ctx.bezierCurveTo(39, 10, 52, 10, 52, 20);
    ctx.bezierCurveTo(52, 35, 32, 45, 32, 48);
    ctx.fill();

    const heartTexture = new THREE.CanvasTexture(heartCanvas);
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 50000; i++) {
        vertices.push(THREE.MathUtils.randFloatSpread(1500), THREE.MathUtils.randFloatSpread(1500), THREE.MathUtils.randFloatSpread(3000) - 1000);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0xff758c, size: 5, map: heartTexture, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    scene.add(new THREE.Points(geometry, material));
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    if (engine) {
        camera.position.z = 60 - engine.update();
    }

    const time = Date.now() * 0.001;
    videoMeshes.forEach((mesh, index) => {
        mesh.position.y += Math.sin(time + index) * 0.01;
        mesh.lookAt(camera.position.x, camera.position.y, camera.position.z);

        // *** FIX: Video Texture က Mobile မှာ ရပ်မနေအောင် Update လုပ်ပေးခြင်း ***
        if (mesh.material.map) {
            mesh.material.map.needsUpdate = true;
        }
    });

    if (isAudioEnabled) {
        updateVideoVolume();
    }

    renderer.render(scene, camera);
}

function updateVideoVolume() {
    const isMobile = window.innerWidth < 768;
    const vector = new THREE.Vector3();

    videoMeshes.forEach((mesh) => {
        const videoElement = mesh.userData.videoElement;
        if (!videoElement) return;

        mesh.updateMatrixWorld();
        vector.setFromMatrixPosition(mesh.matrixWorld);
        vector.project(camera);

        const xDistance = Math.abs(vector.x);
        const zDistance = Math.abs(camera.position.z - mesh.position.z);

        let volume = 0;
        const xThreshold = isMobile ? 0.8 : 0.4;
        const zThreshold = isMobile ? 45 : 65;

        if (xDistance < xThreshold && zDistance < zThreshold) {
            volume = Math.pow((1 - (xDistance / xThreshold)) * (1 - (zDistance / zThreshold)), isMobile ? 1.2 : 2);
        }

        if (isAudioEnabled) {
            // ကျော်သွားရင် ချက်ချင်းပိတ်မယ်
            if (camera.position.z < mesh.position.z - 2) {
                videoElement.volume = 0;
                if (!videoElement.paused) videoElement.pause();
            } else {
                const finalVolume = Math.max(0, Math.min(volume, 1));
                videoElement.volume = finalVolume;

                if (finalVolume > 0.02) {
                    if (videoElement.paused) videoElement.play().catch(() => { });
                } else {
                    if (!videoElement.paused) videoElement.pause();
                }
            }
        }
    });
}

/**
 * Mobile Autoplay ကို Force Play လုပ်ခြင်း
 */
export function unmuteVideos() {
    isAudioEnabled = true;

    videoMeshes.forEach(mesh => {
        const v = mesh.userData.videoElement;
        if (v) {
            v.muted = false;
            // Mobile Browser တွေအတွက် အတင်း Play ခိုင်းခြင်း
            v.play().then(() => {
                console.log("Playing successfully");
            }).catch(e => {
                // Play မရရင် Mute လုပ်ပြီး အရင် Play ခိုင်းမယ်
                v.muted = true;
                v.play();
                console.warn("Autoplay fix applied", e);
            });
        }
    });
}