import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, User, Code2, Briefcase, Mail, Menu } from 'lucide-react';
import { cn } from '../utils/cn';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'contact', label: 'Contact', icon: Mail },
];

interface NavbarProps {
  activeSection: string;
  onOpenDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onOpenDrawer }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Right Menu Trigger for Drawer */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onOpenDrawer}
        className="fixed top-6 right-6 z-50 p-3 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-full text-zinc-400 hover:text-emerald-400 transition-colors shadow-lg"
      >
        <Menu size={20} />
      </motion.button>

      {/* Bottom Navigation Bar */}
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 md:hidden"
          >
            <div className="max-w-md mx-auto bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex items-center justify-around h-[70px] relative overflow-hidden">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex flex-col items-center justify-center flex-1 min-h-[44px] relative z-10 group outline-none"
                  >
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        color: isActive ? '#10b981' : '#71717a', // emerald-500 : zinc-500
                      }}
                      whileTap={{ scale: 0.9 }}
                      className="mb-1"
                    >
                      <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    </motion.div>
                    <span
                      className={cn(
                        "text-[10px] font-medium transition-colors duration-300",
                        isActive ? "text-emerald-400" : "text-zinc-500"
                      )}
                    >
                      {item.label}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-1 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Desktop Navigation (Optional but good for completeness) */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "text-sm font-medium transition-all hover:text-emerald-400",
                activeSection === item.id ? "text-emerald-400" : "text-zinc-400"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};
