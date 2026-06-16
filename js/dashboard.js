/* ==========================================================================
   APPLICATION LOGIC FOR KSHATRIYA MEWADA RAJPUT PARIVAR - USER DASHBOARD
   ========================================================================== */

// Global State
let currentLang = sessionStorage.getItem('preferredLang') || 'en';
let isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

// Initial Load Handler
document.addEventListener("DOMContentLoaded", () => {
    // 1. Session Auth Guard check
    if (!isLoggedIn) {
        const guard = document.getElementById("guard-overlay");
        if (guard) {
            guard.style.display = "flex";
        }
        return; // Prevent running other animations / scripts if blocked
    }

    // 2. Initialise Lucide Icons
    lucide.createIcons();

    // 3. Load dynamic stats count (retrieve from sessionStorage if incremented on profiles page)
    let interestsCountVal = parseInt(sessionStorage.getItem('interestsCount')) || 28;
    const countValElement = document.getElementById("interests-count-val");
    if (countValElement) {
        countValElement.innerText = interestsCountVal;
    }

    // 4. Apply language settings
    applyLanguage(currentLang, false);

    // 5. Populate Bio-Data Preview initially
    updateBioDataPreview();
});

// ============================================
// PROFILE FORM & BIO-DATA PREVIEWER
// ============================================
function updateBioDataPreview() {
    // Guard check
    if (!isLoggedIn) return;

    // Collect Inputs
    const fullName = document.getElementById("bio-fullname").value || "Kunwar Arjun Mewada";
    const dob = document.getElementById("bio-dob").value;
    const height = document.getElementById("bio-height").value;
    const gotraSelf = document.getElementById("bio-gotra-self").value || "Mewada";
    const gotraMother = document.getElementById("bio-gotra-mother").value || "Rathore";
    const education = document.getElementById("bio-education").value || "B.Tech Computer Science";
    const profession = document.getElementById("bio-profession").value || "Software Engineer";
    const village = document.getElementById("bio-village").value || "Gogunda, Udaipur";
    const contact = document.getElementById("bio-contact").value || "+91 98765 43210";

    // Format Date of Birth nicely
    let formattedDob = dob;
    if (dob) {
        const dateObj = new Date(dob);
        if (!isNaN(dateObj.getTime())) {
            const day = dateObj.getDate();
            const year = dateObj.getFullYear();
            
            const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthsHi = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
            
            const monthText = currentLang === 'hi' ? monthsHi[dateObj.getMonth()] : monthsEn[dateObj.getMonth()];
            formattedDob = `${day} ${monthText} ${year}`;
        }
    } else {
        formattedDob = currentLang === 'hi' ? "12 अप्रैल 1999" : "12 April 1999";
    }

    // Update preview card text nodes
    document.getElementById("prev-name").innerText = fullName;
    document.getElementById("prev-dob").innerText = formattedDob;
    document.getElementById("prev-height").innerText = height;
    document.getElementById("prev-gotra-self").innerText = gotraSelf;
    document.getElementById("prev-gotra-mother").innerText = gotraMother;
    document.getElementById("prev-education").innerText = education;
    document.getElementById("prev-profession").innerText = profession;
    document.getElementById("prev-village").innerText = village;
    document.getElementById("prev-contact").innerText = contact;

    // Check gender of current user state (Mocking photo swap on name/gotra values)
    const previewAvatar = document.getElementById("preview-avatar");
    if (previewAvatar) {
        if (fullName.includes("Baisa") || fullName.includes("Priya") || fullName.includes("Sunita") || fullName.includes("Meera")) {
            previewAvatar.src = "https://picsum.photos/seed/bride-avatar/200/200.jpg";
        } else {
            previewAvatar.src = "https://picsum.photos/seed/arjun-singh/200/200.jpg";
        }
    }
}

function saveProfileChanges() {
    showToast(currentLang === 'hi' ? 'परिवर्तन सफलतापूर्वक सहेजे गए!' : 'Profile details saved successfully!', 'success');
}

function printBioData() {
    showToast(currentLang === 'hi' ? 'बायो-डेटा प्रिंट संवाद खोला जा रहा है...' : 'Opening Bio-Data print dialogue...', 'success');
    setTimeout(() => {
        window.print();
    }, 500);
}

// ============================================
// BILINGUAL LANGUAGE SWITCHER
// ============================================
function applyLanguage(lang, showToastNotification = true) {
    currentLang = lang;
    sessionStorage.setItem('preferredLang', lang);

    // Toggle active class on header buttons
    const enBtn = document.getElementById("lang-en-btn");
    const hiBtn = document.getElementById("lang-hi-btn");
    if (enBtn && hiBtn) {
        if (lang === 'hi') {
            enBtn.classList.remove("active");
            hiBtn.classList.add("active");
            document.body.classList.add("lang-hi");
        } else {
            hiBtn.classList.remove("active");
            enBtn.classList.add("active");
            document.body.classList.remove("lang-hi");
        }
    }

    // Translate standard static texts
    document.querySelectorAll('[data-en]').forEach(el => {
        const textEn = el.getAttribute('data-en');
        const textHi = el.getAttribute('data-hi');
        el.innerText = lang === 'hi' ? textHi : textEn;
    });

    // Re-render Bio-Data Preview for Date formatting update
    updateBioDataPreview();

    // Trigger toast notification
    if (showToastNotification) {
        const toastMsg = lang === 'hi' ? 'भाषा बदलकर हिंदी कर दी गई है।' : 'Language switched to English.';
        showToast(toastMsg, 'info');
    }
}

function toggleLanguage(lang) {
    applyLanguage(lang, true);
}

// ============================================
// MOBILE NAVIGATION DRAWER
// ============================================
function toggleMobileMenu() {
    const drawer = document.getElementById("mobile-drawer");
    if (drawer) {
        drawer.classList.toggle("active");
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-triangle';

    toast.innerHTML = `
        <i data-lucide="${iconName}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    lucide.createIcons({ attrs: { class: 'toast-icon' } });

    setTimeout(() => {
        toast.style.animation = 'toast-slide-in 0.3s ease-out reverse forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3200);
}

// ============================================
// AUTH ACTIONS
// ============================================
function handleLogout() {
    sessionStorage.removeItem('isLoggedIn');
    showToast(currentLang === 'hi' ? 'लॉग आउट किया जा रहा है...' : 'Logging out...', 'info');
    setTimeout(() => {
        window.location.href = "index.html";
    }, 800);
}
