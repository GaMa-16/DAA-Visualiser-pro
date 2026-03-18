import React from 'react';

export const WOBBLY_RADIUS = {
  default: "255px 15px 225px 15px / 15px 225px 15px 255px",
  md: "15px 225px 15px 255px / 255px 15px 225px 15px",
  sm: "120px 10px 100px 10px / 10px 100px 10px 120px",
  oval: "50% 50% 50% 50% / 60% 60% 40% 40%",
};

interface WobblyCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'yellow' | 'muted';
  decoration?: 'tape' | 'tack' | 'none';
  rotation?: number;
}

export const WobblyCard: React.FC<WobblyCardProps> = ({ 
  children, 
  className = "", 
  variant = 'white',
  decoration = 'none',
  rotation = 0
}) => {
  const bgClass = {
    white: 'bg-white dark:bg-zinc-900',
    yellow: 'bg-postit-yellow dark:bg-yellow-900/30',
    muted: 'bg-muted-paper dark:bg-zinc-800',
  }[variant];

  return (
    <div 
      className={`relative border-[3px] border-pencil shadow-hard p-6 transition-all hover:rotate-1 ${bgClass} ${className}`}
      style={{ 
        borderRadius: WOBBLY_RADIUS.md,
        transform: `rotate(${rotation}deg)`
      }}
    >
      {decoration === 'tape' && (
        <div 
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-pencil/10 border border-pencil/20 rotate-2 z-10"
          style={{ backdropFilter: 'blur(1px)' }}
        />
      )}
      {decoration === 'tack' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-marker-red border-2 border-pencil rounded-full shadow-hard-sm z-10" />
      )}
      {children}
    </div>
  );
};

interface WobblyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

export const WobblyButton: React.FC<WobblyButtonProps> = ({ 
  children, 
  className = "", 
  variant = 'primary',
  size = 'md',
  ...props 
}) => {
  const variantClasses = {
    primary: 'bg-white dark:bg-zinc-800 hover:bg-marker-red hover:text-white',
    secondary: 'bg-muted-paper dark:bg-zinc-700 hover:bg-pen-blue hover:text-white',
    accent: 'bg-marker-red text-white hover:bg-pencil dark:hover:bg-paper dark:hover:text-pencil',
  }[variant];

  const sizeClasses = {
    sm: 'px-4 py-1 text-lg',
    md: 'px-6 py-2 text-xl',
    lg: 'px-8 py-3 text-2xl',
  }[size];

  return (
    <button
      className={`
        relative border-[3px] border-pencil font-heading font-bold
        shadow-hard hover:shadow-hard-sm active:shadow-none
        hover:translate-x-[2px] hover:translate-y-[2px]
        active:translate-x-[4px] active:translate-y-[4px]
        transition-all duration-100 cursor-pointer
        ${variantClasses} ${sizeClasses} ${className}
      `}
      style={{ borderRadius: WOBBLY_RADIUS.sm }}
      {...props}
    >
      {children}
    </button>
  );
};
