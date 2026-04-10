/**
 * EMPIRE OF SAKURA - OFFICIAL CORE SCRIPT
 * Combined: Sakura, Discord Sync, Reveal Anim, Custom Cursor
 */

// --- 1. KONFIGURASI ---
const SERVER_ID = "1331558582394814474";
const REFRESH_RATE = 20000; // 20 Detik

// --- 2. DISCORD DATA SYNC (LIVE STATUS & AVATARS) ---
async function syncEmpireData() {
    try {
        const response = await fetch(`https://discord.com/api/guilds/1331558582394814474/widget.json`);
        if (!response.ok) return;
        const rawData = await response.json();

        // Fitur Anti-Double (Saring member duplikat)
        const uniqueMembers = [];
        const seenNames = new Set();
        rawData.members.forEach(m => {
            const name = m.username.toLowerCase().trim();
            if (!seenNames.has(name)) {
                seenNames.add(name);
                uniqueMembers.push(m);
            }
        });

        // Update Angka Online
        const onlineEl = document.getElementById('online-count');
        if (onlineEl) onlineEl.innerText = rawData.presence_count.toLocaleString();

        const wargaEl = document.getElementById('total-count');
        if (wargaEl) wargaEl.innerText = "Active"; 

        // Update Foto & Status Staff
        const avatars = document.querySelectorAll('.discord-avatar');
        avatars.forEach(img => {
            const targetName = img.getAttribute('data-discord-username')?.toLowerCase().trim();
            if (!targetName) return;

            const member = uniqueMembers.find(m => m.username.toLowerCase().trim() === targetName);

            if (member) {
                img.src = member.avatar_url;
                img.classList.remove('grayscale');
                img.style.opacity = "1";
                
                const card = img.closest('.authority-card') || img.closest('.glass-card');
                const dot = card ? card.querySelector('.status-dot') : null;
                if(dot) {
                    dot.style.backgroundColor = "#22c55e"; 
                    dot.classList.add('animate-pulse');
                }
            } else {
                img.classList.add('grayscale');
                img.style.opacity = "0.5";
                
                const card = img.closest('.authority-card') || img.closest('.glass-card');
                const dot = card ? card.querySelector('.status-dot') : null;
                if(dot) {
                    dot.style.backgroundColor = "#374151";
                    dot.classList.remove('animate-pulse');
                }
            }
            const footerOnlineEl = document.getElementById('online-count-footer');
            if (footerOnlineEl) footerOnlineEl.innerText = rawData.presence_count;
        });
    } catch (e) { console.error("Discord Sync Error:", e); }
}

// --- 3. SAKURA FALLING ANIMATION (VERSI ENTENG) ---
function startSakura() {
    const container = document.getElementById('sakura-container'); 
    if(!container) return;

    // Jarangin intervalnya biar gak numpuk (700ms - 800ms itu udah pas banget)
    setInterval(() => {
        // Cek jumlah kelopak, kalau udah lebih dari 15, jangan bikin lagi (Limitasi)
        if (container.children.length > 15) return; 

        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        
        const size = Math.random() * 6 + 4 + 'px'; // Ukuran diperkecil dikit biar tajam
        const duration = Math.random() * 4 + 4; // Jatuh lebih cepet (4s - 8s)
        
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.width = size;
        petal.style.height = size;
        petal.style.opacity = Math.random() * 0.6 + 0.2; // Random transparansi
        petal.style.animationDuration = duration + 's';
        
        container.appendChild(petal);
        
        // Hapus lebih cepet sesuai durasi jatuh + 1 detik buffer
        setTimeout(() => petal.remove(), (duration + 1) * 1000);
    }, 700); 
}

// --- 4. REVEAL ON SCROLL ANIMATION ---
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            el.classList.add("active");
        }
    });
}

// --- 5. CUSTOM CURSOR (SMOOTH LERP) ---
function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    if(!dot || !outline) return;

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.25;
        outlineY += (mouseY - outlineY) * 0.25;
        outline.style.left = outlineX + 'px';
        outline.style.top = outlineY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect
    const interactiveEls = document.querySelectorAll('a, button, .authority-card, .moment-item');
    interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Click effect
    document.addEventListener('mousedown', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(2)';
        outline.style.transform = 'translate(-50%, -50%) scale(0.5)';
    });
    document.addEventListener('mouseup', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
        outline.style.transform = 'translate(-50%, -50%) scale(1)';
    });
}

// --- 6. LOADER ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
    }, 1000);
});

// --- 7. IMPERIAL CLOCK (JST) ---
function updateClock() {
    const clockEl = document.getElementById('imperial-clock');
    if (!clockEl) return;

    const now = new Date();
    // Format 24 jam yang rapi
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    clockEl.innerText = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

// --- 8. INITIALIZATION (RUN EVERYTHING) ---
document.addEventListener('DOMContentLoaded', () => {
    syncEmpireData();
    startSakura();
    initCustomCursor();
    reveal(); // Jalankan sekali buat ngecek elemen yang udah di layar
    
    window.addEventListener("scroll", reveal);
    setInterval(syncEmpireData, REFRESH_RATE);
});
