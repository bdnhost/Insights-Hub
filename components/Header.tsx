
import React from 'react';

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.25.5 2.4 1.3 3.25" />
    <path d="M12 2a4.5 4.5 0 0 1 4.5 4.5c0 1.25-.5 2.4-1.3 3.25" />
    <path d="M12 15a4.5 4.5 0 0 0 4.5-4.5" />
    <path d="M12 15a4.5 4.5 0 0 1-4.5-4.5" />
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <path d="M12 15v1" />
    <path d="M12 19v2" />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-secondary/50 backdrop-blur-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center space-x-3 text-brand-cyan">
            <BrainIcon />
            <h1 className="text-2xl font-bold tracking-wider">DeepSeek Insights</h1>
        </div>
      </div>
    </header>
  );
};
