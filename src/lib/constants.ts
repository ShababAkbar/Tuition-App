// Subject categories with subcategories
export const SUBJECT_CATEGORIES = {
  "Computer Science": [
    "Python",
    "C",
    "C++",
    "Java",
    "JavaScript",
    "Data Structures",
    "Algorithms",
    "Operating Systems",
    "Computer Networks",
    "Database Management",
    "Web Development",
    "Mobile Development"
  ],
  "Mathematics": [
    "Algebra",
    "Calculus",
    "Trigonometry",
    "Geometry",
    "Statistics",
    "Probability",
    "Linear Algebra",
    "Differential Equations"
  ],
  "Physics": [
    "Mechanics",
    "Thermodynamics",
    "Electricity & Magnetism",
    "Optics",
    "Modern Physics",
    "Quantum Physics"
  ],
  "Chemistry": [
    "Organic Chemistry",
    "Inorganic Chemistry",
    "Physical Chemistry",
    "Analytical Chemistry",
    "Biochemistry"
  ],
  "Biology": [
    "Botany",
    "Zoology",
    "Genetics",
    "Microbiology",
    "Ecology",
    "Human Biology"
  ],
  "English": [
    "Grammar",
    "Literature",
    "Composition",
    "Reading Comprehension",
    "Creative Writing"
  ],
  "Urdu": [
    "Grammar",
    "Literature",
    "Composition"
  ],
  "Other Languages": [
    "Arabic",
    "French",
    "German",
    "Spanish",
    "Chinese"
  ],
  "Business": [
    "Accounting",
    "Economics",
    "Business Studies",
    "Finance",
    "Marketing"
  ],
  "Other": []
};

// Pakistani cities
export const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Hyderabad",
  "Gujranwala",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Sargodha",
  "Bahawalpur",
  "Sukkur",
  "Larkana",
  "Mardan",
  "Abbottabad",
  "Jhang",
  "Rahim Yar Khan",
  "Sahiwal",
  "Okara",
  "Wah Cantt",
  "Dera Ghazi Khan",
  "Mirpur Khas",
  "Nawabshah",
  "Mingora",
  "Chiniot",
  "Kamoke",
  "Mandi Bahauddin",
  "Jhelum",
  "Sadiqabad",
  "Jacobabad",
  "Shikarpur",
  "Khanewal",
  "Hafizabad",
  "Kohat",
  "Muzaffargarh",
  "Khanpur",
  "Gojra",
  "Mandi Burewala",
  "Kasur",
  "Attock",
  "Other"
];

// Pakistani provinces/states
export const PAKISTAN_STATES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir",
  "Islamabad Capital Territory"
];

// Validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+92|0)?[0-9]{10}$/,
  postalCode: /^[0-9]{5}$/,
  cnic: /^[0-9]{13}$/
};

// Admin User ID - loaded from environment variable only (not hardcoded for security)
export const ADMIN_USER_ID = import.meta.env.VITE_ADMIN_USER_ID;
