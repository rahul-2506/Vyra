import React from 'react';
import { motion } from 'framer-motion';

export default function SkyLayer() {
  const skyStyle = {
    background: 'linear-gradient(180deg, #87CEFA 0%, #FFE5B4 30%, transparent 100%)',
  };

  return (
    <div className="absolute inset-0 z-0 pointer-events-none" style={skyStyle}>
      {/* Volumetric clouds */}
      <motion.div
        className="absolute top-10 left-[-20%] w-64 h-24 bg-white rounded-full blur-md opacity-30"
        animate={{ x: ['0%', '120%'] }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-24 left-[-30%] w-80 h-32 bg-white rounded-full blur-lg opacity-25"
        animate={{ x: ['0%', '130%'] }}
        transition={{ duration: 110, repeat: Infinity, ease: 'linear', delay: 20 }}
      />
      <motion.div
        className="absolute top-5 left-[-10%] w-48 h-20 bg-white rounded-full blur-md opacity-20"
        animate={{ x: ['0%', '140%'] }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear', delay: 10 }}
      />
      {/* Sunlight bloom */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-yellow-300 rounded-full opacity-10 blur-3xl" />
    </div>
  );
}
