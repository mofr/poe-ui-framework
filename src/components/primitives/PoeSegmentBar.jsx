import React from 'react';

export function PoeSegmentBar({ count = 36, blue = false }) {
  return (
    <div className="poe-segment-bar">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className={`poe-segment ${blue ? 'blue' : ''}`} />
      ))}
    </div>
  );
}
