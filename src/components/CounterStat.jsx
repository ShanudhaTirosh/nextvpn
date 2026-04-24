import React, { useState, useEffect, useRef } from 'react';

const CounterStat = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const startAnim = () => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        let val = ease * end;
        if (Number.isInteger(end)) {
          setCount(Math.floor(val));
        } else {
          setCount(parseFloat(val.toFixed(1)));
        }

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          startAnim();
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = countRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasAnimated, duration, end]);

  return (
    <span ref={countRef}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default CounterStat;
