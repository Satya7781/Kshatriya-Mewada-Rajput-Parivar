/* ==========================================================================
   APPLICATION LOGIC FOR KSHATRIYA MEWADA RAJPUT PARIVAR - USER DASHBOARD
   ========================================================================== */

// Global State
let currentLang = sessionStorage.getItem('preferredLang') || 'en';
let isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

// Mock Interests Dataset
const mockInterests = [
    {
        id: 1,
        name: { en: "Baisa Priya Singh", hi: "बाइसा प्रिया सिंह" },
        age: 23,
        gotraSelf: { en: "Rathore", hi: "राठौड़" },
        gotraMother: { en: "Sehore", hi: "सीहोर" },
        district: { en: "Indore", hi: "इंदौर" },
        image: "https://picsum.photos/seed/priya/100/100.jpg"
    },
    {
        id: 2,
        name: { en: "Baisa Meera Mewada", hi: "बाइसा मीरा मेवाड़ा" },
        age: 22,
        gotraSelf: { en: "Sisodiya", hi: "सिसोदिया" },
        gotraMother: { en: "Dod", hi: "डोड" },
        district: { en: "Bhopal", hi: "भोपाल" },
        image: "https://picsum.photos/seed/meera/100/100.jpg"
    },
    {
        id: 3,
        name: { en: "Baisa Pooja Rajput", hi: "बाइसा पूजा राजपूत" },
        age: 24,
        gotraSelf: { en: "Chouhan", hi: "चौहान" },
        gotraMother: { en: "Parmar", hi: "परमार" },
        district: { en: "Rajgarh", hi: "राजगढ़" },
        image: "https://picsum.photos/seed/pooja/100/100.jpg"
    }
];

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

    // 3. Load dynamic stats count (retrieve from sessionStorage if incremented)
    let interestsCountVal = parseInt(sessionStorage.getItem('interestsCount')) || 28;
    const countValElement = document.getElementById("interests-count-val");
    if (countValElement) {
        countValElement.innerText = interestsCountVal;
    }

    // 4. Populate Form fields from Session storage (Registered user or default user)
    populateFormFromSession();

    // 5. Apply language settings
    applyLanguage(currentLang, false);

    // 6. Populate Bio-Data Preview initially
    updateBioDataPreview();

    // 7. Render Received Interests
    renderInterests();

    // 8. Initialize photo drag and drop listener
    initDragAndDrop();
});

// ============================================
// PROFILE FORM & BIO-DATA PREVIEWER
// ============================================
function populateFormFromSession() {
    const currentUserStr = sessionStorage.getItem('currentUser');
    if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        
        const getVal = (field) => {
            if (!field) return "";
            if (typeof field === 'object') {
                return field[currentLang] || field['en'] || "";
            }
            return field;
        };

        if (document.getElementById("bio-fullname")) {
            document.getElementById("bio-fullname").value = getVal(currentUser.name);
        }
        if (document.getElementById("bio-dob")) {
            let dobVal = currentUser.dob;
            if (dobVal && typeof dobVal === 'object') {
                dobVal = dobVal.en;
            }
            document.getElementById("bio-dob").value = dobVal || "";
        }
        if (document.getElementById("bio-height") && currentUser.height) {
            document.getElementById("bio-height").value = currentUser.height;
        }
        if (document.getElementById("bio-gender") && currentUser.gender) {
            document.getElementById("bio-gender").value = currentUser.gender;
        }
        if (document.getElementById("bio-district") && currentUser.district) {
            document.getElementById("bio-district").value = getVal(currentUser.district);
        }
        if (document.getElementById("bio-gotra-self") && currentUser.gotraSelf) {
            document.getElementById("bio-gotra-self").value = getVal(currentUser.gotraSelf);
        }
        if (document.getElementById("bio-gotra-mother") && currentUser.gotraMother) {
            document.getElementById("bio-gotra-mother").value = getVal(currentUser.gotraMother);
        }
        if (document.getElementById("bio-education") && currentUser.education) {
            document.getElementById("bio-education").value = getVal(currentUser.education);
        }
        if (document.getElementById("bio-profession") && currentUser.profession) {
            document.getElementById("bio-profession").value = getVal(currentUser.profession);
        }
        if (document.getElementById("bio-village")) {
            const villageVal = currentUser.address ? getVal(currentUser.address) : (currentUser.village || "");
            document.getElementById("bio-village").value = villageVal;
        }
        if (document.getElementById("bio-contact")) {
            document.getElementById("bio-contact").value = currentUser.phone || currentUser.contact || "";
        }
        
        // Sync header name & avatar
        const dispName = getVal(currentUser.name);
        const dispImage = currentUser.image || "https://picsum.photos/seed/arjun-singh/100/100.jpg";
        
        document.querySelectorAll(".user-chip-avatar").forEach(img => {
            img.src = dispImage;
        });
        document.querySelectorAll(".user-chip-name").forEach(span => {
            span.innerText = dispName;
            span.setAttribute('data-en', currentUser.name['en'] || dispName);
            span.setAttribute('data-hi', currentUser.name['hi'] || dispName);
        });
        
        const previewAvatar = document.getElementById("preview-avatar");
        if (previewAvatar && currentUser.image) {
            previewAvatar.src = currentUser.image;
        }
    }
}

function updateBioDataPreview() {
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

    // Check gender/image
    const previewAvatar = document.getElementById("preview-avatar");
    if (previewAvatar) {
        const currentUserStr = sessionStorage.getItem('currentUser');
        if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            if (currentUser.image) {
                previewAvatar.src = currentUser.image;
                return;
            }
        }
        if (fullName.includes("Baisa") || fullName.includes("Priya") || fullName.includes("Sunita") || fullName.includes("Meera")) {
            previewAvatar.src = "https://picsum.photos/seed/bride-avatar/200/200.jpg";
        } else {
            previewAvatar.src = "https://picsum.photos/seed/arjun-singh/200/200.jpg";
        }
    }
}

function saveProfileChanges() {
    if (!isLoggedIn) return;

    const fullName = document.getElementById("bio-fullname").value.trim();
    const dob = document.getElementById("bio-dob").value;
    const height = document.getElementById("bio-height").value;
    const gender = document.getElementById("bio-gender").value;
    const district = document.getElementById("bio-district").value;
    const gotraSelf = document.getElementById("bio-gotra-self").value.trim();
    const gotraMother = document.getElementById("bio-gotra-mother").value.trim();
    const education = document.getElementById("bio-education").value.trim();
    const profession = document.getElementById("bio-profession").value.trim();
    const village = document.getElementById("bio-village").value.trim();
    const contact = document.getElementById("bio-contact").value.trim();

    if (!fullName || !gotraSelf) {
        showToast(currentLang === 'hi' ? 'कृपया नाम और स्वयं गोत्र भरें।' : 'Please fill Name and Self Gotra.', 'error');
        return;
    }

    const currentUserStr = sessionStorage.getItem('currentUser');
    if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        
        currentUser.name = { en: fullName, hi: fullName };
        currentUser.shortName = { en: fullName.split(" ")[0], hi: fullName.split(" ")[0] };
        currentUser.dob = { en: dob, hi: dob };
        currentUser.gender = gender;
        currentUser.height = height;
        currentUser.district = { en: district, hi: district };
        currentUser.gotraSelf = { en: gotraSelf, hi: gotraSelf };
        currentUser.gotraMother = { en: gotraMother, hi: gotraMother };
        currentUser.education = { en: education, hi: education };
        currentUser.profession = { en: profession, hi: profession };
        currentUser.address = { en: village, hi: village };
        currentUser.phone = contact;
        currentUser.image = document.getElementById("preview-avatar").src;

        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Sync with registeredUser if same phone
        const registeredUserStr = sessionStorage.getItem('registeredUser');
        if (registeredUserStr) {
            const registeredUser = JSON.parse(registeredUserStr);
            if (registeredUser.phone === currentUser.phone || registeredUser.phone === contact) {
                Object.assign(registeredUser, currentUser);
                sessionStorage.setItem('registeredUser', JSON.stringify(registeredUser));
            }
        }

        // Update name in header
        document.querySelectorAll(".user-chip-name").forEach(span => {
            span.innerText = fullName;
            span.setAttribute('data-en', fullName);
            span.setAttribute('data-hi', fullName);
        });

        // Update preview card
        updateBioDataPreview();

        showToast(currentLang === 'hi' ? 'परिवर्तन सफलतापूर्वक सहेजे गए!' : 'Profile details saved successfully!', 'success');
    }
}

function printBioData() {
    showToast(currentLang === 'hi' ? 'बायो-डेटा प्रिंट संवाद खोला जा रहा है...' : 'Opening Bio-Data print dialogue...', 'success');
    setTimeout(() => {
        window.print();
    }, 500);
}

// ============================================
// PROFILE PHOTO UPLOADER (DRAG & DROP)
// ============================================
function initDragAndDrop() {
    const dropZone = document.getElementById("dashboard-photo-zone");
    if (!dropZone) return;

    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const input = document.getElementById("dashboard-photo");
            if (input) {
                const dt = new DataTransfer();
                dt.items.add(file);
                input.files = dt.files;
            }
            handlePhotoFile(file);
        }
    });
}

function handleDashboardPhotoSelect(event) {
    const file = event.target.files[0];
    if (file) {
        handlePhotoFile(file);
    }
}

function handlePhotoFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const photoData = e.target.result;
        
        // Update live preview card avatar
        const previewAvatar = document.getElementById("preview-avatar");
        if (previewAvatar) {
            previewAvatar.src = photoData;
        }
        
        // Update header user-chip avatar
        document.querySelectorAll(".user-chip-avatar").forEach(img => {
            img.src = photoData;
        });

        // Update currentUser image in sessionStorage
        const currentUserStr = sessionStorage.getItem('currentUser');
        if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            currentUser.image = photoData;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Sync registeredUser if it exists
            const registeredUserStr = sessionStorage.getItem('registeredUser');
            if (registeredUserStr) {
                const registeredUser = JSON.parse(registeredUserStr);
                if (registeredUser.phone === currentUser.phone) {
                    registeredUser.image = photoData;
                    sessionStorage.setItem('registeredUser', JSON.stringify(registeredUser));
                }
            }
        }
        showToast(currentLang === 'hi' ? 'प्रोफ़ाइल फोटो अपडेट की गई!' : 'Profile photo updated!', 'success');
    };
    reader.readAsDataURL(file);
}

// ============================================
// RECEIVED INTERESTS MANAGEMENT
// ============================================
function renderInterests() {
    const container = document.getElementById("interests-container-list");
    if (!container) return;

    if (mockInterests.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 32px; background: var(--color-white); border: 1.5px solid var(--color-gold-light); border-radius: var(--border-radius-md); font-weight: 600; color: var(--color-text-muted);">
                <i data-lucide="heart-off" style="width: 36px; height: 36px; color: var(--color-gold); margin-bottom: 12px; display: inline-block;"></i>
                <p data-en="No pending interests received." data-hi="कोई लंबित रुचि प्राप्त नहीं हुई है।">No pending interests received.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    let html = "";
    mockInterests.forEach(item => {
        const nameVal = item.name[currentLang] || item.name['en'];
        const gotraSelfVal = item.gotraSelf[currentLang] || item.gotraSelf['en'];
        const gotraMotherVal = item.gotraMother[currentLang] || item.gotraMother['en'];
        const districtVal = item.district[currentLang] || item.district['en'];

        const detailsText = currentLang === 'hi'
            ? `${item.age} वर्ष · गोत्र: ${gotraSelfVal} (माता: ${gotraMotherVal}) · जिला: ${districtVal}`
            : `${item.age} Yrs · Gotra: ${gotraSelfVal} (Mother: ${gotraMotherVal}) · Dist: ${districtVal}`;

        html += `
            <div class="interest-item-card" id="interest-card-${item.id}" style="transition: all 0.3s ease;">
                <div style="display: flex; align-items: center; gap: 16px; text-align: left;">
                    <img src="${item.image}" alt="${nameVal}" style="width: 56px; height: 56px; border-radius: 50%; border: 2px solid var(--color-gold); object-fit: cover; flex-shrink: 0;">
                    <div class="interest-user-info">
                        <span class="interest-username">${nameVal}</span>
                        <div class="interest-details">${detailsText}</div>
                    </div>
                </div>
                <div class="interest-actions" id="interest-actions-${item.id}">
                    <button class="btn-interest btn-interest-accept" onclick="acceptInterest(${item.id}, '${nameVal}')">
                        <i data-lucide="check"></i>
                        <span data-en="Accept" data-hi="स्वीकार करें">Accept</span>
                    </button>
                    <button class="btn-interest btn-interest-decline" onclick="declineInterest(${item.id})">
                        <i data-lucide="x"></i>
                        <span data-en="Decline" data-hi="अस्वीकार करें">Decline</span>
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    lucide.createIcons();
}

function acceptInterest(id, name) {
    const msg = currentLang === 'hi'
        ? `${name} की रुचि स्वीकार की गई! परिवार का संपर्क विवरण साझा किया गया।`
        : `Interest accepted from ${name}! Family contact details shared.`;
    showToast(msg, 'success');

    const actionsDiv = document.getElementById(`interest-actions-${id}`);
    if (actionsDiv) {
        actionsDiv.innerHTML = `
            <button class="btn-interest btn-interest-connected">
                <i data-lucide="check-circle-2"></i>
                <span data-en="Connected" data-hi="जुड़ गए">Connected</span>
            </button>
        `;
        lucide.createIcons();
    }

    let countVal = parseInt(sessionStorage.getItem('interestsCount')) || 28;
    countVal += 1;
    sessionStorage.setItem('interestsCount', countVal);
    const countValElement = document.getElementById("interests-count-val");
    if (countValElement) {
        countValElement.innerText = countVal;
    }
}

function declineInterest(id) {
    const card = document.getElementById(`interest-card-${id}`);
    if (card) {
        card.style.opacity = "0";
        card.style.transform = "scale(0.95)";
        
        const index = mockInterests.findIndex(item => item.id === id);
        if (index > -1) {
            mockInterests.splice(index, 1);
        }

        setTimeout(() => {
            card.remove();
            if (mockInterests.length === 0) {
                renderInterests();
            }
        }, 300);

        showToast(currentLang === 'hi' ? 'अनुरोध अस्वीकार कर दिया गया।' : 'Interest request declined.', 'info');
    }
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

    // Re-render Received Interests
    renderInterests();

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
