// Real content extracted from https://idcbdtech.com/
import complementary from '../assets/projects/project-complementary-colors.jpg'
import couch from '../assets/projects/project-modern-couch.jpg'
import balloons from '../assets/projects/project-hot-air-balloons.jpg'
import difference from '../assets/projects/project-make-difference.jpg'
import sports from '../assets/projects/sports.jpg'
import shipping from '../assets/projects/shipping.jpg'
import alumni from '../assets/projects/alumni.jpg'
import bazarTop from '../assets/projects/bazarbag-top.jpg'
import bazarScroll from '../assets/projects/bazarbag-scroll.jpg'
import tgHydrant from '../assets/techno-guard/fire-hydrant.jpg'
import tgInspection from '../assets/techno-guard/sprinkler-inspection.jpg'
import tgSafety from '../assets/techno-guard/safety-equipment.jpg'
import tgBlanket from '../assets/techno-guard/fire-blanket.jpg'
import tgSprinkler from '../assets/techno-guard/sprinkler.jpg'
import tgExtinguishers from '../assets/techno-guard/extinguishers.jpg'
import tgFittingsCatalog from '../assets/techno-guard/fittings-catalog.jpg'
import tgGenerator from '../assets/techno-guard/generator.jpg'
import tgButterfly from '../assets/techno-guard/butterfly-valve.jpg'
import tgPneumatic from '../assets/techno-guard/pneumatic-fittings.jpg'
import tgBallValve from '../assets/techno-guard/ball-valve.jpg'
import tgSwingValve from '../assets/techno-guard/swing-valve.jpg'
import team from '../assets/about-team.jpg'
import logo from '../assets/logo.png'

export const brand = {
  name: 'IDC',
  full: 'Impressive Digital Communication',
  tagline: 'Where trust is in our hand',
  lines: ['Digital Marketing', 'Web Development', 'IT Solutions'],
  intro:
    'IDC is a modern digital service agency delivering innovative marketing, branding, and creative solutions. We help businesses grow through strategic digital campaigns, professional design, and impactful online presence using the latest technology and creative expertise.',
  logo,
}

export const servicesHeading = 'We are here to make your website look more elegant and stylish!'

export const services = [
  {
    title: 'Web Development',
    desc: 'Fast, secure and scalable websites and web apps built with modern technology — from a clean business site to a fully custom platform.',
    points: ['Custom websites & web applications', 'Front-end, back-end & full-stack builds', 'API & third-party integrations'],
  },
  {
    title: 'WordPress',
    desc: 'Professional WordPress websites that are easy to update yourself, quick to load and ready to grow with your business.',
    points: ['Custom themes & page-builder sites', 'WooCommerce online stores', 'Updates, backups & ongoing care'],
  },
  {
    title: 'UI/UX Design',
    desc: 'Interfaces that look great and feel effortless — designed around your users so visitors understand you quickly and take action.',
    points: ['User journeys & wireframes', 'Interactive prototypes', 'Mobile-first, conversion-focused layouts'],
  },
  {
    title: 'SQA Engineering',
    desc: 'Careful software quality assurance that catches bugs before your users do, so every release goes live with confidence.',
    points: ['Manual & automated testing', 'Functional, regression & performance tests', 'Clear bug reports & quality metrics'],
  },
  {
    title: 'Penetration Testing',
    desc: 'Ethical, permission-based security testing that finds the weak spots in your website, apps and network before attackers do.',
    points: ['Web, API & network assessments', 'OWASP Top 10 vulnerability checks', 'Detailed report with fix guidance'],
  },
  {
    title: 'ERP Solution',
    desc: 'One connected system for sales, inventory, accounts and HR, so your whole business runs from a single, real-time dashboard.',
    points: ['Inventory, sales & accounting modules', 'HR & payroll management', 'Live reports & dashboards'],
  },
  {
    title: 'Branding',
    desc: 'A clear, memorable brand identity — logo, colours, type and voice — that makes people recognise and trust you at first glance.',
    points: ['Logo & brand identity design', 'Brand guidelines & colour systems', 'Print & marketing materials'],
  },
  {
    title: 'Digital Marketing',
    desc: 'Data-driven campaigns that bring the right people to your business and turn clicks into loyal customers.',
    points: ['SEO & Google ranking strategy', 'Facebook, Instagram & Google Ads', 'Social media marketing & monthly reports'],
  },
  {
    title: 'Cloud Solutions',
    desc: 'Smart cloud solutions to store, manage, and grow your data with ease, powering your business with secure, flexible, and high-performance technology.',
    points: ['Fast SSD/NVMe cloud hosting', 'SSL security & backup protection', '24/7 technical support & monitoring'],
  },
  {
    title: 'Speed Optimization',
    desc: 'Improving website performance, load time, and user experience through smart coding and performance tuning — because every second counts.',
    points: ['Core Web Vitals & PageSpeed tuning', 'Image, code & caching optimization', 'Monthly performance tracking'],
  },
]

export const about = {
  years: 17,
  statement: 'years of experience helping people for best solutions',
  missionEyebrow: 'Learn more about our Missions',
  missionTitle: 'We aim to become a trusted tech resource for professionals, learners, and businesses.',
  missionText:
    'As technology evolves rapidly, IDC strives to bridge the gap between innovation and everyday use.',
  missionPoints: ['Clear and practical content', 'Focus on real-world use cases', 'A growing platform driven by curiosity and innovation'],
  loveTitle: 'We Love What We Do',
  loveIntro: 'At IDC, we focus on delivering value through:',
  love: [
    'AI tools and smart workflows',
    'IT solutions and digital transformation ideas',
    'Tech tutorials and how-to guides',
    'Software and platform reviews',
    'Online income and productivity strategies',
  ],
  loveOutro: 'Everything we share is designed to be practical, easy to understand, and ready to apply.',
  image: team,
}

export const stats = [
  { label: 'Projects', value: 27, suffix: '' },
  { label: "Users' Comments", value: 125, suffix: '+' },
  { label: 'Happy Clients', value: 89, suffix: '%' },
]

export const projectsIntro = {
  title: 'Our Recent Projects',
  text: 'Explore our latest projects, crafted with innovative design and smart technology to help businesses grow online',
}

/** Real client work from https://idcbdtech.com/projects/ */
export const projects = [
  {
    slug: 'sports',
    title: 'Custom Sports Website Solution',
    desc: 'A modern, responsive, and user-friendly cricket sports website designed to deliver a seamless experience across desktop and mobile devices.',
    tags: ['Web Development', 'Sports'],
    image: sports,
    domain: 'arenabook — sports booking',
  },
  {
    slug: 'bazarbag',
    title: 'E-commerce Website Development',
    desc: 'A modern, responsive e-commerce website designed to showcase products, attract customers, and drive online sales with a seamless shopping experience.',
    tags: ['Web Development', 'E-Commerce'],
    image: bazarTop,
    scroll: [bazarTop, bazarScroll],
    url: 'https://bazarbag-bd.com/',
    domain: 'bazarbag-bd.com',
  },
  {
    slug: 'shipping',
    title: 'Shipping & Crew Recruitment Website',
    desc: 'A professional, responsive website for a shipping and crew recruitment company, featuring maritime job listings, crew management, and an easy-to-use recruitment platform.',
    tags: ['Web Development', 'Recruitment'],
    image: shipping,
    domain: 'shipping & crew agency',
  },
  {
    slug: 'alumni',
    title: 'Alumni Network & Management Platform',
    desc: 'A centralized platform connecting alumni, ex-students, and institutions in one community. Features include paid membership registration, committee elections with secure voting, and event management.',
    tags: ['Web Development', 'Platform'],
    image: alumni,
    domain: 'alumni community platform',
  },
]

/** Earlier branding & marketing work (shown on the full projects page). */
export const archiveProjects = [
  { slug: 'complementary', title: 'Complementary Colors', tags: ['Branding', 'Marketing'], image: complementary, domain: 'branding' },
  { slug: 'couch', title: 'Modern Couch', tags: ['Marketing'], image: couch, domain: 'marketing' },
  { slug: 'balloons', title: 'Hot Air Balloons', tags: ['Branding', 'Marketing'], image: balloons, domain: 'branding' },
  { slug: 'difference', title: 'Make Difference', tags: ['Branding'], image: difference, domain: 'branding' },
]

export const allProjects = [...projects, ...archiveProjects]

/**
 * Client voices. The first is the real Bazarbag testimonial from idcbdtech.com.
 * The other two are SAMPLE copy written for the redesign — replace them with real client quotes before publishing.
 */
export const testimonials = [
  {
    quote:
      'IDC Team was impressive, within short time they provide me whole E-commerce site. Specially their technical support of Designing and Development was satisfying. Bazarbag family thanks to them and wish them best of luck.',
    name: 'Bazarbag Online Shop',
    role: 'CEO & Co-Founder',
    project: 'E-commerce Website Development',
    initial: 'B',
  },
  {
    quote:
      'IDC understood how our recruitment works from the very first meeting. Seafarers can now find vacancies and apply in minutes, and whenever we needed a change the team responded quickly.',
    name: 'Shipping & Crew Recruitment Agency',
    role: 'Website client',
    project: 'Shipping & Crew Recruitment Website',
    initial: 'S',
    sample: true,
  },
  {
    quote:
      'Membership registration, committee elections and events now run from one secure platform. IDC kept everything simple for our members and guided us patiently through every step.',
    name: 'Alumni Association',
    role: 'Platform client',
    project: 'Alumni Network & Management Platform',
    initial: 'A',
    sample: true,
  },
]

export const cta = {
  ask: 'Are You Ready?',
  title: ['Start a New', 'Project'],
  sub: ['What Are You Waiting for?', "Let's Talk About Work"],
  button: 'Start Now',
}

export const contact = {
  address: ['Holding No-2789/3463, Lane-2, Block-I', 'Halishahar Housing Estate,', 'Chattogram, Bangladesh.'],
  email: 'sales@idcbdtech.com',
  phones: ['+8801683682400', '+8801717868613'],
  map: 'https://www.google.com/maps/search/?api=1&query=Halishahar+Housing+Estate+Chattogram+Bangladesh',
  support: ['24/7 Support', 'Complete IT & Digital Solution Provider'],
  links: ['Careers', 'News', 'Terms of use', 'Privacy', 'Projects', 'About', 'Contact'],
  social: ['Facebook', 'Twitter', 'Instagram', 'YouTube'],
  copyright: '© 2026 IMPRESSIVE DIGITAL COMMUNICATION.',
}

export const sections = [
  { id: 'hero', label: 'Intro' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Projects' },
  { id: 'voice', label: 'Voice' },
  { id: 'start', label: 'Start' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Techno-Guard Engineering — IDC's offline engineering service.
 * Content from https://idcbdtech.com/techno-guard-engineering/ and the Techno-Guard / Fire & Safety blocks on idcbdtech.com.
 * The source page repeats the fire-safety bullet points under every machinery item, so the machinery
 * bullets below were rewritten to describe each item.
 */
export const technoGuard = {
  name: 'Techno-Guard Engineering',
  tagline: 'Design | Erection | Supply',
  intro:
    'Techno-Guard Engineering Services provides international-standard engineering and consultancy solutions in Bangladesh. Our experienced engineers deliver reliable equipment supply, estimation, erection, and consultancy services for industrial and commercial projects, ensuring quality, safety, and efficiency.',
  vision:
    'To become a leading position as engineering services company in Bangladesh. Providing outstanding performance in quality, safety and delivering “on time” projects, to satisfy the most stringent client schedules & specification.',
  commitmentTitle: 'Our Commitment, Your Satisfaction',
  commitment: [
    'Techno-Guard Engineering Services is committed to do better service with follow up the standard procedure to satisfy our customer. Maintain best quality & due time project handover.',
    'We offer the highest degree of co-ordination & communication. We know that attention to details into successful projects & satisfied customer. So, we hope will get reply from you & meet as soon to discuss details about your projects.',
  ],
  groups: [
    {
      id: 'fire',
      title: 'Fire Fighting System',
      items: [
        { title: 'Fire Safety Assessment (FSA)', points: ['Checks fire risks', 'Reviews safety systems', 'Examines evacuation plans', 'Ensures safety rules are followed'] },
        { title: 'Addressable Fire Detection System', points: ['Shows the exact place of fire', 'Gives quick fire alerts', 'Helps people respond faster', 'Improves safety in the building'] },
        { title: 'Fire Sprinkler & Hydrant Systems', points: ['Controls and reduces fire spread', 'Supplies water for firefighting', 'Supports quick emergency response', 'Enhances overall fire safety in buildings'] },
        { title: 'Fire Extinguisher Re-filling & Supply', points: ['Refills used fire extinguishers', 'Supplies approved fire extinguishers', 'Ensures readiness during emergencies', 'Helps maintain fire safety compliance'] },
        { title: 'Fire Blanket & Safety Equipment Supply', points: ['Supplies fire blankets for small fires', 'Provides essential safety equipment', 'Helps protect people from fire hazards', 'Supports workplace fire safety preparedness'] },
        { title: 'Emergency Lighting & Alarming Systems', points: ['Provides lighting during power failure', 'Alerts occupants in emergencies', 'Guides safe evacuation routes', 'Improves overall emergency safety'] },
      ],
      gallery: [tgHydrant, tgInspection, tgSprinkler, tgExtinguishers, tgBlanket, tgSafety],
    },
    {
      id: 'machinery',
      title: 'Machinery & Spare Parts Supply',
      items: [
        { title: 'Supply & Installation of Generator', points: ['Load assessment & generator sizing', 'Supply & on-site installation', 'Testing & commissioning', 'Maintenance & servicing support'] },
        { title: 'Supply & Installation of Compressor', points: ['Compressor selection for your needs', 'Supply & professional installation', 'Air piping & system integration', 'Servicing & spare parts'] },
        { title: 'Supply Pneumatic items of Pipes & Fittings', points: ['Pneumatic pipes & tubes', 'Push-in & threaded fittings', 'Wide range of sizes & types', 'Reliable, leak-free connections'] },
        { title: 'Supply & Installation of Valves & Accessories', points: ['Ball, butterfly & check valves', 'Flanged & threaded options', 'Installation & replacement', 'Valve accessories & spares'] },
        { title: 'Machinery, Equipment & Spare Parts supply', points: ['Industrial machinery & equipment', 'Spare parts sourcing', 'Supply for industrial & commercial projects', 'Fast response for urgent needs'] },
        { title: 'After Sales & Service Facilities for Every Clients', points: ['Regular maintenance visits', 'Quick troubleshooting & repair', 'Testing, maintenance & AMC support', 'Dedicated after-sales support'] },
      ],
      gallery: [tgGenerator, tgBallValve, tgPneumatic, tgButterfly, tgSwingValve, tgFittingsCatalog],
    },
  ],
  package: {
    label: 'Fire & Safety | Supply',
    title: 'Complete Fire Protection & Engineering Solutions',
    note: 'Based on Workload',
    points: [
      'Fire detection & alarm systems',
      'Fire hydrant & sprinkler solutions',
      'Fire extinguisher supply & installation',
      'Safety compliance & consultancy',
      'Testing, maintenance & AMC support',
    ],
  },
}
