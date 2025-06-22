'use client';

import { motion } from 'framer-motion';
import { ReaderIcon, PersonIcon, BarChartIcon, StarIcon } from '@radix-ui/react-icons';

export default function ModernHero() {
  console.log('ModernHero component rendered');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const features = [
    {
      icon: ReaderIcon,
      title: "Smart Exam Creation",
      description: "AI-powered question generation and automatic grading"
    },
    {
      icon: PersonIcon,
      title: "Student Analytics",
      description: "Deep insights into learning patterns and performance"
    },
    {
      icon: BarChartIcon,
      title: "Real-time Results",
      description: "Instant feedback and comprehensive progress tracking"
    },
    {
      icon: StarIcon,
      title: "Modern Interface",
      description: "Beautiful, intuitive design that students and teachers love"
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb w-96 h-96 -top-48 -left-48 opacity-30" />
      <div className="floating-orb w-64 h-64 top-20 right-10 opacity-20 animation-delay-2000" />
      <div className="floating-orb w-80 h-80 bottom-10 left-20 opacity-25 animation-delay-4000" />
      
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Hero Content */}
        <motion.div variants={itemVariants} className="mb-16">
          <motion.div 
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <StarIcon className="w-4 h-4 text-modern-accent" />
            <span className="text-modern-text/80 text-sm font-medium">
              Next-Generation Exam Platform
            </span>
          </motion.div>
          
          <h1 className="text-6xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="gradient-text">GradeMe</span>
            <br />
            <span className="text-modern-text font-light">Reimagined</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-modern-text/70 font-light mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform education with our revolutionary exam management system. 
            Built for the modern classroom.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="glass glass-hover p-6 rounded-2xl group cursor-pointer"
            >
              <div className="mb-4">
                <feature.icon className="w-8 h-8 text-modern-primary group-hover:text-modern-accent transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-modern-text mb-2">
                {feature.title}
              </h3>
              <p className="text-modern-text/60 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center items-center gap-12 text-center"
        >
          {[
            { number: "10K+", label: "Students" },
            { number: "500+", label: "Institutions" },
            { number: "99.9%", label: "Uptime" }
          ].map((stat, index) => (
            <div key={index} className="glass px-6 py-4 rounded-xl">
              <div className="text-2xl font-bold gradient-text">
                {stat.number}
              </div>
              <div className="text-modern-text/60 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}