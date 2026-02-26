import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Github, Linkedin, FileText, ExternalLink } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const extraLinks = [
  { label: 'Resume', icon: FileText, href: '#' },
  { label: 'GitHub', icon: Github, href: 'https://github.' },
  { label: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
];

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[280px] bg-zinc-950 border-l border-white/10 z-[70] p-8 flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-xl font-display font-semibold text-white">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {extraLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="flex items-center justify-between group p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-emerald-400 transition-colors">
                      <link.icon size={20} />
                    </div>
                    <span className="font-medium text-zinc-300 group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                  </div>
                  <ExternalLink size={16} className="text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                </motion.a>
              ))}
            </div>

            <div className="mt-auto">
              <p className="text-xs text-zinc-600 font-mono text-center">
                &copy; {new Date().getFullYear()} DevPort
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
