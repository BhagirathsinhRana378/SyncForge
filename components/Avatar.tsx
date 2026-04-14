import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

// Avatar Component
// Redesigned: Removed the isActive green dot. 
// Uses a very minimal gray border and drops all box-shadows.
export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5', // Made smaller for SaaS sidebars
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border border-gray-200 bg-gray-50`}
      />
    </div>
  );
};
