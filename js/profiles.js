/* ==========================================================================
   APPLICATION LOGIC FOR KSHATRIYA MEWADA RAJPUT PARIVAR - PROFILES SEARCH
   ========================================================================== */

// Global State
let currentLang = sessionStorage.getItem('preferredLang') || 'en';
let isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

// Official Matrimonial Profiles Dataset (11 Grooms)
const matrimonialProfiles = [
    {
        id: 1,
        name: { en: "Sandeep Mewada", hi: "संदीप मेवाड़ा" },
        shortName: { en: "Sandeep M.", hi: "संदीप एम." },
        gender: "Groom",
        gotraSelf: { en: "Dod", hi: "डोड" },
        gotraMother: { en: "Baghela", hi: "बाघेला" },
        age: 25,
        height: "5'8\"",
        education: { en: "Graduate", hi: "स्नातक" },
        profession: { en: "-", hi: "-" },
        district: { en: "Bhopal", hi: "भोपाल" },
        community: "Mewada",
        verified: true,
        image: "images/sandeep.jpeg",
        fatherName: { en: "Ramdayal Mewada", hi: "रामदयाल मेवाड़ा" },
        motherName: { en: "Antar Bai", hi: "अंतर बाई" },
        address: { en: "-", hi: "-" },
        contact: "7970094797",
        brothers: 0,
        sisters: 4,
        familyType: { en: "-", hi: "-" },
        parentsOccupation: { en: "Farmer", hi: "किसान" },
        dob: { en: "-", hi: "-" }
    },
    {
        id: 2,
        name: { en: "Sarvesh Rajput", hi: "सर्वेश राजपूत" },
        shortName: { en: "Sarvesh R.", hi: "सर्वेश आर." },
        gender: "Groom",
        gotraSelf: { en: "Dod", hi: "डोड" },
        gotraMother: { en: "Rathore", hi: "राठौड़" },
        age: 23,
        height: "5'7\"",
        education: { en: "Second Year", hi: "द्वितीय वर्ष" },
        profession: { en: "Bajaj Collection Agent", hi: "बजाज कलेक्शन एजेंट" },
        district: { en: "Bhopal", hi: "भोपाल" },
        community: "Rajput",
        verified: true,
        image: "images/sarvesh.jpeg",
        fatherName: { en: "Late Kailash Singh", hi: "स्वर्गीय कैलाश सिंह" },
        motherName: { en: "Ramshree Bai", hi: "रामश्री बाई" },
        address: { en: "Phanda Kalan, Bhopal", hi: "फंदा कलां, भोपाल" },
        contact: "6260134370",
        brothers: 3,
        sisters: 1,
        familyType: { en: "Joint Family", hi: "संयुक्त परिवार" },
        parentsOccupation: { en: "Mother: Housewife", hi: "माता: गृहणी" },
        dob: { en: "-", hi: "-" }
    },
    {
        id: 3,
        name: { en: "Hirdesh Mewada", hi: "हिरदेश मेवाड़ा" },
        shortName: { en: "Hirdesh M.", hi: "हिरदेश एम." },
        gender: "Groom",
        gotraSelf: { en: "Hada", hi: "हाड़ा" },
        gotraMother: { en: "Dod", hi: "डोड" },
        age: 22,
        height: "5'9\"",
        education: { en: "12th Pass", hi: "12वीं पास" },
        profession: { en: "Student", hi: "छात्र" },
        district: { en: "Sehore", hi: "सीहोर" },
        community: "Mewada",
        verified: true,
        image: "images/hirdesh.jpeg",
        fatherName: { en: "Laxmi Narayan Mewada", hi: "लक्ष्मीनारायण मेवाड़ा" },
        motherName: { en: "Anusuiya Mewada", hi: "अनुसुइया मेवाड़ा" },
        address: { en: "Dhamaniya", hi: "धमानिया" },
        contact: "7828767625",
        brothers: 0,
        sisters: 1,
        familyType: { en: "Joint Family", hi: "संयुक्त परिवार" },
        parentsOccupation: { en: "Father: Farmer, Mother: Housewife", hi: "पिता: किसान, माता: गृहणी" },
        dob: { en: "-", hi: "-" }
    },
    {
        id: 4,
        name: { en: "Vikash Mewada", hi: "विकास मेवाड़ा" },
        shortName: { en: "Vikash M.", hi: "विकास एम." },
        gender: "Groom",
        gotraSelf: { en: "Baghela", hi: "बाघेला" },
        gotraMother: { en: "Shankla", hi: "शंखला" },
        age: 26,
        height: "5'10\"",
        education: { en: "Graduate", hi: "स्नातक" },
        profession: { en: "Podcast Producer", hi: "पॉडकास्ट प्रोड्यूसर" },
        district: { en: "Bhopal", hi: "भोपाल" },
        community: "Mewada",
        verified: true,
        image: "images/vikash.jpeg",
        fatherName: { en: "Ghisilal Mewada", hi: "घिसीलाल मेवाड़ा" },
        motherName: { en: "Rukmani Bai", hi: "रुक्मणी बाई" },
        address: { en: "-", hi: "-" },
        contact: "7089729322",
        brothers: 2,
        sisters: 0,
        familyType: { en: "-", hi: "-" },
        parentsOccupation: { en: "Farmer", hi: "किसान" },
        dob: { en: "-", hi: "-" }
    },
    {
        id: 5,
        name: { en: "Arpit Rajput", hi: "अर्पित राजपूत" },
        shortName: { en: "Arpit R.", hi: "अर्पित आर." },
        gender: "Groom",
        gotraSelf: { en: "Dod", hi: "डोड" },
        gotraMother: { en: "Rathore", hi: "राठौड़" },
        age: 21,
        height: "5'8\"",
        education: { en: "12th Pass", hi: "12वीं पास" },
        profession: { en: "Student", hi: "छात्र" },
        district: { en: "Bhopal", hi: "भोपाल" },
        community: "Rajput",
        verified: true,
        image: "images/arpit.jpeg",
        fatherName: { en: "Radheshyam Rajput", hi: "राधेश्याम राजपूत" },
        motherName: { en: "Parvati Rajput", hi: "पार्वती राजपूत" },
        address: { en: "Phanda Kalan", hi: "फंदा कलां" },
        contact: "6267534211",
        brothers: 1,
        sisters: 0,
        familyType: { en: "Joint Family", hi: "संयुक्त परिवार" },
        parentsOccupation: { en: "Father: Farmer, Mother: Housewife", hi: "पिता: किसान, माता: गृहणी" },
        dob: { en: "-", hi: "-" }
    },
    {
        id: 6,
        name: { en: "Rajkumar Mewada", hi: "राजकुमार मेवाड़ा" },
        shortName: { en: "Rajkumar M.", hi: "राजकुमार एम." },
        gender: "Groom",
        gotraSelf: { en: "Pipada", hi: "पिपड़ा" },
        gotraMother: { en: "Kilodiya", hi: "किलोदिया" },
        age: 23,
        height: "5'7\"",
        education: { en: "12th Pass", hi: "12वीं पास" },
        profession: { en: "-", hi: "-" },
        district: { en: "Sehore", hi: "सीहोर" },
        community: "Mewada",
        verified: true,
        image: "images/rajkumar.jpeg",
        fatherName: { en: "Mohan Singh", hi: "मोहन सिंह" },
        motherName: { en: "Pushpa Bai", hi: "पुष्पा बाई" },
        address: { en: "Chhatri, Sehore", hi: "छत्री, सीहोर" },
        contact: "6266550727",
        brothers: 1,
        sisters: 3,
        familyType: { en: "6 Members", hi: "6 सदस्य" },
        parentsOccupation: { en: "-", hi: "-" },
        dob: { en: "12/07/2002", hi: "12/07/2002" }
    },
    {
        id: 7,
        name: { en: "Ankit Mewada", hi: "अंकित मेवाड़ा" },
        shortName: { en: "Ankit M.", hi: "अंकित एम." },
        gender: "Groom",
        gotraSelf: { en: "Dava", hi: "दावा" },
        gotraMother: { en: "Baghela", hi: "बाघेला" },
        age: 24,
        height: "5'9\"",
        education: { en: "-", hi: "-" },
        profession: { en: "-", hi: "-" },
        district: { en: "Sehore", hi: "सीहोर" },
        community: "Mewada",
        verified: true,
        image: "images/ankit.jpeg",
        fatherName: { en: "Ramcharan Mewada", hi: "रामचरण मेवाड़ा" },
        motherName: { en: "Singar Bai", hi: "सिंगार बाई" },
        address: { en: "-", hi: "-" },
        contact: "-",
        brothers: 1,
        sisters: 1,
        familyType: { en: "-", hi: "-" },
        parentsOccupation: { en: "Farmer", hi: "किसान" },
        dob: { en: "-", hi: "-" }
    },
    {
        id: 8,
        name: { en: "Animesh Mewada", hi: "अनिमेष मेवाड़ा" },
        shortName: { en: "Animesh M.", hi: "अनिमेष एम." },
        gender: "Groom",
        gotraSelf: { en: "Sisodiya", hi: "सिसोदिया" },
        gotraMother: { en: "Bordiya", hi: "बोरदिया" },
        age: 21,
        height: "5'11\"",
        education: { en: "B.Com (Computer), DCA, MBA (Pursuing)", hi: "बी.कॉम (कंप्यूटर), डीसीए, एमबीए (प्रगति पर)" },
        profession: { en: "Private Job", hi: "प्राइवेट जॉब" },
        district: { en: "Bhopal", hi: "भोपाल" },
        community: "Mewada",
        verified: true,
        image: "images/animesh.jpeg",
        fatherName: { en: "Sher Singh Mewada", hi: "शेर सिंह मेवाड़ा" },
        motherName: { en: "Rekha Mewada", hi: "रेखा मेवाड़ा" },
        address: { en: "Ratanpur, Bhopal", hi: "रतनपुर, भोपाल" },
        contact: "6263611436",
        brothers: 0,
        sisters: 1,
        familyType: { en: "Nuclear Family", hi: "एकाकी परिवार" },
        parentsOccupation: { en: "Father: Land & Dairy Business, Mother: Housewife", hi: "पिता: भूमि और डेयरी व्यवसाय, माता: गृहणी" },
        dob: { en: "27/04/2005", hi: "27/04/2005" }
    },
    {
        id: 9,
        name: { en: "Rohit Mewada", hi: "रोहित मेवाड़ा" },
        shortName: { en: "Rohit M.", hi: "रोहित एम." },
        gender: "Groom",
        gotraSelf: { en: "Pathariya", hi: "पथरिया" },
        gotraMother: { en: "Sisodiya", hi: "सिसोदिया" },
        age: 22,
        height: "5'10\"",
        education: { en: "Competitive Exam Aspirant", hi: "प्रतियोगी परीक्षा आकांक्षी" },
        profession: { en: "Student", hi: "छात्र" },
        district: { en: "Bhopal", hi: "भोपाल" },
        community: "Mewada",
        verified: true,
        image: "images/rohit.jpeg",
        fatherName: { en: "Kaluram Mewada", hi: "कालूराम मेवाड़ा" },
        motherName: { en: "Rekha Mewada", hi: "रेखा मेवाड़ा" },
        address: { en: "Phanda Kalan, Bhopal", hi: "फंदा कलां, भोपाल" },
        contact: "7400640496",
        brothers: "1 (Ajey)",
        sisters: "-",
        familyType: { en: "Joint Family", hi: "संयुक्त परिवार" },
        parentsOccupation: { en: "Father: Farmer", hi: "पिता: किसान" },
        dob: { en: "15/12/2003", hi: "15/12/2003" }
    },
    {
        id: 10,
        name: { en: "Deepak Mewada", hi: "दीपक मेवाड़ा" },
        shortName: { en: "Deepak M.", hi: "दीपक एम." },
        gender: "Groom",
        gotraSelf: { en: "Budhana", hi: "बुधाना" },
        gotraMother: { en: "Khadwad", hi: "खदवाड़" },
        age: 27,
        height: "5'8\"",
        education: { en: "Graduate", hi: "स्नातक" },
        profession: { en: "Private Job", hi: "प्राइवेट जॉब" },
        district: { en: "Bhopal", hi: "भोपाल" },
        community: "Mewada",
        verified: true,
        image: "images/deepak.jpeg",
        fatherName: { en: "Kumar Singh Mewada", hi: "कुमार सिंह मेवाड़ा" },
        motherName: { en: "Bhagwati Bai", hi: "भगवती बाई" },
        address: { en: "Phanda Kalan", hi: "फंदा कलां" },
        contact: "7415120791",
        brothers: "3 (Total 4)",
        sisters: 1,
        familyType: { en: "Joint Family", hi: "संयुक्त परिवार" },
        parentsOccupation: { en: "Farmer", hi: "किसान" },
        dob: { en: "-", hi: "-" }
    },
    {
        id: 11,
        name: { en: "Hritik Mewada", hi: "ऋतिक मेवाड़ा" },
        shortName: { en: "Hritik M.", hi: "ऋतिक एम." },
        gender: "Groom",
        gotraSelf: { en: "Bhati", hi: "भाटी" },
        gotraMother: { en: "Daba", hi: "दाबा" },
        age: 20,
        height: "5'9\"",
        education: { en: "12th Pass", hi: "12वीं पास" },
        profession: { en: "Student", hi: "छात्र" },
        district: { en: "Bhopal", hi: "भोपाल" },
        community: "Mewada",
        verified: true,
        image: "images/hritik.jpeg",
        fatherName: { en: "Bhagwan Singh", hi: "भगवान सिंह" },
        motherName: { en: "Bhuriya Bai", hi: "भूरिया बाई" },
        address: { en: "Phanda", hi: "फंदा" },
        contact: "9669753117",
        brothers: "1 (Kuldeep)",
        sisters: "1 (Aarti)",
        familyType: { en: "Nuclear Family", hi: "एकाकी परिवार" },
        parentsOccupation: { en: "Father: Farmer", hi: "पिता: किसान" },
        dob: { en: "09/07/2005", hi: "09/07/2005" }
    }
];

let activeFilteredList = [...matrimonialProfiles];

// Initialize on DOM Load
document.addEventListener("DOMContentLoaded", () => {
    // Icons init
    lucide.createIcons();

    // Setup Header & Grid based on login status
    applySessionStateUI();

    // Apply language on load
    applyLanguage(currentLang, false);
});

// ============================================
// SESSION STATE LAYOUT TOGGLING
// ============================================
function applySessionStateUI() {
    isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    // Header updates
    const guestActions = document.getElementById("guest-actions");
    const userActions = document.getElementById("user-actions");
    const navDashboard = document.getElementById("nav-dashboard-item");
    const footerDashboard = document.getElementById("footer-dashboard-item");

    // Mobile Drawer updates
    const mobileGuest = document.getElementById("mobile-guest-actions");
    const mobileUser = document.getElementById("mobile-user-actions");
    const mobileNavDashboard = document.getElementById("mobile-nav-dashboard");

    // Grid details notice
    const unlockedNotice = document.getElementById("unlocked-notice");

    if (isLoggedIn) {
        if (guestActions) guestActions.style.display = "none";
        if (userActions) userActions.style.display = "flex";
        if (navDashboard) navDashboard.style.display = "block";
        if (footerDashboard) footerDashboard.style.display = "block";

        if (mobileGuest) mobileGuest.style.display = "none";
        if (mobileUser) mobileUser.style.display = "block";
        if (mobileNavDashboard) mobileNavDashboard.style.display = "block";

        if (unlockedNotice) unlockedNotice.style.display = "flex";
    } else {
        if (guestActions) guestActions.style.display = "flex";
        if (userActions) userActions.style.display = "none";
        if (navDashboard) navDashboard.style.display = "none";
        if (footerDashboard) footerDashboard.style.display = "none";

        if (mobileGuest) mobileGuest.style.display = "block";
        if (mobileUser) mobileUser.style.display = "none";
        if (mobileNavDashboard) mobileNavDashboard.style.display = "none";

        if (unlockedNotice) unlockedNotice.style.display = "none";
    }

    renderProfilesGrid();
}

// ============================================
// RENDER PROFILES GRID (SECURE ACCESS LEVEL)
// ============================================
function renderProfilesGrid() {
    const container = document.getElementById("profiles-grid-container");
    if (!container) return;

    if (activeFilteredList.length === 0) {
        const noResultsHtml = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--color-white); border: 2px dashed var(--color-gold); border-radius: var(--border-radius-md);">
                <i data-lucide="users-round" style="width: 48px; height: 48px; color: var(--color-maroon); margin-bottom: 12px;"></i>
                <h4 style="font-size: 20px; color: var(--color-maroon);">
                    ${currentLang === 'hi' ? 'कोई मिलान नहीं मिला' : 'No Matches Found'}
                </h4>
                <p style="color: var(--color-text-muted);">
                    ${currentLang === 'hi' ? 'कृपया अपनी फ़िल्टर प्राथमिकताओं का विस्तार करें।' : 'Try expanding your search filter criteria.'}
                </p>
            </div>
        `;
        container.innerHTML = noResultsHtml;
        lucide.createIcons();
        return;
    }

    let html = "";
    activeFilteredList.forEach(profile => {
        // Resolve display values based on session status (redacted for guests)
        const nameVal = isLoggedIn
            ? (profile.name[currentLang] || profile.name['en'])
            : (profile.shortName[currentLang] || profile.shortName['en']);

        const gotraSelfVal = isLoggedIn
            ? (profile.gotraSelf[currentLang] || profile.gotraSelf['en'])
            : (currentLang === 'hi' ? '🔒 सत्यापित' : '🔒 Verified');

        const gotraMotherVal = isLoggedIn
            ? (profile.gotraMother[currentLang] || profile.gotraMother['en'])
            : (currentLang === 'hi' ? '🔒 सत्यापित' : '🔒 Verified');

        const eduVal = profile.education[currentLang] || profile.education['en'];
        const profVal = profile.profession[currentLang] || profile.profession['en'];
        const distVal = profile.district[currentLang] || profile.district['en'];

        // Labels (basic table)
        const ageLabel = currentLang === 'hi' ? 'आयु / ऊंचाई' : 'Age / Height';
        const gotraSelfLabel = currentLang === 'hi' ? 'गोत्र (स्वयं)' : 'Gotra (Self)';
        const gotraMotherLabel = currentLang === 'hi' ? 'गोत्र (माता)' : 'Gotra (Mother)';
        const eduLabel = currentLang === 'hi' ? 'शिक्षा' : 'Education';
        const profLabel = currentLang === 'hi' ? 'व्यवसाय' : 'Profession';
        const distLabel = currentLang === 'hi' ? 'जिला' : 'District';

        // Member-only detail labels
        const fatherLabel = currentLang === 'hi' ? 'पिता' : 'Father';
        const motherLabel = currentLang === 'hi' ? 'माता' : 'Mother';
        const parOccLabel = currentLang === 'hi' ? 'अभिभावक व्यवसाय' : "Parents' Occupation";
        const famTypeLabel = currentLang === 'hi' ? 'परिवार का प्रकार' : 'Family Type';
        const brothersLabel = currentLang === 'hi' ? 'भाई' : 'Brothers';
        const sistersLabel = currentLang === 'hi' ? 'बहनें' : 'Sisters';
        const dobLabel = currentLang === 'hi' ? 'जन्म तिथि' : 'Date of Birth';
        const addressLabel = currentLang === 'hi' ? 'पता' : 'Address';
        const contactLabel = currentLang === 'hi' ? 'संपर्क' : 'Contact';

        // CTA Label
        const ctaText = isLoggedIn
            ? (currentLang === 'hi' ? 'रुचि भेजें' : 'Send Interest')
            : (currentLang === 'hi' ? 'विवरण अनलॉक करें' : 'Unlock Details');

        // Privacy subtext for guests
        const subtext = isLoggedIn
            ? ""
            : `<p style="font-size: 11px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 12px; text-align: center; font-style: italic;">
                 ${currentLang === 'hi' ? '🔒 गोत्र और परिवार विवरण छिपे हैं।' : '🔒 Gotra & family details are hidden. Login to view.'}
               </p>`;

        // Click actions
        const clickAction = isLoggedIn
            ? `handleSendInterest(this, ${profile.id}, '${nameVal}')`
            : `openAuthModal('login')`;

        // Build member-only expanded section
        let memberDetails = "";
        if (isLoggedIn) {
            const fatherVal = profile.fatherName[currentLang] || profile.fatherName['en'];
            const motherVal = profile.motherName[currentLang] || profile.motherName['en'];
            const parOccVal = profile.parentsOccupation[currentLang] || profile.parentsOccupation['en'];
            const famTypeVal = profile.familyType[currentLang] || profile.familyType['en'];
            const brothersVal = profile.brothers;
            const sistersVal = profile.sisters;
            const dobVal = profile.dob[currentLang] || profile.dob['en'];
            const addressVal = profile.address[currentLang] || profile.address['en'];
            const contactVal = profile.contact;

            const hasContact = contactVal && contactVal !== '-';
            const contactHtml = hasContact
                ? `<a href="tel:+91${contactVal}" style="color: var(--color-saffron); font-weight: 700; text-decoration: none;">📞 ${contactVal}</a>`
                : '-';

            memberDetails = `
                <div style="margin-top: 12px; border-top: 1px dashed var(--color-gold-light); padding-top: 12px;">
                    <p style="font-size: 10px; font-weight: 700; letter-spacing: 1px; color: var(--color-maroon); text-transform: uppercase; margin-bottom: 8px;">
                        ${currentLang === 'hi' ? '👨‍👩‍👧‍👦 परिवार विवरण' : '👨‍👩‍👧‍👦 Family Details'}
                    </p>
                    <table class="profile-details-table">
                        <tr>
                            <td class="label-td">${fatherLabel}</td>
                            <td class="val-td">${fatherVal}</td>
                        </tr>
                        <tr>
                            <td class="label-td">${motherLabel}</td>
                            <td class="val-td">${motherVal}</td>
                        </tr>
                        <tr>
                            <td class="label-td">${parOccLabel}</td>
                            <td class="val-td">${parOccVal}</td>
                        </tr>
                        <tr>
                            <td class="label-td">${famTypeLabel}</td>
                            <td class="val-td">${famTypeVal}</td>
                        </tr>
                        <tr>
                            <td class="label-td">${brothersLabel}</td>
                            <td class="val-td">${brothersVal}</td>
                        </tr>
                        <tr>
                            <td class="label-td">${sistersLabel}</td>
                            <td class="val-td">${sistersVal}</td>
                        </tr>
                        ${dobVal && dobVal !== '-' ? `<tr><td class="label-td">${dobLabel}</td><td class="val-td">${dobVal}</td></tr>` : ''}
                        ${addressVal && addressVal !== '-' ? `<tr><td class="label-td">${addressLabel}</td><td class="val-td">${addressVal}</td></tr>` : ''}
                    </table>
                    <div style="margin-top: 10px; padding: 10px 12px; background: linear-gradient(135deg, rgba(128,0,32,0.06), rgba(197,165,90,0.08)); border: 1px solid var(--color-gold-light); border-radius: 8px; display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 12px; color: var(--color-text-muted); font-weight: 500;">${contactLabel}:</span>
                        <span style="font-size: 14px;">${contactHtml}</span>
                    </div>
                </div>
            `;
        }

        html += `
            <div class="profile-card">
                <div class="profile-image-container">
                    <img src="${profile.image}" class="profile-image" alt="${nameVal}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name.en)}&background=800020&color=fff&size=300'">
                    <div class="profile-badge">${currentLang === 'hi' ? (profile.gender === 'Bride' ? 'वधू (लड़की)' : 'वर (लड़का)') : profile.gender}</div>
                    ${profile.verified ? `<div class="profile-verified-badge"><i data-lucide="shield-check" style="width: 16px; height: 16px;"></i><span>${currentLang === 'hi' ? 'सत्यापित' : 'Verified'}</span></div>` : ''}
                </div>
                <div class="profile-info">
                    <h3 class="profile-name">${nameVal}</h3>
                    <table class="profile-details-table">
                        <tr>
                            <td class="label-td">${ageLabel}</td>
                            <td class="val-td">${profile.age} yrs, ${profile.height}</td>
                        </tr>
                        <tr>
                            <td class="label-td">${gotraSelfLabel}</td>
                            <td class="val-td" style="color: ${isLoggedIn ? 'var(--color-text-dark)' : 'var(--color-saffron)'};">${gotraSelfVal}</td>
                        </tr>
                        <tr>
                            <td class="label-td">${gotraMotherLabel}</td>
                            <td class="val-td" style="color: ${isLoggedIn ? 'var(--color-text-dark)' : 'var(--color-saffron)'};">${gotraMotherVal}</td>
                        </tr>
                        <tr>
                            <td class="label-td">${eduLabel}</td>
                            <td class="val-td">${eduVal}</td>
                        </tr>
                        <tr>
                            <td class="label-td">${profLabel}</td>
                            <td class="val-td">${profVal}</td>
                        </tr>
                        <tr>
                            <td class="label-td">${distLabel}</td>
                            <td class="val-td">${distVal}</td>
                        </tr>
                    </table>
                    ${memberDetails}
                    ${subtext}
                    <button class="btn-large btn-primary ${isLoggedIn ? 'pulse-interest' : ''}" style="width: 100%; margin-top: 14px;" onclick="${clickAction}">
                        <i data-lucide="${isLoggedIn ? 'heart' : 'lock'}"></i>
                        <span>${ctaText}</span>
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    lucide.createIcons();
}

// ============================================
// DYNAMIC SEARCH & FILTER ALGORITHM
// ============================================
function parseHeightToInches(heightStr) {
    if (!heightStr) return 0;
    const match = heightStr.match(/(\d+)'(\d+)/);
    if (match) {
        const feet = parseInt(match[1]);
        const inches = parseInt(match[2]);
        return (feet * 12) + inches;
    }
    return 0;
}

function performProfileSearch() {
    const genderSel = document.getElementById("search-gender").value;
    const ageMin = parseInt(document.getElementById("search-age-min").value);
    const ageMax = parseInt(document.getElementById("search-age-max").value);
    const commSel = document.getElementById("search-community").value;
    const distSel = document.getElementById("search-district").value;

    // Enhanced search criteria fields
    const gotraQuery = document.getElementById("search-gotra").value.trim().toLowerCase();
    const gotraExcludeQuery = document.getElementById("search-gotra-exclude").value.trim().toLowerCase();
    const heightMinVal = document.getElementById("search-height-min").value;
    const keywordQuery = document.getElementById("search-keyword").value.trim().toLowerCase();
    const verifiedOnly = document.getElementById("search-verified").checked;
    const sortVal = document.getElementById("search-sort").value;

    showToast(currentLang === 'hi' ? 'फ़िल्टर लागू हो रहे हैं...' : 'Applying profile filters...', 'info');

    activeFilteredList = matrimonialProfiles.filter(profile => {
        // Gender matching
        if (profile.gender !== genderSel) return false;

        // Age range matching
        if (profile.age < ageMin || profile.age > ageMax) return false;

        // Community matching
        if (commSel !== 'all' && profile.community !== commSel) return false;

        // District matching
        if (distSel !== 'all') {
            const profileDistrictEn = profile.district.en;
            if (profileDistrictEn !== distSel) return false;
        }

        // Gotra query matching (searches self and mother gotras in both English & Hindi)
        if (gotraQuery) {
            const selfEn = (profile.gotraSelf.en || "").toLowerCase();
            const selfHi = (profile.gotraSelf.hi || "").toLowerCase();
            const motherEn = (profile.gotraMother.en || "").toLowerCase();
            const motherHi = (profile.gotraMother.hi || "").toLowerCase();
            const matchesGotra = selfEn.includes(gotraQuery) || selfHi.includes(gotraQuery) ||
                motherEn.includes(gotraQuery) || motherHi.includes(gotraQuery);
            if (!matchesGotra) return false;
        }

        // Gotra exclusion matching (hides profile if matching self or mother gotras)
        if (gotraExcludeQuery) {
            const selfEn = (profile.gotraSelf.en || "").toLowerCase();
            const selfHi = (profile.gotraSelf.hi || "").toLowerCase();
            const motherEn = (profile.gotraMother.en || "").toLowerCase();
            const motherHi = (profile.gotraMother.hi || "").toLowerCase();
            const matchesExclude = selfEn.includes(gotraExcludeQuery) || selfHi.includes(gotraExcludeQuery) ||
                motherEn.includes(gotraExcludeQuery) || motherHi.includes(gotraExcludeQuery);
            if (matchesExclude) return false;
        }

        // Minimum height matching
        if (heightMinVal !== 'all') {
            const minHeightInches = parseInt(heightMinVal);
            const profileHeightInches = parseHeightToInches(profile.height);
            if (profileHeightInches < minHeightInches) return false;
        }

        // Keyword Search (checks education and profession)
        if (keywordQuery) {
            const eduEn = (profile.education.en || "").toLowerCase();
            const eduHi = (profile.education.hi || "").toLowerCase();
            const profEn = (profile.profession.en || "").toLowerCase();
            const profHi = (profile.profession.hi || "").toLowerCase();
            const matchesKeyword = eduEn.includes(keywordQuery) || eduHi.includes(keywordQuery) ||
                profEn.includes(keywordQuery) || profHi.includes(keywordQuery);
            if (!matchesKeyword) return false;
        }

        // Verified Accounts Only filter
        if (verifiedOnly && !profile.verified) return false;

        return true;
    });

    // Execute selected sorting algorithm
    if (sortVal === 'age-asc') {
        activeFilteredList.sort((a, b) => a.age - b.age);
    } else if (sortVal === 'age-desc') {
        activeFilteredList.sort((a, b) => b.age - a.age);
    } else if (sortVal === 'height-asc') {
        activeFilteredList.sort((a, b) => parseHeightToInches(a.height) - parseHeightToInches(b.height));
    } else if (sortVal === 'height-desc') {
        activeFilteredList.sort((a, b) => parseHeightToInches(b.height) - parseHeightToInches(a.height));
    } else {
        // default: sort verified first, then sort by ID
        activeFilteredList.sort((a, b) => {
            if (a.verified && !b.verified) return -1;
            if (!a.verified && b.verified) return 1;
            return a.id - b.id;
        });
    }

    setTimeout(() => {
        renderProfilesGrid();
        const resultsCount = activeFilteredList.length;
        const msg = currentLang === 'hi'
            ? `खोज पूरी हुई। ${resultsCount} मैच मिले।`
            : `Search complete. Found ${resultsCount} matches.`;
        showToast(msg, 'success');
    }, 450);
}

function resetProfileSearch() {
    // Clear all inputs back to original defaults
    document.getElementById("search-gender").value = "Groom";
    document.getElementById("search-age-min").value = "18";
    document.getElementById("search-age-max").value = "35";
    document.getElementById("search-community").value = "all";
    document.getElementById("search-district").value = "all";
    document.getElementById("search-gotra").value = "";
    document.getElementById("search-gotra-exclude").value = "";
    document.getElementById("search-height-min").value = "all";
    document.getElementById("search-keyword").value = "";
    document.getElementById("search-verified").checked = false;
    document.getElementById("search-sort").value = "default";

    showToast(currentLang === 'hi' ? 'फ़िल्टर रीसेट कर दिए गए हैं।' : 'Search filters have been reset.', 'info');

    // Restore full profile list and apply default sorting (verified first)
    activeFilteredList = [...matrimonialProfiles];
    activeFilteredList.sort((a, b) => {
        if (a.verified && !b.verified) return -1;
        if (!a.verified && b.verified) return 1;
        return a.id - b.id;
    });

    renderProfilesGrid();
}

// ============================================
// INTEREST HANDLER (USER ONLY)
// ============================================
function handleSendInterest(btn, profileId, name) {
    if (btn.classList.contains("btn-secondary")) return;

    btn.className = "btn-large btn-secondary";
    btn.classList.remove("pulse-interest");
    btn.innerHTML = `<i data-lucide="check"></i> <span>${currentLang === 'hi' ? 'रुचि भेजी गई ✓' : 'Interest Sent ✓'}</span>`;
    lucide.createIcons();

    // Increment interests received locally in sessionStorage for dashboard
    let received = parseInt(sessionStorage.getItem('interestsCount')) || 28;
    sessionStorage.setItem('interestsCount', received + 1);

    const msg = currentLang === 'hi'
        ? `${name} के परिवार को विवाह संबंध की रुचि भेजी गई।`
        : `Marriage interest request sent to the family of ${name}.`;
    showToast(msg, 'success');
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

    // Translate standard text tags
    document.querySelectorAll('[data-en]').forEach(el => {
        const textEn = el.getAttribute('data-en');
        const textHi = el.getAttribute('data-hi');
        el.innerText = lang === 'hi' ? textHi : textEn;
    });

    // Translate input placeholders
    document.querySelectorAll('[data-placeholder-en]').forEach(el => {
        const placeholderEn = el.getAttribute('data-placeholder-en');
        const placeholderHi = el.getAttribute('data-placeholder-hi');
        el.placeholder = lang === 'hi' ? placeholderHi : placeholderEn;
    });

    // Re-render Dynamic Grid to swap card elements
    renderProfilesGrid();

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
// POPUP AUTH MODAL ACTIONS (LOGIN & REGISTER)
// ============================================
function openAuthModal(tab = 'login') {
    const modal = document.getElementById("auth-modal");
    if (modal) {
        modal.classList.add("active");
        toggleModalTab(tab);
    }
}

function closeAuthModal() {
    const modal = document.getElementById("auth-modal");
    if (modal) {
        modal.classList.remove("active");
    }
}

function toggleModalTab(tab) {
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const formLogin = document.getElementById("form-login-content");
    const formRegister = document.getElementById("form-register-content");

    if (tab === 'login') {
        tabLogin.classList.add("active");
        tabRegister.classList.remove("active");
        formLogin.style.display = "flex";
        formRegister.style.display = "none";
    } else {
        tabRegister.classList.add("active");
        tabLogin.classList.remove("active");
        formRegister.style.display = "flex";
        formLogin.style.display = "none";
    }
}

// Mock auth handlers
function submitMockLogin() {
    const number = document.getElementById("login-phone").value;
    if (!number) {
        showToast(currentLang === 'hi' ? 'कृपया मोबाइल नंबर दर्ज करें।' : 'Please enter your mobile number.', 'error');
        return;
    }

    showToast(currentLang === 'hi' ? 'क्रेडेंशियल सत्यापित हो रहे हैं...' : 'Verifying family credentials...', 'info');

    setTimeout(() => {
        sessionStorage.setItem('isLoggedIn', 'true');
        closeAuthModal();
        applySessionStateUI();
        renderProfilesGrid();

        const successMsg = currentLang === 'hi'
            ? 'सत्यापन सफल! कुल गोत्र और परिवार विवरण अब अनलॉक हैं।'
            : 'Verification successful! Clan Gotras & family details are now unlocked.';
        showToast(successMsg, 'success');
    }, 1000);
}

function submitMockRegister() {
    showToast(currentLang === 'hi' ? 'सफलतापूर्वक पंजीकृत! कृपया लॉगिन करें।' : 'Registered successfully! Please login.', 'success');
    setTimeout(() => {
        toggleModalTab('login');
    }, 1000);
}

function handleLogout() {
    sessionStorage.removeItem('isLoggedIn');
    applySessionStateUI();
    renderProfilesGrid();
    showToast(currentLang === 'hi' ? 'लॉग आउट किया गया।' : 'Logged out successfully.', 'info');
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
