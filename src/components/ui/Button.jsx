import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200",
    outline: "border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white",
    ghost: "text-slate-400 hover:text-white hover:bg-slate-800/50",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
    accent: "bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
