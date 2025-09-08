import React from 'react';

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9.5 2.5a4.5 4.5 0 0 1 5 0" />
    <path d="M12 15a4.5 4.5 0 0 0 4.5-4.5" />
    <path d="M12 15a4.5 4.5 0 0 1-4.5-4.5" />
    <path d="M12 2v2.5" />
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <path d="m15.5 8.5-3.5 3.5-3.5-3.5" />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-secondary/30 backdrop-blur-lg sticky top-0 z-20 border-b border-brand-accent/20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 text-brand-cyan">
            <BrainIcon />
            <h1 className="text-2xl font-bold tracking-wider text-brand-text/90">DeepSeek Insights</h1>
          </div>
        </div>
      </div>
    </header>
  );
};