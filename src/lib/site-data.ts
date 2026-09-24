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
}

export const PROGRAMS: Program[] = [
  {
    id: "pharm-d",
    title: "Pharm-D",
    full: "Doctor of Pharmacy",
    duration: "5 Years",
    years: 5,
    image: "/images/program-pharm-d.png",
    tagline: "Heal lives behind every prescription.",
    points: [
      "Comprehensive pharmacy curriculum",
      "Hospital & community rotations",
      "Licensed pharmacy career pathway",
    ],
    careers: ["Community Pharmacist", "Hospital Pharmacist", "Pharma Industry", "Research"],
    accent: "from-navy-800 to-navy-950",
  },
  {
    id: "dpt",
    title: "DPT",
    full: "Doctor of Physical Therapy",
    duration: "5 Years",
    years: 5,
    image: "/images/dpt.png",
    tagline: "Restore movement. Rebuild lives.",
    points: [
      "Hands-on clinical training",
      "Modern rehab labs & equipment",
      "Hospital internship exposure",
    ],
    careers: ["Clinical DPT", "Sports Rehab", "Rehab Centers", "Private Practice"],
    accent: "from-brand-red to-navy-900",
  },
  {
    id: "bscs",
    title: "BSCS",
    full: "BS Computer Science",
    duration: "4 Years",
    years: 4,
    image: "/images/program-bscs.png",
    tagline: "Code your future. Create limitless possibilities.",
    points: [
      "Modern labs & real-world projects",
      "AI, data science & software engineering",
      "Startup & industry mentorship",
    ],
    careers: ["Software Engineer", "AI / Data Science", "Cyber Security", "Entrepreneurship"],
    accent: "from-navy-900 via-navy-800 to-brand-red",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Programs", href: "#programs" },
  { label: "Welfare", href: "#welfare" },
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
