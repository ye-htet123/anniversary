import * as THREE from 'three';

export function loadVideos(scene) {
    const videoMeshes = [];
    const totalVideos = 15;
    const spacing = 70;
    const textureLoader = new THREE.TextureLoader();

    const isMobile = window.innerWidth < 768;

    // ၁။ Video ၁၅ ခုကို Tunnel ပုံစံ စီခြင်း
    for (let i = 1; i <= totalVideos; i++) {
        const videoId = `video${i}`;
        const videoElement = document.getElementById(videoId);

        if (!videoElement) continue;

        // Mobile မှာ အလယ်တည့်တည့်နား ရောက်အောင် xPos ကို 2.5 ထိ စုလိုက်တယ်
        const xPos = isMobile ? (i % 2 === 0 ? 2.5 : -2.5) : (i % 2 === 0 ? 16 : -16);
        const yPos = isMobile ? (i % 3 === 0 ? 3 : -2) : (i % 3 === 0 ? 7 : -4);
        const zPos = -(i * spacing) + 50;

        const texture = new THREE.VideoTexture(videoElement);
        // Mobile မှာ Video size ကို Portrait နဲ့ ကိုက်အောင် နည်းနည်း ထပ်လျှော့တယ်
        const geometry = isMobile ? new THREE.PlaneGeometry(18, 10.1) : new THREE.PlaneGeometry(24, 13.5);

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(xPos, yPos, zPos);
        mesh.rotation.y = (i % 2 === 0) ? (isMobile ? 0.05 : 0.2) : (isMobile ? -0.05 : -0.2);

        mesh.userData.videoElement = videoElement;
        scene.add(mesh);
        videoMeshes.push(mesh);

        // Video Glow Frame
        const frameGeom = isMobile ? new THREE.PlaneGeometry(19, 11.1) : new THREE.PlaneGeometry(25, 14.5);
        const frameMat = new THREE.MeshBasicMaterial({
            color: 0xff758c,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.2
        });
        const frame = new THREE.Mesh(frameGeom, frameMat);
        frame.position.copy(mesh.position);
        frame.rotation.copy(mesh.rotation);
        scene.add(frame);
    }

    // ၂။ ပထမဓာတ်ပုံ (final_photo.jpg)
    textureLoader.load('assets/videos/final_photo.jpg', (imgTexture) => {
        const imgMat = new THREE.MeshBasicMaterial({ map: imgTexture, transparent: true, side: THREE.DoubleSide });
        const img = new THREE.Mesh(new THREE.PlaneGeometry(isMobile ? 25 : 35, isMobile ? 18 : 23), imgMat);
        const zPos = -(totalVideos * spacing) - 70;

        img.position.set(isMobile ? -2 : -10, isMobile ? 1 : 2, zPos);
        img.rotation.y = isMobile ? 0.1 : 0.3;
        scene.add(img);

        const frame = new THREE.Mesh(new THREE.PlaneGeometry(isMobile ? 26.5 : 36.5, isMobile ? 19.5 : 24.5), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, side: THREE.BackSide }));
        frame.position.copy(img.position);
        frame.rotation.copy(img.rotation);
        scene.add(frame);
    });

    // ၃။ ဒုတိယဓာတ်ပုံ (new.jpg)
    textureLoader.load('assets/videos/new.jpg', (imgTexture) => {
        const imgMat = new THREE.MeshBasicMaterial({ map: imgTexture, transparent: true, side: THREE.DoubleSide });
        const img = new THREE.Mesh(new THREE.PlaneGeometry(isMobile ? 30 : 45, isMobile ? 22 : 30), imgMat);
        const zPos = -(totalVideos * spacing) - 220;
        img.position.set(0, 0, zPos);
        scene.add(img);

        const frame = new THREE.Mesh(new THREE.PlaneGeometry(isMobile ? 31.5 : 47, isMobile ? 23.5 : 32), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, side: THREE.BackSide }));
        frame.position.copy(img.position);
        scene.add(frame);
    });

    // ၄။ နောက်ဆုံးစာသား (I love you so much) - High Resolution 
    const textCanvas = document.createElement('canvas');
    const ctx = textCanvas.getContext('2d');
    // စာသား ဝါးမသွားအောင် resolution ကို ၂ ဆ တင်လိုက်တယ်
    textCanvas.width = 2048;
    textCanvas.height = 512;

    ctx.font = "bold 160px 'Dancing Script', cursive, sans-serif";
    ctx.fillStyle = "#ff758c";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(255, 117, 140, 0.9)";
    ctx.shadowBlur = 30;
    ctx.fillText("အမြဲတမ်း အများကြီးချစ်မယ်", 1024, 256);

    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.minFilter = THREE.LinearFilter; // Texture ကို ပိုကြည်လင်စေတယ်

    const textMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(isMobile ? 35 : 50, isMobile ? 8.75 : 12.5),
        new THREE.MeshBasicMaterial({ map: textTexture, transparent: true })
    );

    /**
     * Mobile မှာ စာသားကို Camera နဲ့ တစ်တန်းတည်း (Eye-level) ဖြစ်အောင် 
     * position.y ကို 0 ဝန်းကျင်မှာ ထားလိုက်ပါတယ်
     */
    textMesh.position.set(0, isMobile ? 0 : -10, -(totalVideos * spacing) - 350);
    scene.add(textMesh);

    return videoMeshes;
}