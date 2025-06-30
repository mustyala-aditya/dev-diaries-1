import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Code } from 'lucide-react';

interface WelcomeSectionProps {
  onCreateCard: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onCreateCard }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-3xl"></div>
      <div className="relative text-center py-24 px-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto h-24 w-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl"
        >
          <Code className="h-12 w-12 text-white" />
        </motion.div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6">
          Welcome to Dev Diaries
        </h1>
        <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Your personal knowledge management system. Capture ideas, code snippets, and insights with our powerful rich-text editor.
        </p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateCard}
          className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/25 transition-all duration-300"
        >
          <Plus className="h-6 w-6 mr-3" />
          Create Your First Card
        </motion.button>
      </div>
    </motion.div>
  );
};