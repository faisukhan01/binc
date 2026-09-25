export const SITE = {
  name: "Bright International College",
  shortName: "BINC",
  tagline: "Excellence in Education",
  taglineUr: "روشن مستقبل",
  term: "Fall 2026",
  address: "57 Sector A, GECHS Township, Near Pindi Stop, Lahore",
  whatsapp: "0324-3334977",
  whatsappIntl: "923243334977",
  phone: "042-35154958",
  email: "info@binc.edu.pk",
  website: "www.binc.edu.pk",
  socials: {
    facebook: "https://www.facebook.com/share/19BdRHqhED/",
    instagram: "https://www.instagram.com/brightintlcollege",
    youtube: "https://www.youtube.com/@brightinternatinalcollege",
  },
};

export interface Program {
  id: string;
  title: string;
  full: string;
  duration: string;
  years: number;
  image: string;
  tagline: string;
  points: string[];
  careers: string[];
  accent: string; // tailwind gradient classes
  overview: string;
  eligibility: string[];
  curriculum: { year: string; focus: string }[];
}

export const PROGRAMS: Program[] = [
  {
    id: "pharm-d",
    title: "Pharm-D",
    full: "Doctor of Pharmacy",
    duration: "5 Years",
    years: 5,
    image: "/images/real/pharmacy-student.jpg",
    tagline: "Heal lives behind every prescription.",
    points: [
      "Comprehensive pharmacy curriculum",
      "Hospital & community rotations",
      "Licensed pharmacy career pathway",
    ],
    careers: ["Community Pharmacist", "Hospital Pharmacist", "Pharma Industry", "Research"],
    accent: "from-navy-800 to-navy-950",
    overview:
      "Pharm-D is a five-year professional doctorate that trains you to become a licensed pharmacy professional — from the science behind medicines to hands-on patient care in hospitals and community pharmacies.",
    eligibility: [
      "Intermediate (FSc Pre-Medical) or equivalent qualification",
      "Original academic documents (Matric & Intermediate)",
      "CNIC / B-Form and recent passport-size photographs",
    ],
    curriculum: [
      { year: "Year 1", focus: "Anatomy, physiology & pharmaceutical chemistry foundations" },
      { year: "Year 2", focus: "Pharmacology & pharmaceutics — how drugs work and are formulated" },
      { year: "Year 3", focus: "Pharmaceutical technology & medicinal chemistry" },
      { year: "Year 4", focus: "Clinical, hospital & community pharmacy practice" },
      { year: "Year 5", focus: "Clinical rotations, research project & professional internship" },
    ],
  },
  {
    id: "dpt",
    title: "DPT",
    full: "Doctor of Physical Therapy",
    duration: "5 Years",
    years: 5,
    image: "/images/real/physio-1.jpg",
    tagline: "Restore movement. Rebuild lives.",
    points: [
      "Hands-on clinical training",
      "Modern rehab labs & equipment",
      "Hospital internship exposure",
    ],
    careers: ["Clinical DPT", "Sports Rehab", "Rehab Centers", "Private Practice"],
    accent: "from-brand-red to-navy-900",
    overview:
      "DPT is a five-year clinical doctorate focused on physical rehabilitation — you learn to assess, diagnose and treat movement disorders through evidence-based therapy in hospitals, sports settings and private practice.",
    eligibility: [
      "Intermediate (FSc Pre-Medical) or equivalent qualification",
      "Original academic documents (Matric & Intermediate)",
      "CNIC / B-Form and recent passport-size photographs",
    ],
    curriculum: [
      { year: "Year 1", focus: "Basic medical sciences — anatomy, physiology & kinesiology" },
      { year: "Year 2", focus: "Pathology, pharmacology & biomechanics" },
      { year: "Year 3", focus: "Therapeutic exercise, electrotherapy & assessment skills" },
      { year: "Year 4", focus: "Musculoskeletal, neuro & cardiopulmonary rehabilitation" },
      { year: "Year 5", focus: "Supervised clinical internships & research project" },
    ],
  },
  {
    id: "bscs",
    title: "BSCS",
    full: "BS Computer Science",
    duration: "4 Years",
    years: 4,
    image: "/images/real/cs-lab.jpg",
    tagline: "Code your future. Create limitless possibilities.",
    points: [
      "Modern labs & real-world projects",
      "AI, data science & software engineering",
      "Startup & industry mentorship",
    ],
    careers: ["Software Engineer", "AI / Data Science", "Cyber Security", "Entrepreneurship"],
    accent: "from-navy-900 via-navy-800 to-brand-red",
    overview:
      "BSCS is a four-year computing degree built around real-world projects — from programming fundamentals to modern AI and data science, with mentorship that prepares you for jobs, freelancing or your own startup.",
    eligibility: [
      "Intermediate (ICS / FSc / ICom / DAE) or equivalent qualification",
      "Original academic documents (Matric & Intermediate)",
      "CNIC / B-Form and recent passport-size photographs",
    ],
    curriculum: [
      { year: "Year 1", focus: "Programming fundamentals, mathematics & IT essentials" },
      { year: "Year 2", focus: "Data structures, OOP & database systems" },
      { year: "Year 3", focus: "Software engineering, operating systems, networks & AI" },
      { year: "Year 4", focus: "Specialization electives, final-year project & internship" },
    ],
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Programs", href: "#programs" },
  { label: "Welfare", href: "#welfare" },
  { label: "Admissions", href: "#admissions" },
  { label: "Campus Life", href: "#campus" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contact", href: "#contact" },
];

export const ADMISSION_STEPS = [
  {
    step: 1,
    title: "Apply Online",
    desc: "Fill the online admission form with your details and preferred program. It takes less than 2 minutes.",
    icon: "ClipboardEdit",
  },
  {
    step: 2,
    title: "Admissions Team Calls You",
    desc: "Our admissions office contacts you on WhatsApp or phone to verify details and guide the next steps.",
    icon: "PhoneCall",
  },
  {
    step: 3,
    title: "Submit Documents",
    desc: "Bring your academic documents, CNIC/B-Form and photographs to the campus — or send them on WhatsApp.",
    icon: "FileCheck",
  },
  {
    step: 4,
    title: "Confirm Your Seat",
    desc: "Pay the admission dues, receive your fee schedule and welcome kit — your Bright journey begins!",
    icon: "GraduationCap",
  },
];

export const FAQS = [
  {
    q: "When do admissions for Fall 2026 open and close?",
    a: "Admissions for Fall 2026 are open now. Seats are limited per program and filled on a first-come, merit basis — apply as early as possible to secure your seat.",
  },
  {
    q: "Which programs are offered at Bright International College?",
    a: "We currently offer Pharm-D (Doctor of Pharmacy, 5 Years), DPT (Doctor of Physical Therapy, 5 Years) and BSCS (BS Computer Science, 4 Years).",
  },
  {
    q: "Is the admission really free for welfare workers?",
    a: "Yes — eligible social welfare workers registered under the welfare foundation (PWWF) get 100% free admission support. Contact the admissions office on WhatsApp (0324-3334977) for verification and eligibility.",
  },
  {
    q: "What documents are required for admission?",
    a: "You need your last academic transcripts/certificates (Matric & Intermediate), CNIC or B-Form, and recent passport-size photographs. Original documents are verified at the campus.",
  },
  {
    q: "Can I get fee information before applying?",
    a: "Absolutely. Submit the inquiry form or WhatsApp us at 0324-3334977 and our admissions team will share the complete fee structure, installment options and any welfare support you qualify for.",
  },
  {
    q: "Where is the campus located?",
    a: "Our campus is at 57 Sector A, GECHS Township, Near Pindi Stop, Lahore — easily accessible from all parts of the city.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Ayesha Khan",
    program: "Pharm-D, Year 3",
    quote:
      "The faculty here genuinely cares. Labs are well equipped and the hospital rotations gave me real confidence before my internship.",
    rating: 5,
  },
  {
    name: "Bilal Ahmed",
    program: "BSCS, Graduate",
    quote:
      "I built my first real-world project in my first year. The mentorship and coding culture at Bright helped me land my developer job.",
    rating: 5,
  },
  {
    name: "Hira Fatima",
    program: "DPT, Year 4",
    quote:
      "From modern rehab labs to supportive teachers — Bright gave me everything I needed to pursue my clinical career with confidence.",
    rating: 5,
  },
  {
    name: "Usman Tariq",
    program: "Pharm-D, Year 5",
    quote:
      "The welfare support program made my education possible when my family needed it most. Forever grateful to Bright International College.",
    rating: 5,
  },
];

/**
 * Fee & payment structure — fee amounts are shared personally by the
 * admissions office (they vary by session), so we present the *structure*
 * and a direct WhatsApp channel to receive the exact schedule.
 */
export const FEE_INFO = {
  includes: [
    { icon: "FlaskConical", label: "Modern Labs & Equipment", desc: "Pharmacy, rehab & computer labs included in tuition" },
    { icon: "BookOpen", label: "Library & Study Resources", desc: "Full library access, digital resources & past papers" },
    { icon: "Stethoscope", label: "Hospital Rotations", desc: "Clinical placements arranged by the college" },
    { icon: "BadgeCheck", label: "Exam & License Prep", desc: "Guidance for university exams & licensing steps" },
  ],
  payment: [
    { title: "Semester-wise Payment", desc: "Pay tuition twice a year at the start of each semester.", icon: "CalendarRange" },
    { title: "Easy Installments", desc: "Split semester dues into monthly installments on request.", icon: "Wallet" },
    { title: "Welfare 100% Free", desc: "Eligible PWWF welfare workers study completely free.", icon: "HeartHandshake" },
  ],
};

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  tag: string;
}

export const GALLERY: GalleryItem[] = [
  {
    src: "/images/real/pharmacy-lab.jpg",
    alt: "Pharmacy students training in the laboratory",
    caption: "Pharmacy Lab — hands-on training",
    tag: "Pharm-D",
  },
  {
    src: "/images/real/cs-lab.jpg",
    alt: "Computer lab with students coding",
    caption: "CS Lab — coding & AI projects",
    tag: "BSCS",
  },
  {
    src: "/images/real/physio-2.jpg",
    alt: "Physical therapy rehabilitation practice",
    caption: "Rehab Lab — DPT clinical practice",
    tag: "DPT",
  },
  {
    src: "/images/real/library.jpg",
    alt: "Library reading hall with students studying",
    caption: "Library — quiet study & research",
    tag: "Campus",
  },
  {
    src: "/images/real/students-campus.jpg",
    alt: "Students walking across the campus lawn",
    caption: "Campus Life — Township, Lahore",
    tag: "Campus",
  },
  {
    src: "/images/real/lecture.jpg",
    alt: "Professor lecturing students in a lecture hall",
    caption: "Lectures & Seminars — expert faculty",
    tag: "Events",
  },
  {
    src: "/images/real/graduation.jpg",
    alt: "Graduation caps thrown in celebration",
    caption: "Convocation — bright futures launched",
    tag: "Events",
  },
  {
    src: "/images/real/science-lab.jpg",
    alt: "Research microscope in the science laboratory",
    caption: "Research Labs — curiosity in practice",
    tag: "Campus",
  },
];
