
'use client';

import Link from 'next/link';
import React from 'react';

// A simple placeholder for the Logo component
export const Logo = ({ size = "large", withText = false, className = "" }: { size?: "large" | "small", withText?: boolean, className?: string }) => (
  <div className={`flex items-center ${className}`}>
    <div className="w-10 h-10 bg-primary rounded-md mr-4"></div>
    {withText && <span className="text-2xl font-bold">Qonnectme</span>}
  </div>
);

interface CustomButtonProps {
    children: React.ReactNode;
    className?: string;
    variant?: string;
    href?: string;
    [key: string]: any;
}

// A simple placeholder for the Button component
export const CustomButton = ({ children, className, variant, href, ...props }: CustomButtonProps) => {
  const baseClasses = "font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 text-lg";
  const variantClasses = variant === 'outline'
    ? "border border-primary text-primary hover:bg-primary/10 neon-text-purple"
    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white neon-border";
  
  const content = (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );

  return href ? <Link href={href}>{content}</Link> : content;
};
