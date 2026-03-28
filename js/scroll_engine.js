/**
 * ScrollEngine: Manages the transition from user input to 3D movement.
 * Optimized for 15 videos, 2 final images, and the concluding text.
 */
export class ScrollEngine {
    constructor() {
        this.scrollTarget = 0; // User သွားချင်တဲ့ ပန်းတိုင်
        this.currentScroll = 0; // Camera ရောက်နေတဲ့ လက်ရှိနေရာ (Smoothing အတွက်)

        /**
         * Tunnel အကွာအဝေးကို ချိန်ညှိခြင်း:
         * Video 15 ခု (Spacing 70) = 1050
         * Final Photos + Padding = ~300
         * "I love you" Text က -(15 * 70) - 230 = -1280 ဝန်းကျင်မှာ ရှိပါတယ်။
         * Camera က 60 ကနေ စတာဖြစ်လို့ (60 - scroll) logic အရ
         * စာသားကို မျက်နှာချင်းဆိုင် အနီးကပ် မြင်ရဖို့ 1650 က အကောင်းဆုံးပါ။
         */
        this.isMobile = /Android|iPhone/i.test(navigator.userAgent);
        this.maxScroll = this.isMobile ? 1750 : 1650; // Mobile မှာ စာသားကို ပိုနီးနီးကပ်ကပ် မြင်ရအောင်

        // Sensitivity ကို ချိန်ညှိမယ်
        this.sensitivity = this.isMobile ? 0.6 : 0.5;
        this.lerpFactor = this.isMobile ? 0.08 : 0.05; // Mobile မှာ လက်နဲ့ထိတာဖြစ်လို့ တုံ့ပြန်မှု ပိုမြန်အောင် (0.08) ထားတယ်

        this.initListeners();
    }

    initListeners() {
        // 1. Desktop Scroll (Mouse Wheel)
        window.addEventListener('wheel', (e) => {
            // DeltaY ကို sensitivity နဲ့ မြှောက်ပြီး Target ကို တိုးမယ်
            this.scrollTarget += e.deltaY * this.sensitivity;
            this.clamp();
        }, { passive: true });

        // 2. Mobile Touch (Finger Swipe)
        let touchStart = 0;
        let lastTouchY = 0;

        window.addEventListener('touchstart', (e) => {
            touchStart = e.touches[0].clientY;
            lastTouchY = touchStart;
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            const currentTouchY = e.touches[0].clientY;

            /**
             * Mobile Swipe Logic:
             * အပေါ်ကို ဆွဲတင်ရင် (Swipe Up) Tunnel ထဲကို တိုးဝင်သွားရမယ်။
             * Delta ကို 2.5 နဲ့ မြှောက်ထားတာက လက်တစ်ချက်ဆွဲလိုက်တာနဲ့ 
             * Video တစ်ခုစာလောက် ခရီးပေါက်အောင်လို့ပါ။
             */
            const delta = (lastTouchY - currentTouchY) * 2.5;
            this.scrollTarget += delta;

            lastTouchY = currentTouchY;
            this.clamp();
        }, { passive: true });
    }

    /**
     * Tunnel ရဲ့ အစ (0) နဲ့ အဆုံး (maxScroll) ထက် ကျော်မသွားအောင် ထိန်းချုပ်ခြင်း
     */
    clamp() {
        this.scrollTarget = Math.max(0, Math.min(this.scrollTarget, this.maxScroll));
    }

    /**
     * update() ကို Three.js ရဲ့ animate loop ထဲမှာ ခေါ်သုံးရပါမယ်။
     */
    update() {
        /**
         * LERP Calculation:
         * လက်ရှိ Scroll ကနေ Target ဆီကို ဖြည်းဖြည်းချင်း လိုက်သွားမယ်။
         * ဒါမှ Tunnel ထဲမှာ Cinematic ဖြစ်ဖြစ် လျှောတိုက်ဝင်သွားမှာပါ။
         */
        const diff = this.scrollTarget - this.currentScroll;
        this.currentScroll += diff * this.lerpFactor;

        // တန်ဖိုး အရမ်းသေးသွားရင် Target နဲ့ တစ်ထပ်တည်း ထားလိုက်မယ် (Optimization)
        if (Math.abs(diff) < 0.01) {
            this.currentScroll = this.scrollTarget;
        }

        return this.currentScroll;
    }

    reset() {
        this.scrollTarget = 0;
        this.currentScroll = 0;
    }
}