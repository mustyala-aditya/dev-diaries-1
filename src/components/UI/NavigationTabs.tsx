import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  key: string;
  label: string;
}

interface NavigationTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl p-1.5 border border-white/20">
      {tabs.map((tab) => (
        <motion.button
          key={tab.key}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTabChange(tab.key)}
          className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
            activeTab === tab.key
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
};