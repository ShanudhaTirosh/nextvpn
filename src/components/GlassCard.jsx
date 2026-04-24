import React from 'react';

const GlassCard = ({ children, className = '', noHover = false, glowVariant = '' }) => {
  let classes = `glass-card ${className}`;
  if (noHover) classes += ' no-hover';
  if (glowVariant) {
    // If glowVariant is 'cyan', we could dynamically change the inline style or add a utility class
    // but the CSS handles most hover glows. We'll just append the class if passed.
    classes += ` glow-${glowVariant}`;
  }

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default GlassCard;
