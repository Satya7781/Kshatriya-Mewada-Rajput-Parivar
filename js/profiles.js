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
        name: { en: "Sandeep Mewada", hi: "\u0938\u0902\u0926\u0940\u092a \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        shortName: { en: "Sandeep M.", hi: "\u0938\u0902\u0926\u0940\u092a \u090f\u092e." },
        gender: "Groom",
        gotraSelf: { en: "Dod", hi: "\u0921\u094b\u0921" },
        gotraMother: { en: "Baghela", hi: "\u092c\u093e\u0918\u0947\u0932\u093e" },
        age: 25,
        height: "5'8\"",
        education: { en: "Graduate", hi: "\u0938\u094d\u0928\u093e\u0924\u0915" },
        profession: { en: "-", hi: "-" },
        district: { en: "Bhopal", hi: "\u092d\u094b\u092a\u093e\u0932" },
        community: "Mewada",
        verified: true,
        image: "images/sandeep.jpeg",
        fatherName: { en: "Ramdayal Mewada", hi: "\u0930\u093e\u092e\u0926\u092f\u093e\u0932 \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        motherName: { en: "Antar Bai", hi: "\u0905\u0902\u0924\u0930 \u092c\u093e\u0908" },
        address: { en: "-", hi: "-" },
        contact: "7970094797",
        brothers: 0,
        sisters: 4,
        familyType: { en: "-", hi: "-" },
        parentsOccupation: { en: "Farmer", hi: "\u0915\u093f\u0938\u093e\u0928" },
        dob: { en: "-", hi: "-" }
    },
    {
        id: 2,
        name: { en: "Sarvesh Rajput", hi: "\u0938\u0930\u094d\u0935\u0947\u0936 \u0930\u093e\u091c\u092a\u0942\u0924" },
        shortName: { en: "Sarvesh R.", hi: "\u0938\u0930\u094d\u0935\u0947\u0936 \u0906\u0930." },
        gender: "Groom",
        gotraSelf: { en: "Dod", hi: "\u0921\u094b\u0921" },
        gotraMother: { en: "Rathore", hi: "\u0930\u093e\u0920\u094c\u0921\u093c" },
        age: 23,
        height: "5'7\"",
        education: { en: "Second Year", hi: "\u0926\u094d\u0935\u093f\u0924\u0940\u092f \u0935\u0930\u094d\u0937" },
        profession: { en: "Bajaj Collection Agent", hi: "\u092c\u091c\u093e\u091c \u0915\u0932\u0947\u0915\u094d\u0936\u0928 \u090f\u091c\u0947\u0902\u091f" },
        district: { en: "Bhopal", hi: "\u092d\u094b\u092a\u093e\u0932" },
        community: "Rajput",
        verified: true,
        image: "images/sarvesh.jpeg",
        fatherName: { en: "Late Kailash Singh", hi: "\u0938\u094d\u0935\u0930\u094d\u0917\u0940\u092f \u0915\u0948\u0932\u093e\u0936 \u0938\u093f\u0902\u0939" },
        motherName: { en: "Ramshree Bai", hi: "\u0930\u093e\u092e\u0936\u094d\u0930\u0940 \u092c\u093e\u0908" },
        address: { en: "Phanda Kalan, Bhopal", hi: "\u092b\u0902\u0926\u093e \u0915\u0932\u093e\u0902, \u092d\u094b\u092a\u093e\u0932" },
        contact: "6260134370",
        brothers: 3,
        sisters: 1,
        familyType: { en: "Joint Family", hi: "\u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u092a\u0930\u093f\u0935\u093e\u0930" },
        parentsOccupation: { en: "Mother: Housewife", hi: "\u092e\u093e\u0924\u093e: \u0917\u0943\u0939\u0923\u0940" },
        dob: { en: "-", hi: "-" }
    },
    {
        id: 3,
        name: { en: "Hirdesh Mewada", hi: "\u0939\u093f\u0930\u0926\u0947\u0936 \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        shortName: { en: "Hirdesh M.", hi: "\u0939\u093f\u0930\u0926\u0947\u0936 \u090f\u092e." },
        gender: "Groom",
        gotraSelf: { en: "Hada", hi: "\u0939\u093e\u0921\u093c\u093e" },
        gotraMother: { en: "Dod", hi: "\u0921\u094b\u0921" },
        age: 22,
        height: "5'9\"",
        education: { en: "12th Pass", hi: "12\u0935\u0940\u0902 \u092a\u093e\u0938" },
        profession: { en: "Student", hi: "\u091b\u093e\u0924\u094d\u0930" },
        district: { en: "Sehore", hi: "\u0938\u0940\u0939\u094b\u0930" },
        community: "Mewada",
        verified: true,
        image: "images/hirdesh.jpeg",
        fatherName: { en: "Laxmi Narayan Mewada", hi: "\u0932\u0915\u094d\u0937\u094d\u092e\u0940\u0928\u093e\u0930\u093e\u092f\u0923 \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        motherName: { en: "Anusuiya Mewada", hi: "\u0905\u0928\u0941\u0938\u0941\u0907\u092f\u093e \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        address: { en: "Dhamaniya", hi: "\u0927\u092e\u093e\u0928\u093f\u092f\u093e" },
        contact: "7828767625",
        brothers: 0,
        sisters: 1,
        familyType: { en: "Joint Family", hi: "\u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u092a\u0930\u093f\u0935\u093e\u0930" },
        parentsOccupation: { en: "Father: Farmer, Mother: Housewife", hi: "\u092a\u093f\u0924\u093e: \u0915\u093f\u0938\u093e\u0928, \u092e\u093e\u0924\u093e: \u0917\u0943\u0939\u0923\u0940" },
        dob: { en: "-", hi: "-" }
    },
    {
        id: 4,
        name: { en: "Vikash Mewada", hi: "\u0935\u093f\u0915\u093e\u0938 \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        shortName: { en: "Vikash M.", hi: "\u0935\u093f\u0915\u093e\u0938 \u090f\u092e." },
        gender: "Groom",
        gotraSelf: { en: "Baghela", hi: "\u092c\u093e\u0918\u0947\u0932\u093e" },
        gotraMother: { en: "Shankla", hi: "\u0936\u0902\u0916\u0932\u093e" },
        age: 26,
        height: "5'10\"",
        education: { en: "Graduate", hi: "\u0938\u094d\u0928\u093e\u0924\u0915" },
        profession: { en: "Podcast Producer", hi: "\u092a\u0949\u0921\u0915\u093e\u0938\u094d\u091f \u092a\u094d\u0930\u094b\u0921\u094d\u092f\u0942\u0938\u0930" },
        district: { en: "Bhopal", hi: "\u092d\u094b\u092a\u093e\u0932" },
        community: "Mewada",
        verified: true,
        image: "images/vikash.jpeg",
        fatherName: { en: "Ghisilal Mewada", hi: "\u0918\u093f\u0938\u0940\u0932\u093e\u0932 \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        motherName: { en: "Rukmani Bai", hi: "\u0930\u0941\u0915\u094d\u092e\u0923\u0940 \u092c\u093e\u0908" },
        address: { en: "-", hi: "-" },
        contact: "7089729322",
        brothers: 2,
        sisters: 0,
        familyType: { en: "-", hi: "-" },
        parentsOccupation: { en: "Farmer", hi: "\u0915\u093f\u0938\u093e\u0928" },
        dob: { en: "-", hi: "-" }
    },
    {
        id: 5,
        name: { en: "Arpit Rajput", hi: "\u0905\u0930\u094d\u092a\u093f\u0924 \u0930\u093e\u091c\u092a\u0942\u0924" },
        shortName: { en: "Arpit R.", hi: "\u0905\u0930\u094d\u092a\u093f\u0924 \u0906\u0930." },
        gender: "Groom",
        gotraSelf: { en: "Dod", hi: "\u0921\u094b\u0921" },
        gotraMother: { en: "Rathore", hi: "\u0930\u093e\u0920\u094c\u0921\u093c" },
        age: 21,
        height: "5'8\"",
        education: { en: "12th Pass", hi: "12\u0935\u0940\u0902 \u092a\u093e\u0938" },
        profession: { en: "Student", hi: "\u091b\u093e\u0924\u094d\u0930" },
        district: { en: "Bhopal", hi: "\u092d\u094b\u092a\u093e\u0932" },
        community: "Rajput",
        verified: true,
        image: "images/arpit.jpeg",
        fatherName: { en: "Radheshyam Rajput", hi: "\u0930\u093e\u0927\u0947\u0936\u094d\u092f\u093e\u092e \u0930\u093e\u091c\u092a\u0942\u0924" },
        motherName: { en: "Parvati Rajput", hi: "\u092a\u093e\u0930\u094d\u0935\u0924\u0940 \u0930\u093e\u091c\u092a\u0942\u0924" },
        address: { en: "Phanda Kalan", hi: "\u092b\u0902\u0926\u093e \u0915\u0932\u093e\u0902" },
        contact: "6267534211",
        brothers: 1,
        sisters: 0,
        familyType: { en: "Joint Family", hi: "\u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u092a\u0930\u093f\u0935\u093e\u0930" },
        parentsOccupation: { en: "Father: Farmer, Mother: Housewife", hi: "\u092a\u093f\u0924\u093e: \u0915\u093f\u0938\u093e\u0928, \u092e\u093e\u0924\u093e: \u0917\u0943\u0939\u0923\u0940" },
        dob: { en: "-", hi: "-" }
    },
    {
        id: 6,
        name: { en: "Rajkumar Mewada", hi: "\u0930\u093e\u091c\u0915\u0941\u092e\u093e\u0930 \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        shortName: { en: "Rajkumar M.", hi: "\u0930\u093e\u091c\u0915\u0941\u092e\u093e\u0930 \u090f\u092e." },
        gender: "Groom",
        gotraSelf: { en: "Pipada", hi: "\u092a\u093f\u092a\u0921\u093c\u093e" },
        gotraMother: { en: "Kilodiya", hi: "\u0915\u093f\u0932\u094b\u0926\u093f\u092f\u093e" },
        age: 23,
        height: "5'7\"",
        education: { en: "12th Pass", hi: "12\u0935\u0940\u0902 \u092a\u093e\u0938" },
        profession: { en: "-", hi: "-" },
        district: { en: "Sehore", hi: "\u0938\u0940\u0939\u094b\u0930" },
        community: "Mewada",
        verified: true,
        image: "images/rajkumar.jpeg",
        fatherName: { en: "Mohan Singh", hi: "\u092e\u094b\u0939\u0928 \u0938\u093f\u0902\u0939" },
        motherName: { en: "Pushpa Bai", hi: "\u092a\u0941\u0937\u094d\u092a\u093e \u092c\u093e\u0908" },
        address: { en: "Chhatri, Sehore", hi: "\u091b\u0924\u094d\u0930\u0940, \u0938\u0940\u0939\u094b\u0930" },
        contact: "6266550727",
        brothers: 1,
        sisters: 3,
        familyType: { en: "6 Members", hi: "6 \u0938\u0926\u0938\u094d\u092f" },
        parentsOccupation: { en: "-", hi: "-" },
        dob: { en: "12/07/2002", hi: "12/07/2002" }
    },
    {
        id: 7,
        name: { en: "Ankit Mewada", hi: "\u0905\u0902\u0915\u093f\u0924 \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        shortName: { en: "Ankit M.", hi: "\u0905\u0902\u0915\u093f\u0924 \u090f\u092e." },
        gender: "Groom",
        gotraSelf: { en: "Dava", hi: "\u0926\u093e\u0935\u093e" },
        gotraMother: { en: "Baghela", hi: "\u092c\u093e\u0918\u0947\u0932\u093e" },
        age: 24,
        height: "5'9\"",
        education: { en: "-", hi: "-" },
        profession: { en: "-", hi: "-" },
        district: { en: "Sehore", hi: "\u0938\u0940\u0939\u094b\u0930" },
        community: "Mewada",
        verified: true,
        image: "images/ankit.jpeg",
        fatherName: { en: "Ramcharan Mewada", hi: "\u0930\u093e\u092e\u091a\u0930\u0923 \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        motherName: { en: "Singar Bai", hi: "\u0938\u093f\u0902\u0917\u093e\u0930 \u092c\u093e\u0908" },
        address: { en: "-", hi: "-" },
        contact: "-",
        brothers: 1,
        sisters: 1,
        familyType: { en: "-", hi: "-" },
        parentsOccupation: { en: "Farmer", hi: "\u0915\u093f\u0938\u093e\u0928" },
        dob: { en: "-", hi: "-" }
    },
    {
        id: 8,
        name: { en: "Animesh Mewada", hi: "\u0905\u0928\u093f\u092e\u0947\u0937 \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        shortName: { en: "Animesh M.", hi: "\u0905\u0928\u093f\u092e\u0947\u0937 \u090f\u092e." },
        gender: "Groom",
        gotraSelf: { en: "Sisodiya", hi: "\u0938\u093f\u0938\u094b\u0926\u093f\u092f\u093e" },
        gotraMother: { en: "Bordiya", hi: "\u092c\u094b\u0930\u0926\u093f\u092f\u093e" },
        age: 21,
        height: "5'11\"",
        education: { en: "B.Com (Computer), DCA, MBA (Pursuing)", hi: "\u092c\u0940.\u0915\u0949\u092e (\u0915\u0902\u092a\u094d\u092f\u0942\u091f\u0930), \u0921\u0940\u0938\u0940\u090f, \u090f\u092e\u092c\u0940\u090f (\u092a\u094d\u0930\u0917\u0924\u093f \u092a\u0930)" },
        profession: { en: "Private Job", hi: "\u092a\u094d\u0930\u093e\u0907\u0935\u0947\u091f \u091c\u0949\u092c" },
        district: { en: "Bhopal", hi: "\u092d\u094b\u092a\u093e\u0932" },
        community: "Mewada",
        verified: true,
        image: "images/animesh.jpeg",
        fatherName: { en: "Sher Singh Mewada", hi: "\u0936\u0947\u0930 \u0938\u093f\u0902\u0939 \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        motherName: { en: "Rekha Mewada", hi: "\u0930\u0947\u0916\u093e \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        address: { en: "Ratanpur, Bhopal", hi: "\u0930\u0924\u0928\u092a\u0941\u0930, \u092d\u094b\u092a\u093e\u0932" },
        contact: "6263611436",
        brothers: 0,
        sisters: 1,
        familyType: { en: "Nuclear Family", hi: "\u090f\u0915\u093e\u0915\u093f \u092a\u0930\u093f\u0935\u093e\u0930" },
        parentsOccupation: { en: "Father: Land & Dairy Business, Mother: Housewife", hi: "\u092a\u093f\u0924\u093e: \u092d\u0942\u092e\u093f \u0914\u0930 \u0921\u0947\u092f\u0930\u0940 \u0935\u094d\u092f\u0935\u0938\u093e\u092f, \u092e\u093e\u0924\u093e: \u0917\u0943\u0939\u0923\u0940" },
        dob: { en: "27/04/2005", hi: "27/04/2005" }
    },
    {
        id: 9,
        name: { en: "Rohit Mewada", hi: "\u0930\u094b\u0939\u093f\u0924 \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        shortName: { en: "Rohit M.", hi: "\u0930\u094b\u0939\u093f\u0924 \u090f\u092e." },
        gender: "Groom",
        gotraSelf: { en: "Pathariya", hi: "\u092a\u0925\u0930\u093f\u092f\u093e" },
        gotraMother: { en: "Sisodiya", hi: "\u0938\u093f\u0938\u094b\u0926\u093f\u092f\u093e" },
        age: 22,
        height: "5'10\"",
        education: { en: "Competitive Exam Aspirant", hi: "\u092a\u094d\u0930\u0924\u093f\u092f\u094b\u0917\u0940 \u092a\u0930\u0940\u0915\u094d\u0937\u093e \u0906\u0915\u093e\u0902\u0915\u094d\u0937\u0940" },
        profession: { en: "Student", hi: "\u091b\u093e\u0924\u094d\u0930" },
        district: { en: "Bhopal", hi: "\u092d\u094b\u092a\u093e\u0932" },
        community: "Mewada",
        verified: true,
        image: "images/rohit.jpeg",
        fatherName: { en: "Kaluram Mewada", hi: "\u0915\u093e\u0932\u0942\u0930\u093e\u092e \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        motherName: { en: "Rekha Mewada", hi: "\u0930\u0947\u0916\u093e \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        address: { en: "Phanda Kalan, Bhopal", hi: "\u092b\u0902\u0926\u093e \u0915\u0932\u093e\u0902, \u092d\u094b\u092a\u093e\u0932" },
        contact: "7400640496",
        brothers: "1 (Ajey)",
        sisters: "-",
        familyType: { en: "Joint Family", hi: "\u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u092a\u0930\u093f\u0935\u093e\u0930" },
        parentsOccupation: { en: "Father: Farmer", hi: "\u092a\u093f\u0924\u093e: \u0915\u093f\u0938\u093e\u0928" },
        dob: { en: "15/12/2003", hi: "15/12/2003" }
    },
    {
        id: 10,
        name: { en: "Deepak Mewada", hi: "\u0926\u0940\u092a\u0915 \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        shortName: { en: "Deepak M.", hi: "\u0926\u0940\u092a\u0915 \u090f\u092e." },
        gender: "Groom",
        gotraSelf: { en: "Budhana", hi: "\u092c\u0941\u0927\u093e\u0928\u093e" },
        gotraMother: { en: "Khadwad", hi: "\u0916\u0926\u0935\u093e\u0921\u093c" },
        age: 27,
        height: "5'8\"",
        education: { en: "Graduate", hi: "\u0938\u094d\u0928\u093e\u0924\u0915" },
        profession: { en: "Private Job", hi: "\u092a\u094d\u0930\u093e\u0907\u0935\u0947\u091f \u091c\u0949\u092c" },
        district: { en: "Bhopal", hi: "\u092d\u094b\u092a\u093e\u0932" },
        community: "Mewada",
        verified: true,
        image: "images/deepak.jpeg",
        fatherName: { en: "Kumar Singh Mewada", hi: "\u0915\u0941\u092e\u093e\u0930 \u0938\u093f\u0902\u0939 \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        motherName: { en: "Bhagwati Bai", hi: "\u092d\u0917\u0935\u0924\u0940 \u092c\u093e\u0908" },
        address: { en: "Phanda Kalan", hi: "\u092b\u0902\u0926\u093e \u0915\u0932\u093e\u0902" },
        contact: "7415120791",
        brothers: "3 (Total 4)",
        sisters: 1,
        familyType: { en: "Joint Family", hi: "\u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u092a\u0930\u093f\u0935\u093e\u0930" },
        parentsOccupation: { en: "Farmer", hi: "\u0915\u093f\u0938\u093e\u0928" },
        dob: { en: "-", hi: "-" }
    },
    {
        id: 11,
        name: { en: "Hritik Mewada", hi: "\u0943\u0924\u093f\u0915 \u092e\u0947\u0935\u093e\u0921\u093c\u093e" },
        shortName: { en: "Hritik M.", hi: "\u0943\u0924\u093f\u0915 \u090f\u092e." },
        gender: "Groom",
        gotraSelf: { en: "Bhati", hi: "\u092d\u093e\u091f\u0940" },
        gotraMother: { en: "Daba", hi: "\u0926\u093e\u092c\u093e" },
        age: 20,
        height: "5'9\"",
        education: { en: "12th Pass", hi: "12\u0935\u0940\u0902 \u092a\u093e\u0938" },
        profession: { en: "Student", hi: "\u091b\u093e\u0924\u094d\u0930" },
        district: { en: "Bhopal", hi: "\u092d\u094b\u092a\u093e\u0932" },
        community: "Mewada",
        verified: true,
        image: "images/hritik.jpeg",
        fatherName: { en: "Bhagwan Singh", hi: "\u092d\u0917\u0935\u093e\u0928 \u0938\u093f\u0902\u0939" },
        motherName: { en: "Bhuriya Bai", hi: "\u092d\u0942\u0930\u093f\u092f\u093e \u092c\u093e\u0908" },
        address: { en: "Phanda", hi: "\u092b\u0902\u0926\u093e" },
        contact: "9669753117",
        brothers: "1 (Kuldeep)",
        sisters: "1 (Aarti)",
        familyType: { en: "Nuclear Family", hi: "\u090f\u0915\u093e\u0915\u093f \u092a\u0930\u093f\u0935\u093e\u0930" },
        parentsOccupation: { en: "Father: Farmer", hi: "\u092a\u093f\u0924\u093e: \u0915\u093f\u0938\u093e\u0928" },
        dob: { en: "09/07/2005", hi: "09/07/2005" }
    }
];

let activeFilteredList = [...matrimonialProfiles];

// ============================================
// INITIALIZE ON DOM LOAD
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    applySessionStateUI();
    applyLanguage(currentLang, false);
});

// ============================================
// SESSION STATE LAYOUT TOGGLING
// ============================================
function applySessionStateUI() {
    isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const guestActions = document.getElementById("guest-actions");
    const userActions = document.getElementById("user-actions");
    const navDashboard = document.getElementById("nav-dashboard-item");
    const footerDashboard = document.getElementById("footer-dashboard-item");
    const mobileGuest = document.getElementById("mobile-guest-actions");
    const mobileUser = document.getElementById("mobile-user-actions");
    const mobileNavDashboard = document.getElementById("mobile-nav-dashboard");
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
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--color-white); border: 2px dashed var(--color-gold); border-radius: var(--border-radius-md);">
                <i data-lucide="users-round" style="width: 48px; height: 48px; color: var(--color-maroon); margin-bottom: 12px;"></i>
                <h4 style="font-size: 20px; color: var(--color-maroon);">
                    ${currentLang === 'hi' ? '\u0915\u094b\u0908 \u092e\u093f\u0932\u093e\u0928 \u0928\u0939\u0940\u0902 \u092e\u093f\u0932\u093e' : 'No Matches Found'}
                </h4>
                <p style="color: var(--color-text-muted);">
                    ${currentLang === 'hi' ? '\u0915\u0943\u092a\u092f\u093e \u0905\u092a\u0928\u0940 \u092b\u093c\u093f\u0932\u094d\u091f\u0930 \u092a\u094d\u0930\u093e\u0925\u092e\u093f\u0915\u0924\u093e\u0913\u0902 \u0915\u093e \u0935\u093f\u0938\u094d\u0924\u093e\u0930 \u0915\u0930\u0947\u0902\u0964' : 'Try expanding your search filter criteria.'}
                </p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    let html = "";
    activeFilteredList.forEach(profile => {
        const nameVal = isLoggedIn
            ? (profile.name[currentLang] || profile.name['en'])
            : (profile.shortName[currentLang] || profile.shortName['en']);

        const eduVal = profile.education[currentLang] || profile.education['en'];
        const profVal = profile.profession[currentLang] || profile.profession['en'];
        const distVal = profile.district[currentLang] || profile.district['en'];

        const eduLabel = currentLang === 'hi' ? '\u0936\u093f\u0915\u094d\u0937\u093e' : 'Education';
        const profLabel = currentLang === 'hi' ? '\u0935\u094d\u092f\u0935\u0938\u093e\u092f' : 'Profession';
        const communityLabel = currentLang === 'hi' ? '\u0938\u092e\u093e\u091c' : 'Community';

        const ctaText = isLoggedIn
            ? (currentLang === 'hi' ? '\u0930\u0941\u091a\u093f \u092d\u0947\u091c\u0947\u0902' : 'Send Interest')
            : (currentLang === 'hi' ? '\u0935\u093f\u0935\u0930\u0923 \u0905\u0928\u0932\u0949\u0915 \u0915\u0930\u0947\u0902' : 'Unlock Details');

        const clickAction = isLoggedIn
            ? `handleSendInterest(this, ${profile.id}, '${nameVal.replace(/'/g, "\\'")}')`
            : `openAuthModal('login')`;

        const viewDetailText = currentLang === 'hi' ? '\u092a\u0942\u0930\u093e \u092a\u094d\u0930\u094b\u092b\u093c\u093e\u0907\u0932' : 'View Profile';

        const encodedName = encodeURIComponent(profile.name.en);

        html += `
            <div class="profile-card" onclick="openProfileModal(${profile.id})" style="cursor:pointer;">
                <div class="profile-image-container">
                    <img
                        src="${profile.image}"
                        class="profile-image"
                        alt="${nameVal}"
                        onerror="this.src='https://ui-avatars.com/api/?name=${encodedName}&background=800020&color=fff&size=300&bold=true'"
                        onclick="event.stopPropagation(); openPhotoLightbox('${profile.image}', '${profile.name.en}')"
                        title="Click to enlarge photo"
                    >
                    <div class="profile-photo-zoom-hint">&#128269;</div>
                    <div class="profile-badge">${currentLang === 'hi' ? (profile.gender === 'Bride' ? '\u0935\u0927\u0942' : '\u0935\u0930') : profile.gender}</div>
                    ${profile.verified ? `<div class="profile-verified-badge"><i data-lucide="shield-check" style="width: 14px; height: 14px;"></i><span>${currentLang === 'hi' ? '\u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924' : 'Verified'}</span></div>` : ''}
                </div>
                <div class="profile-info">
                    <h3 class="profile-name">${nameVal}</h3>
                    <div class="profile-quick-tags">
                        <span class="profile-tag"><i data-lucide="calendar" style="width:12px;height:12px;"></i> ${profile.age} yrs</span>
                        <span class="profile-tag"><i data-lucide="ruler" style="width:12px;height:12px;"></i> ${profile.height}</span>
                        <span class="profile-tag"><i data-lucide="map-pin" style="width:12px;height:12px;"></i> ${distVal}</span>
                    </div>
                    <table class="profile-details-table">
                        <tr>
                            <td class="label-td">${eduLabel}</td>
                            <td class="val-td">${eduVal}</td>
                        </tr>
                        <tr>
                            <td class="label-td">${profLabel}</td>
                            <td class="val-td">${profVal}</td>
                        </tr>
                        <tr>
                            <td class="label-td">${communityLabel}</td>
                            <td class="val-td">${profile.community}</td>
                        </tr>
                    </table>
                    ${!isLoggedIn ? `<p class="profile-lock-notice">&#128274; ${currentLang === 'hi' ? '\u0917\u094b\u0924\u094d\u0930 \u0914\u0930 \u0938\u0902\u092a\u0930\u094d\u0915 \u091b\u093f\u092a\u0947 \u0939\u0948\u0902' : 'Gotra & contact details hidden'}</p>` : ''}
                    <div class="profile-card-actions">
                        <button class="btn-large btn-outline profile-view-btn" onclick="event.stopPropagation(); openProfileModal(${profile.id})">
                            <i data-lucide="eye"></i>
                            <span>${viewDetailText}</span>
                        </button>
                        <button class="btn-large btn-primary ${isLoggedIn ? 'pulse-interest' : ''}" onclick="event.stopPropagation(); ${clickAction}">
                            <i data-lucide="${isLoggedIn ? 'heart' : 'lock'}"></i>
                            <span>${ctaText}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    lucide.createIcons();
}

// ============================================
// PHOTO LIGHTBOX (Full-screen image viewer)
// ============================================
function openPhotoLightbox(imageSrc, personName) {
    const existing = document.getElementById('photo-lightbox');
    if (existing) existing.remove();

    const encodedName = encodeURIComponent(personName);
    const lightbox = document.createElement('div');
    lightbox.id = 'photo-lightbox';
    lightbox.className = 'photo-lightbox';
    lightbox.innerHTML = `
        <div class="photo-lightbox-backdrop" onclick="closePhotoLightbox()"></div>
        <div class="photo-lightbox-content">
            <button class="photo-lightbox-close" onclick="closePhotoLightbox()">
                <i data-lucide="x" style="width:24px;height:24px;"></i>
            </button>
            <img src="${imageSrc}" alt="${personName}" class="photo-lightbox-img"
                onerror="this.src='https://ui-avatars.com/api/?name=${encodedName}&background=800020&color=fff&size=600&bold=true'">
            <div class="photo-lightbox-caption">${personName}</div>
        </div>
    `;
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => lightbox.classList.add('active'));
    lucide.createIcons();
}

function closePhotoLightbox() {
    const lightbox = document.getElementById('photo-lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        setTimeout(() => { lightbox.remove(); document.body.style.overflow = ''; }, 300);
    }
}

// ============================================
// PROFILE DETAIL MODAL
// ============================================
function openProfileModal(profileId) {
    const profile = matrimonialProfiles.find(p => p.id === profileId);
    if (!profile) return;

    const existing = document.getElementById('profile-detail-modal');
    if (existing) existing.remove();

    const lang = currentLang;
    const nameVal = profile.name[lang] || profile.name['en'];
    const eduVal = profile.education[lang] || profile.education['en'];
    const profVal = profile.profession[lang] || profile.profession['en'];
    const distVal = profile.district[lang] || profile.district['en'];
    const encodedName = encodeURIComponent(profile.name.en);

    // Helper for bilingual labels
    const t = (en, hi) => lang === 'hi' ? hi : en;

    let gotraSection = '';
    let contactSection = '';
    let familySection = '';

    if (isLoggedIn) {
        const gotraSelfVal = profile.gotraSelf[lang] || profile.gotraSelf['en'];
        const gotraMotherVal = profile.gotraMother[lang] || profile.gotraMother['en'];
        const fatherVal = profile.fatherName[lang] || profile.fatherName['en'];
        const motherVal = profile.motherName[lang] || profile.motherName['en'];
        const parOccVal = profile.parentsOccupation[lang] || profile.parentsOccupation['en'];
        const famTypeVal = profile.familyType[lang] || profile.familyType['en'];
        const addressVal = profile.address[lang] || profile.address['en'];
        const contactVal = profile.contact;
        const dobVal = profile.dob[lang] || profile.dob['en'];
        const hasContact = contactVal && contactVal !== '-';

        gotraSection = `
            <div class="pmodal-section">
                <div class="pmodal-section-title">&#9876; ${t('Gotra (Lineage)', '\u0917\u094b\u0924\u094d\u0930 (\u0935\u0902\u0936)')}</div>
                <div class="pmodal-grid">
                    <div class="pmodal-row">
                        <span class="pmodal-label">${t('Gotra (Self)', '\u0917\u094b\u0924\u094d\u0930 (\u0938\u094d\u0935\u092f\u0902)')}</span>
                        <span class="pmodal-value pmodal-gotra">${gotraSelfVal}</span>
                    </div>
                    <div class="pmodal-row">
                        <span class="pmodal-label">${t('Gotra (Mother)', '\u0917\u094b\u0924\u094d\u0930 (\u092e\u093e\u0924\u093e)')}</span>
                        <span class="pmodal-value pmodal-gotra">${gotraMotherVal}</span>
                    </div>
                </div>
            </div>`;

        familySection = `
            <div class="pmodal-section">
                <div class="pmodal-section-title">&#128106; ${t('Family Details', '\u092a\u0930\u093f\u0935\u093e\u0930 \u0935\u093f\u0935\u0930\u0923')}</div>
                <div class="pmodal-grid">
                    <div class="pmodal-row"><span class="pmodal-label">${t('Father', '\u092a\u093f\u0924\u093e')}</span><span class="pmodal-value">${fatherVal}</span></div>
                    <div class="pmodal-row"><span class="pmodal-label">${t('Mother', '\u092e\u093e\u0924\u093e')}</span><span class="pmodal-value">${motherVal}</span></div>
                    <div class="pmodal-row"><span class="pmodal-label">${t('Family Type', '\u092a\u0930\u093f\u0935\u093e\u0930 \u0915\u093e \u092a\u094d\u0930\u0915\u093e\u0930')}</span><span class="pmodal-value">${famTypeVal}</span></div>
                    <div class="pmodal-row"><span class="pmodal-label">${t('Brothers', '\u092d\u093e\u0908')}</span><span class="pmodal-value">${profile.brothers}</span></div>
                    <div class="pmodal-row"><span class="pmodal-label">${t('Sisters', '\u092c\u0939\u0928\u0947\u0902')}</span><span class="pmodal-value">${profile.sisters}</span></div>
                    <div class="pmodal-row"><span class="pmodal-label">${t("Parents' Occ.", '\u0905\u092d\u093f\u092d\u093e\u0935\u0915 \u0935\u094d\u092f\u0935\u0938\u093e\u092f')}</span><span class="pmodal-value">${parOccVal}</span></div>
                    ${dobVal && dobVal !== '-' ? `<div class="pmodal-row"><span class="pmodal-label">${t('Date of Birth', '\u091c\u0928\u094d\u092e \u0924\u093f\u0925\u093f')}</span><span class="pmodal-value">${dobVal}</span></div>` : ''}
                    ${addressVal && addressVal !== '-' ? `<div class="pmodal-row"><span class="pmodal-label">${t('Address', '\u092a\u0924\u093e')}</span><span class="pmodal-value">${addressVal}</span></div>` : ''}
                </div>
            </div>`;

        contactSection = `
            <div class="pmodal-contact-box">
                <i data-lucide="phone" style="width:20px;height:20px;"></i>
                <div>
                    <div style="font-size:12px;color:var(--color-text-muted);font-weight:600;">${t('Contact Number', '\u0938\u0902\u092a\u0930\u094d\u0915 \u0928\u0902\u092c\u0930')}</div>
                    ${hasContact
                        ? `<a href="tel:+91${contactVal}" class="pmodal-contact-link">+91 ${contactVal}</a>`
                        : `<span class="pmodal-value">-</span>`}
                </div>
            </div>`;
    } else {
        gotraSection = `
            <div class="pmodal-section">
                <div class="pmodal-section-title">&#9876; ${t('Gotra (Lineage)', '\u0917\u094b\u0924\u094d\u0930 (\u0935\u0902\u0936)')}</div>
                <div class="pmodal-locked-notice">
                    <i data-lucide="lock" style="width:20px;height:20px;"></i>
                    <div>
                        <div style="font-weight:700;">${t('Restricted Access', '\u092a\u094d\u0930\u0924\u093f\u092c\u0902\u0927\u093f\u0924 \u092a\u0939\u0941\u0902\u091a')}</div>
                        <div style="font-size:13px;margin-top:2px;">${t('Login to view full Gotra details', '\u0917\u094b\u0924\u094d\u0930 \u0935\u093f\u0935\u0930\u0923 \u0926\u0947\u0916\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0932\u0949\u0917\u093f\u0928 \u0915\u0930\u0947\u0902')}</div>
                    </div>
                </div>
            </div>`;
        contactSection = `
            <div class="pmodal-locked-notice">
                <i data-lucide="phone-off" style="width:20px;height:20px;"></i>
                <div>
                    <div style="font-weight:700;">${t('Contact Hidden', '\u0938\u0902\u092a\u0930\u094d\u0915 \u091b\u093f\u092a\u093e \u0939\u0941\u0906 \u0939\u0948')}</div>
                    <div style="font-size:13px;margin-top:2px;">${t('Login to reveal contact details', '\u0938\u0902\u092a\u0930\u094d\u0915 \u0935\u093f\u0935\u0930\u0923 \u0926\u0947\u0916\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0932\u0949\u0917\u093f\u0928 \u0915\u0930\u0947\u0902')}</div>
                </div>
            </div>`;
    }

    const modal = document.createElement('div');
    modal.id = 'profile-detail-modal';
    modal.className = 'pmodal-overlay';
    modal.innerHTML = `
        <div class="pmodal-backdrop" onclick="closeProfileModal()"></div>
        <div class="pmodal-box">
            <button class="pmodal-close" onclick="closeProfileModal()">
                <i data-lucide="x" style="width:22px;height:22px;"></i>
            </button>

            <div class="pmodal-header">
                <div class="pmodal-photo-wrap" onclick="openPhotoLightbox('${profile.image}', '${profile.name.en}')" title="Click to enlarge">
                    <img src="${profile.image}" alt="${nameVal}" class="pmodal-photo"
                        onerror="this.src='https://ui-avatars.com/api/?name=${encodedName}&background=800020&color=fff&size=300&bold=true'">
                    <div class="pmodal-photo-hint">&#128269;</div>
                </div>
                <div class="pmodal-header-info">
                    <h2 class="pmodal-name">${nameVal}</h2>
                    <div class="pmodal-badges">
                        ${profile.verified ? `<span class="pmodal-badge-verified"><i data-lucide="shield-check" style="width:13px;height:13px;"></i> ${t('Verified', '\u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924')}</span>` : ''}
                        <span class="pmodal-badge-gender">${t(profile.gender, profile.gender === 'Groom' ? '\u0935\u0930' : '\u0935\u0927\u0942')}</span>
                        <span class="pmodal-badge-community">${profile.community}</span>
                    </div>
                    <div class="pmodal-quick-stats">
                        <div class="pmodal-stat"><span class="pmodal-stat-num">${profile.age}</span><span class="pmodal-stat-label">${t('Yrs', '\u0935\u0930\u094d\u0937')}</span></div>
                        <div class="pmodal-stat-divider"></div>
                        <div class="pmodal-stat"><span class="pmodal-stat-num">${profile.height}</span><span class="pmodal-stat-label">${t('Height', '\u090a\u0902\u091a\u093e\u0908')}</span></div>
                        <div class="pmodal-stat-divider"></div>
                        <div class="pmodal-stat"><span class="pmodal-stat-num">${distVal}</span><span class="pmodal-stat-label">${t('District', '\u091c\u093f\u0932\u093e')}</span></div>
                    </div>
                </div>
            </div>

            <div class="pmodal-body">
                <div class="pmodal-section">
                    <div class="pmodal-section-title">&#128203; ${t('Personal Information', '\u0935\u094d\u092f\u0915\u094d\u0924\u093f\u0917\u0924 \u091c\u093e\u0928\u0915\u093e\u0930\u0940')}</div>
                    <div class="pmodal-grid">
                        <div class="pmodal-row"><span class="pmodal-label">${t('Education', '\u0936\u093f\u0915\u094d\u0937\u093e')}</span><span class="pmodal-value">${eduVal}</span></div>
                        <div class="pmodal-row"><span class="pmodal-label">${t('Profession', '\u0935\u094d\u092f\u0935\u0938\u093e\u092f')}</span><span class="pmodal-value">${profVal}</span></div>
                        <div class="pmodal-row"><span class="pmodal-label">${t('Community', '\u0938\u092e\u093e\u091c')}</span><span class="pmodal-value">${profile.community}</span></div>
                        <div class="pmodal-row"><span class="pmodal-label">${t('District', '\u091c\u093f\u0932\u093e')}</span><span class="pmodal-value">${distVal}</span></div>
                    </div>
                </div>

                ${gotraSection}
                ${familySection}
                ${contactSection}

                <div class="pmodal-cta">
                    ${isLoggedIn
                        ? `<button class="btn-large btn-primary" style="width:100%;" onclick="closeProfileModal(); setTimeout(()=>handleSendInterestById(${profile.id}), 100)">
                               <i data-lucide="heart"></i>
                               <span>${t('Send Marriage Interest', '\u0935\u093f\u0935\u093e\u0939 \u0938\u0902\u092c\u0902\u0927 \u0915\u0940 \u0930\u0941\u091a\u093f \u092d\u0947\u091c\u0947\u0902')}</span>
                           </button>`
                        : `<button class="btn-large btn-primary" style="width:100%;" onclick="closeProfileModal(); openAuthModal('login')">
                               <i data-lucide="log-in"></i>
                               <span>${t('Login to View Full Details', '\u0932\u0949\u0917\u093f\u0928 \u0915\u0930\u0947\u0902 \u2014 \u092a\u0942\u0930\u093e \u0935\u093f\u0935\u0930\u0923 \u0926\u0947\u0916\u0947\u0902')}</span>
                           </button>`
                    }
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.classList.add('active'));
    lucide.createIcons();
}

function closeProfileModal() {
    const modal = document.getElementById('profile-detail-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 300);
    }
}

function handleSendInterestById(profileId) {
    const profile = matrimonialProfiles.find(p => p.id === profileId);
    if (!profile) return;
    const nameVal = profile.name[currentLang] || profile.name['en'];
    showToast(currentLang === 'hi'
        ? `${nameVal} \u0915\u0947 \u092a\u0930\u093f\u0935\u093e\u0930 \u0915\u094b \u0935\u093f\u0935\u093e\u0939 \u0938\u0902\u092c\u0902\u0927 \u0915\u0940 \u0930\u0941\u091a\u093f \u092d\u0947\u091c\u0940 \u0917\u0908\u0964`
        : `Marriage interest request sent to the family of ${nameVal}.`, 'success');
}

// ============================================
// DYNAMIC SEARCH & FILTER ALGORITHM
// ============================================
function parseHeightToInches(heightStr) {
    if (!heightStr) return 0;
    const match = heightStr.match(/(\d+)'(\d+)/);
    if (match) {
        return (parseInt(match[1]) * 12) + parseInt(match[2]);
    }
    return 0;
}

function performProfileSearch() {
    const genderSel = document.getElementById("search-gender").value;
    const ageMin = parseInt(document.getElementById("search-age-min").value);
    const ageMax = parseInt(document.getElementById("search-age-max").value);
    const commSel = document.getElementById("search-community").value;
    const distSel = document.getElementById("search-district").value;
    const gotraQuery = document.getElementById("search-gotra").value.trim().toLowerCase();
    const gotraExcludeQuery = document.getElementById("search-gotra-exclude").value.trim().toLowerCase();
    const heightMinVal = document.getElementById("search-height-min").value;
    const keywordQuery = document.getElementById("search-keyword").value.trim().toLowerCase();
    const verifiedOnly = document.getElementById("search-verified").checked;
    const sortVal = document.getElementById("search-sort").value;

    showToast(currentLang === 'hi' ? '\u092b\u093c\u093f\u0932\u094d\u091f\u0930 \u0932\u093e\u0917\u0942 \u0939\u094b \u0930\u0939\u0947 \u0939\u0948\u0902...' : 'Applying profile filters...', 'info');

    activeFilteredList = matrimonialProfiles.filter(profile => {
        if (profile.gender !== genderSel) return false;
        if (profile.age < ageMin || profile.age > ageMax) return false;
        if (commSel !== 'all' && profile.community !== commSel) return false;
        if (distSel !== 'all' && profile.district.en !== distSel) return false;

        if (gotraQuery) {
            const selfEn = (profile.gotraSelf.en || "").toLowerCase();
            const selfHi = (profile.gotraSelf.hi || "").toLowerCase();
            const motherEn = (profile.gotraMother.en || "").toLowerCase();
            const motherHi = (profile.gotraMother.hi || "").toLowerCase();
            if (!selfEn.includes(gotraQuery) && !selfHi.includes(gotraQuery) &&
                !motherEn.includes(gotraQuery) && !motherHi.includes(gotraQuery)) return false;
        }

        if (gotraExcludeQuery) {
            const selfEn = (profile.gotraSelf.en || "").toLowerCase();
            const selfHi = (profile.gotraSelf.hi || "").toLowerCase();
            const motherEn = (profile.gotraMother.en || "").toLowerCase();
            const motherHi = (profile.gotraMother.hi || "").toLowerCase();
            if (selfEn.includes(gotraExcludeQuery) || selfHi.includes(gotraExcludeQuery) ||
                motherEn.includes(gotraExcludeQuery) || motherHi.includes(gotraExcludeQuery)) return false;
        }

        if (heightMinVal !== 'all') {
            if (parseHeightToInches(profile.height) < parseInt(heightMinVal)) return false;
        }

        if (keywordQuery) {
            const eduEn = (profile.education.en || "").toLowerCase();
            const eduHi = (profile.education.hi || "").toLowerCase();
            const profEn = (profile.profession.en || "").toLowerCase();
            const profHi = (profile.profession.hi || "").toLowerCase();
            if (!eduEn.includes(keywordQuery) && !eduHi.includes(keywordQuery) &&
                !profEn.includes(keywordQuery) && !profHi.includes(keywordQuery)) return false;
        }

        if (verifiedOnly && !profile.verified) return false;
        return true;
    });

    if (sortVal === 'age-asc') activeFilteredList.sort((a, b) => a.age - b.age);
    else if (sortVal === 'age-desc') activeFilteredList.sort((a, b) => b.age - a.age);
    else if (sortVal === 'height-asc') activeFilteredList.sort((a, b) => parseHeightToInches(a.height) - parseHeightToInches(b.height));
    else if (sortVal === 'height-desc') activeFilteredList.sort((a, b) => parseHeightToInches(b.height) - parseHeightToInches(a.height));
    else activeFilteredList.sort((a, b) => { if (a.verified && !b.verified) return -1; if (!a.verified && b.verified) return 1; return a.id - b.id; });

    setTimeout(() => {
        renderProfilesGrid();
        showToast(currentLang === 'hi'
            ? `\u0916\u094b\u091c \u092a\u0942\u0930\u0940 \u0939\u0941\u0908\u0964 ${activeFilteredList.length} \u092e\u0948\u091a \u092e\u093f\u0932\u0947\u0964`
            : `Search complete. Found ${activeFilteredList.length} matches.`, 'success');
    }, 450);
}

function resetProfileSearch() {
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

    showToast(currentLang === 'hi' ? '\u092b\u093c\u093f\u0932\u094d\u091f\u0930 \u0930\u0940\u0938\u0947\u091f \u0915\u0930 \u0926\u093f\u090f \u0917\u090f \u0939\u0948\u0902\u0964' : 'Search filters have been reset.', 'info');

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
    btn.innerHTML = `<i data-lucide="check"></i> <span>${currentLang === 'hi' ? '\u0930\u0941\u091a\u093f \u092d\u0947\u091c\u0940 \u0917\u0908 \u2713' : 'Interest Sent \u2713'}</span>`;
    lucide.createIcons();

    let received = parseInt(sessionStorage.getItem('interestsCount')) || 28;
    sessionStorage.setItem('interestsCount', received + 1);

    showToast(currentLang === 'hi'
        ? `${name} \u0915\u0947 \u092a\u0930\u093f\u0935\u093e\u0930 \u0915\u094b \u0935\u093f\u0935\u093e\u0939 \u0938\u0902\u092c\u0902\u0927 \u0915\u0940 \u0930\u0941\u091a\u093f \u092d\u0947\u091c\u0940 \u0917\u0908\u0964`
        : `Marriage interest request sent to the family of ${name}.`, 'success');
}

// ============================================
// BILINGUAL LANGUAGE SWITCHER
// ============================================
function applyLanguage(lang, showToastNotification = true) {
    currentLang = lang;
    sessionStorage.setItem('preferredLang', lang);

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

    document.querySelectorAll('[data-en]').forEach(el => {
        el.innerText = lang === 'hi' ? el.getAttribute('data-hi') : el.getAttribute('data-en');
    });

    document.querySelectorAll('[data-placeholder-en]').forEach(el => {
        el.placeholder = lang === 'hi' ? el.getAttribute('data-placeholder-hi') : el.getAttribute('data-placeholder-en');
    });

    renderProfilesGrid();

    if (showToastNotification) {
        showToast(lang === 'hi' ? '\u092d\u093e\u0937\u093e \u092c\u0926\u0932\u0915\u0930 \u0939\u093f\u0902\u0926\u0940 \u0915\u0930 \u0926\u0940 \u0917\u0908 \u0939\u0948\u0964' : 'Language switched to English.', 'info');
    }
}

function toggleLanguage(lang) {
    applyLanguage(lang, true);
}

// ============================================
// POPUP AUTH MODAL ACTIONS
// ============================================
function openAuthModal(tab = 'login') {
    const modal = document.getElementById("auth-modal");
    if (modal) { modal.classList.add("active"); toggleModalTab(tab); }
}

function closeAuthModal() {
    const modal = document.getElementById("auth-modal");
    if (modal) modal.classList.remove("active");
}

function toggleModalTab(tab) {
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const formLogin = document.getElementById("form-login-content");
    const formRegister = document.getElementById("form-register-content");

    if (tab === 'login') {
        tabLogin.classList.add("active"); tabRegister.classList.remove("active");
        formLogin.style.display = "flex"; formRegister.style.display = "none";
    } else {
        tabRegister.classList.add("active"); tabLogin.classList.remove("active");
        formRegister.style.display = "flex"; formLogin.style.display = "none";
    }
}

function submitMockLogin() {
    const number = document.getElementById("login-phone").value;
    if (!number) {
        showToast(currentLang === 'hi' ? '\u0915\u0943\u092a\u092f\u093e \u092e\u094b\u092c\u093e\u0907\u0932 \u0928\u0902\u092c\u0930 \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902\u0964' : 'Please enter your mobile number.', 'error');
        return;
    }
    showToast(currentLang === 'hi' ? '\u0915\u094d\u0930\u0947\u0921\u0947\u0902\u0936\u093f\u092f\u0932 \u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924 \u0939\u094b \u0930\u0939\u0947 \u0939\u0948\u0902...' : 'Verifying family credentials...', 'info');

    setTimeout(() => {
        sessionStorage.setItem('isLoggedIn', 'true');
        closeAuthModal();
        applySessionStateUI();
        renderProfilesGrid();
        showToast(currentLang === 'hi'
            ? '\u0938\u0924\u094d\u092f\u093e\u092a\u0928 \u0938\u092b\u0932! \u0917\u094b\u0924\u094d\u0930 \u0914\u0930 \u092a\u0930\u093f\u0935\u093e\u0930 \u0935\u093f\u0935\u0930\u0923 \u0905\u0928\u0932\u0949\u0915 \u0939\u0948\u0902\u0964'
            : 'Verification successful! Clan Gotras & family details are now unlocked.', 'success');
    }, 1000);
}

function submitMockRegister() {
    showToast(currentLang === 'hi' ? '\u0938\u092b\u0932\u0924\u093e\u092a\u0942\u0930\u094d\u0935\u0915 \u092a\u0902\u091c\u0940\u0915\u0943\u0924! \u0915\u0943\u092a\u092f\u093e \u0932\u0949\u0917\u093f\u0928 \u0915\u0930\u0947\u0902\u0964' : 'Registered successfully! Please login.', 'success');
    setTimeout(() => toggleModalTab('login'), 1000);
}

function handleLogout() {
    sessionStorage.removeItem('isLoggedIn');
    applySessionStateUI();
    renderProfilesGrid();
    showToast(currentLang === 'hi' ? '\u0932\u0949\u0917 \u0906\u0909\u091f \u0915\u093f\u092f\u093e \u0917\u092f\u093e\u0964' : 'Logged out successfully.', 'info');
}

// ============================================
// MOBILE NAVIGATION DRAWER
// ============================================
function toggleMobileMenu() {
    const drawer = document.getElementById("mobile-drawer");
    if (drawer) drawer.classList.toggle("active");
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

    toast.innerHTML = `<i data-lucide="${iconName}"></i><span>${message}</span>`;
    container.appendChild(toast);
    lucide.createIcons({ attrs: { class: 'toast-icon' } });

    setTimeout(() => {
        toast.style.animation = 'toast-slide-in 0.3s ease-out reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}
