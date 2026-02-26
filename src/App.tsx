import React, { useState, useEffect, useRef } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronRight,
  Download,
  Send,
  FileText,
  Menu,
  X,
  Code2,
  Database,
  Layout,
  Terminal,
  Cpu,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform, useReducedMotion } from 'motion/react';

import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  image: string;
}

// --- Data ---
const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Smart ATS",
    description: "An AI-powered resume screening platform that performs contextual job description matching, skill-gap detection, and generates explainable hiring recommendations through an intelligent, recruiter-focused dashboard.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Gemini API", "Recharts"],
    github: "https://github.com/SathwikNaini/ai-resume-screening-system",
    demo: "https://ai-resume-screening-system-tau.vercel.app/",
    image: "https://picsum.photos/seed/ats/1200/800"
  },
  {
    id: 2,
    title: "Expense Tracker",
    description: "Engineered a responsive multi-user finance tracking system featuring smart settlement algorithms, income-expense cash-flow analysis, and exportable financial reports.",
    tech: ["Next.js", "TypeScript", "React", "Python", "Tailwind CSS"],
    github: "https://github.com/SathwikNaini/Expense-Tracker",
    demo: "https://expense-tracker-xi-weld.vercel.app/",
    image: "https://picsum.photos/seed/nova/1200/800"
  },
  {
    id: 3,
    title: "Aura Social",
    description: "A privacy-focused social platform with end-to-end encrypted messaging, decentralized storage, and a clean, minimalist user interface.",
    tech: ["React", "Node.js", "Socket.io", "WebRTC", "MongoDB"],
    github: "https://github.com",
    demo: "https://example.com",
    image: "https://picsum.photos/seed/aura/1200/800"
  },
  {
    id: 4,
    title: "Zenith Analytics",
    description: "Enterprise-grade data visualization dashboard that processes real-time telemetry data from IoT devices with sub-second latency.",
    tech: ["React", "D3.js", "Go", "Redis", "PostgreSQL"],
    github: "https://github.com",
    demo: "https://example.com",
    image: "https://picsum.photos/seed/zenith/1200/800"
  },
  // {
  //   id: 5,
  //   title: "Lumina Studio",
  //   description: "A collaborative design tool for creative teams, featuring real-time canvas synchronization, version control, and asset management.",
  //   tech: ["React", "Konva", "Firebase", "Framer Motion"],
  //   github: "https://github.com",
  //   demo: "https://example.com",
  //   image: "https://picsum.photos/seed/lumina/1200/800"
  // }
];

const SKILLS = {
  frontend: ["HTML5", "CSS3", "React.js", "Tailwind CSS", "Bootstrap", "Responsive Design", "Component-Based UI"],
  backend: ["Node.js", "Express.js", "REST API Development", "Basic Distributed Systems Concepts"],
  database: ["MongoDB", "SQL", "SQL Queries", "Data Modeling (Basics)"],
  tools: ["Git", "GitHub", "Docker", "Jenkins", "Postman", "Netlify", "VS Code"]
};

// --- Components ---

// --- Section Wrapper ---
const Section = ({ id, children, className = "" }: { id: string, children: React.ReactNode, className?: string }) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`relative py-24 md:py-32 overflow-hidden ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        {children}
      </div>
    </motion.section>
  );
};

const TypingAnimation = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      // Loop or just stay? Let's loop after a delay
      const timeout = setTimeout(() => {
        setDisplayedText('');
        setIndex(0);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <span className="text-primary">
      {displayedText}
      <span className="typing-cursor" />
    </span>
  );
};

const ThemeContext = React.createContext<{ theme: 'light' | 'dark', toggleTheme: () => void } | null>(null);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3 glass-premium shadow-lg' : 'py-6 bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <a href="#home" className="text-2xl font-display font-bold tracking-tighter text-[var(--heading)] group">
          SATHWIK<span className="text-primary group-hover:animate-pulse">.</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[var(--foreground)] hover:text-primary transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 text-[var(--heading)]"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-[var(--border)] text-[var(--heading)]"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[var(--heading)]"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-premium border-b border-[var(--border)]"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-bold text-[var(--heading)] hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <Section id="home" className="min-h-screen flex items-center justify-center pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* LEFT side: text content area */}
        <div className="flex flex-col gap-6 text-center lg:text-left order-2 lg:order-1">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-[var(--heading)] tracking-tighter leading-[0.9]"
          >
            Naini Sathwik
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="text-2xl md:text-4xl font-display font-medium text-primary h-12"
          >
            <TypingAnimation text="Full Stack Developer" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="text-lg md:text-xl text-[var(--foreground)] max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            I build responsive, high-performance web applications using modern technologies, focusing on intuitive interfaces and seamless user experiences with clean, maintainable code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
            className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4"
          >
            <a
              href={`${import.meta.env.BASE_URL}resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn group"
              aria-label="View Resume"
            >
              <FileText size={20} />
              <span className="tooltip">Resume</span>
            </a>
            <a href="https://github.com/SathwikNaini" className="icon-btn group" aria-label="GitHub Profile">
              <Github size={20} />
              <span className="tooltip">GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/sathwik-naini-4853902a1/" className="icon-btn group" aria-label="LinkedIn Profile">
              <Linkedin size={20} />
              <span className="tooltip">LinkedIn</span>
            </a>
            <a href="mailto:nainisathwik@gmail.com" className="icon-btn group" aria-label="Send Email">
              <Mail size={20} />
              <span className="tooltip">Email</span>
            </a>
          </motion.div>
        </div>

        {/* RIGHT side: profile image container */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
          className="flex justify-center lg:justify-end order-1 lg:order-2"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-[450px] lg:h-[450px] rounded-full bg-primary/5 p-3 shadow-2xl flex items-center justify-center border border-[var(--border)] relative overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-[var(--background)] shadow-inner">
                <img
                  src="/profile.png"
                  alt="Naini Sathwik"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
};

const About = () => {
  const infoItems = [
    { label: 'College', value: 'Institute of Aeronautical Engineering', icon: <Code2 size={18} /> },
    { label: 'Course', value: 'B.Tech in Artificial Intelligence & Machine Learning', icon: <Cpu size={18} /> },
    { label: 'Location', value: 'Hyderabad', icon: <Layout size={18} /> },
    { label: 'Domain Interests', value: 'Full Stack Web Development, Artificial Intelligence', icon: <Terminal size={18} /> },
  ];

  const education = [
    {
      year: '2023 — 2027',
      title: 'B.Tech in Artificial Intelligence & Machine Learning',
      institution: 'Institute of Aeronautical Engineering, Hyderabad',
    },
    {
      year: '2021 — 2023',
      title: 'Intermediate Education',
      institution: 'Focus on Mathematics, Physics, Computer Science',
    },
    {
      year: '2020 — 2021',
      title: 'Secondary School Education',
      institution: 'Strong foundation in logic and academics',
    },
  ];

  const experience = [
    {
      year: '2024 — Present',
      title: 'Student Developer',
      description: 'Working on academic and personal projects involving frontend development and backend basics',
    },
    {
      year: '2024 — Present',
      title: 'AI & ML Project Experience',
      description: 'Mini-projects related to machine learning and data analysis',
    },
    {
      year: 'Self Learning',
      title: 'Web Development Practice',
      description: 'Building responsive websites using HTML, CSS, JavaScript, and modern frameworks',
    },
  ];

  return (
    <Section id="about">
      {/* Main About Section */}
      <div className="text-center mb-20">
        <h2 className="text-4xl font-bold mb-8 text-[var(--heading)]">About Me</h2>
        <p className="text-lg text-[var(--foreground)] max-w-3xl mx-auto leading-relaxed mb-12">
          Currently pursuing B.Tech in Artificial Intelligence & Machine Learning (AIML) at the Institute of Aeronautical Engineering, Hyderabad (Expected 2027). Passionate about building modern web applications and learning emerging technologies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {infoItems.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 text-left hover:border-primary/30 transition-colors"
            >
              <div className="text-primary mb-3">{item.icon}</div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">{item.label}</h4>
              <p className="text-sm font-medium text-[var(--heading)]">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Education & Experience Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Education Timeline */}
        <div className="space-y-12">
          <h3 className="text-2xl font-bold mb-10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Code2 size={20} />
            </div>
            Education
          </h3>
          <div className="space-y-12 border-l-2 border-[var(--border)] ml-4 pl-8 relative">
            {education.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative group/item"
              >
                <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-[var(--background)] shadow-[0_0_0_4px_rgba(59,130,246,0.1)] group-hover/item:scale-125 transition-transform" />
                <div className="glass-card p-6 hover:-translate-y-1 transition-all duration-300">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">{item.year}</span>
                  <h4 className="text-lg font-bold text-[var(--heading)] mb-1">{item.title}</h4>
                  <p className="text-[var(--muted)] text-sm">{item.institution}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="space-y-12">
          <h3 className="text-2xl font-bold mb-10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Terminal size={20} />
            </div>
            Experience
          </h3>
          <div className="space-y-12 border-l-2 border-[var(--border)] ml-4 pl-8 relative">
            {experience.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative group/item"
              >
                <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-[var(--background)] shadow-[0_0_0_4px_rgba(59,130,246,0.1)] group-hover/item:scale-125 transition-transform" />
                <div className="glass-card p-6 hover:-translate-y-1 transition-all duration-300">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">{item.year}</span>
                  <h4 className="text-lg font-bold text-[var(--heading)] mb-1">{item.title}</h4>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

const MagneticBadge = ({ children }: { children: React.ReactNode }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Magnetic pull: move 30% of the distance towards cursor
    x.set(distanceX * 0.4);
    y.set(distanceY * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="magnetic-badge"
    >
      {children}
    </motion.span>
  );
};

const SkillCluster = ({ category, skills, icon: Icon, position }: { category: string, skills: string[], icon: any, position: { x: number, y: number } }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        rotateX,
        rotateY,
        perspective: 1000,
        position: 'relative',
        zIndex: 10
      }}
      className="skill-cluster-container"
    >
      <div className="flex flex-col items-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="cluster-icon-wrapper group"
        >
          <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <Icon size={32} className="text-primary relative z-10" />
        </motion.div>

        <h3 className="text-lg font-bold mb-6 text-[var(--heading)] tracking-wider uppercase opacity-80">{category}</h3>

        <div className="flex flex-wrap gap-3 justify-center max-w-sm">
          {skills.map((skill) => (
            <MagneticBadge key={skill}>{skill}</MagneticBadge>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Skills = () => {
  return (
    <section
      id="skills"
      className="relative min-h-screen flex flex-col items-center py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10 w-full px-6 md:px-12">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-mono text-sm tracking-[0.3em] uppercase mb-4 block"
          >
            Technical Stack
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-[var(--heading)]">
            Skills<span className="text-primary">.</span>
          </h2>
        </div>

        {/* SVG Connecting Lines - Hidden on Mobile */}
        <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block">
          <svg className="w-full h-full">
            <motion.path
              d="M 300 200 Q 500 300 700 200"
              className="connecting-line"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M 700 600 Q 500 500 300 600"
              className="connecting-line"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 lg:gap-32">
          {Object.entries(SKILLS).map(([category, skills]) => (
            <SkillCluster
              key={category}
              category={category}
              skills={skills}
              position={{ x: 0, y: 0 }}
              icon={
                category === 'frontend' ? Layout :
                  category === 'backend' ? Terminal :
                    category === 'database' ? Database : Cpu
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};



const Projects = () => {
  return (
    <Section id="projects">
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Projects</h2>
      <div className="grid md:grid-cols-2 gap-12">
        {PROJECTS.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group glass-card overflow-hidden"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <a href={project.github} className="p-3 bg-white text-zinc-950 rounded-full hover:bg-primary transition-colors">
                  <Github size={20} />
                </a>
                <a href={project.demo} className="p-3 bg-white text-zinc-950 rounded-full hover:bg-primary transition-colors">
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
              <p className="text-[var(--foreground)] mb-6 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map(t => (
                  <span key={t} className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <Section id="contact">
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
          <p className="text-lg text-[var(--foreground)] mb-8 leading-relaxed">
            I'm currently looking for new opportunities and my inbox is always open.
            Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">Email</p>
                <a href="mailto:nainisathwik@gmail.com" className="text-[var(--heading)] font-medium hover:text-primary transition-colors">
                  nainisathwik@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Linkedin size={20} />
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">LinkedIn</p>
                <a href="https://www.linkedin.com/in/sathwik-naini-4853902a1/" className="text-[var(--heading)] font-medium hover:text-primary transition-colors">
                  linkedin.com/in/sathwik-naini
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                <Send size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-[var(--muted)]">Thanks for reaching out. I'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--muted)] mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  className="form-input"
                  placeholder="Your Name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--muted)] mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  className="form-input"
                  placeholder="your@email.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--muted)] mb-2">Message</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="form-input resize-none"
                  placeholder="Tell me about your project..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-[var(--border)] bg-transparent">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} Naini Sathwik. Built with React & Tailwind.
        </p>
        <div className="flex gap-6">
          <a href="https://github.com/SathwikNaini" className="text-[var(--muted)] hover:text-primary transition-colors">
            <Github size={18} />
          </a>
          <a href="https://www.linkedin.com/in/sathwik-naini-4853902a1/" className="text-[var(--muted)] hover:text-primary transition-colors">
            <Linkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

const BackgroundDecor = ({ mouseX, mouseY }: { mouseX: any, mouseY: any }) => {
  return (
    <div className="bg-decor">
      {/* Dynamic Glow - subtle spotlight */}
      <motion.div
        className="dashboard-glow w-full h-full absolute inset-0"
        style={{
          "--x": useTransform(mouseX, (x: any) => `${x}px`),
          "--y": useTransform(mouseY, (y: any) => `${y}px`)
        } as any}
      />
    </div>
  );
};

export default function App() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    // In global view, tracking relative to viewport center is often nicer
    // or relative to mouse position directly for the radial gradient.
    // For the CSS variables --x and --y in dashboard-glow:
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <ThemeProvider>
      <div
        className="relative min-h-screen bg-[var(--background)] transition-colors duration-500"
        onMouseMove={handleMouseMove}
      >
        <BackgroundDecor mouseX={mouseX} mouseY={mouseY} />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
