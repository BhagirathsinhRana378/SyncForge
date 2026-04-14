import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
}

// Avatar Component
// Displays a circular image representing a user.
// Includes sizes for flexibility and an optional green dot for 'active' status.
export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', isActive = false }) => {
  // Map our size prop to literal Tailwind class values
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="relative inline-block">
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border border-gray-200 shadow-sm`}
      />
      {/* If the user is active, we render a small green indicator dot */}
      {isActive && (
        <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-green-500 ring-2 ring-white" />
      )}
    </div>
  );
};
