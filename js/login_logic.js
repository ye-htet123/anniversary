document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form');
    const errorMsg = document.getElementById('error-message');
    const loginCard = document.querySelector('.glass-card');

    // --- CONFIGURATION: SET YOUR REAL DETAILS HERE ---
    const SECRETS = {
        anniversary: "2026-03-28",  // Format: YYYY-MM-DD
        bfNick: "mg",               // Case-insensitive
        gfNick: "thae"              // Case-insensitive
    };

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get values from inputs
        const inputAnni = document.getElementById('anniversary').value;
        const inputBfNick = document.getElementById('bf-nick').value.trim().toLowerCase();
        const inputGfNick = document.getElementById('gf-nick').value.trim().toLowerCase();

        // Validation Logic
        const isAnniCorrect = inputAnni === SECRETS.anniversary;
        const isBfNickCorrect = inputBfNick === SECRETS.bfNick;
        const isGfNickCorrect = inputGfNick === SECRETS.gfNick;

        if (isAnniCorrect && isBfNickCorrect && isGfNickCorrect) {
            // SUCCESS: Play a small transition effect
            errorMsg.classList.add('hidden');
            const btn = document.getElementById('enter-btn');

            // --- HEART BUTTON VISUAL FIX ---
            // Heart တစ်ခုလုံး အစိမ်းရောင်ပြောင်းဖို့ Pseudo-elements တွေကိုပါ Style ထည့်တာပါ
            btn.style.background = "#ea0b5c";
            btn.style.animation = "none"; // Beating ကို ခဏရပ်လိုက်မယ်
            btn.style.transform = "rotate(-45deg) scale(1.3)"; // နည်းနည်းလေး ကြီးလာအောင်လုပ်မယ်

            // Heart ရဲ့ အဖုလေးနှစ်ဖက် (::before, ::after) ကိုပါ အစိမ်းရောင်ပြောင်းပေးခြင်း
            const heartFix = document.createElement('style');
            heartFix.innerHTML = `#enter-btn::before, #enter-btn::after { background: #ea0b5c !important; }`;
            document.head.appendChild(heartFix);

            // Change Heart Icon to Checkmark (✔)
            const span = btn.querySelector('span');
            if (span) {
                span.innerHTML = "✔";
            } else {
                // Span မရှိခဲ့ရင် စာသားထည့်မယ်
                btn.innerHTML = "✔";
            }

            // Small delay for the "feeling" of unlocking
            setTimeout(() => {
                window.location.href = 'main.html';
            }, 1000);

        } else {
            // FAILURE: Show error and shake the card
            errorMsg.classList.remove('hidden');
            loginCard.classList.add('shake');

            // Remove shake class after animation finishes so it can be re-added
            setTimeout(() => {
                loginCard.classList.remove('shake');
            }, 500);
        }
    });
});