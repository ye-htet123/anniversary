import * as THREE from 'three';

export function createHeartParticles(scene) {
    const heartGroup = new THREE.Group();

    // ၁။ နှလုံးသား Shape ဆွဲခြင်း
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    // နှလုံးသားက အပြားဖြစ်လို့ ပိုပေါ့ပါးအောင် ShapeGeometry သုံးမယ်
    const geometry = new THREE.ShapeGeometry(heartShape);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff4d6d, // ပန်းရောင်ရင့်ရင့်
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    });

    // ၂။ နှလုံးသား အခု ၃၀၀ လောက်ကို Tunnel တစ်လျှောက် ကြဲချမယ်
    for (let i = 0; i < 300; i++) {
        const heart = new THREE.Mesh(geometry, material);

        heart.position.set(
            (Math.random() - 0.5) * 300,  // ဘယ်ညာ ပြန့်ကားမှု
            (Math.random() - 0.5) * 200,  // အပေါ်အောက် ပြန့်ကားမှု
            -(Math.random() * 1500)       // Tunnel တစ်လျှောက် (အဝေးကြီးထိ)
        );

        // ကျပန်း လှည့်ထားမယ် (Random Rotation)
        heart.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

        // အရွယ်အစားကို သေးသေးလေးတွေ လုပ်မယ် (Particle လိုမျိုး)
        const s = Math.random() * 0.05 + 0.02;
        heart.scale.set(s, s, s);

        heartGroup.add(heart);
    }

    scene.add(heartGroup);
    return heartGroup;
}