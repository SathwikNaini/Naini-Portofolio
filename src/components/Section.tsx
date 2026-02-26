import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface SectionProps {
  id: string;
  children: React.ReactNode;
  onVisible: (id: string) => void;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ id, children, onVisible, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount: 0.5, // Trigger when 50% of the section is in view
    margin: "-10% 0px -10% 0px" // Add some margin to the trigger
  });

  useEffect(() => {
    if (isInView) {
      onVisible(id);
    }
  }, [isInView, id, onVisible]);

  return (
    <section id={id} ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
};
