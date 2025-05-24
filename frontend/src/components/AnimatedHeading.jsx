'use client';
import { useEffect, useState } from 'react';

const lines = [
  'Prove Your Brain',
  'Fight among the',
  'bests'
];

export default function AnimatedHeading() {
  const [currentLine, setCurrentLine] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) return;

    if (charIndex < lines[currentLine].length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + lines[currentLine][charIndex]);
        setCharIndex(prev => prev + 1);
      }, 70); // typing speed
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
        setTypedText('');
        setCharIndex(0);
      }, 700); // pause before next line
      return () => clearTimeout(timeout);
    }
  }, [charIndex, currentLine]);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white text-center">
      {lines.slice(0, currentLine).map((line, idx) => (
        <h1 key={idx} className="text-5xl font-bold mb-2">{line}</h1>
      ))}
      {currentLine < lines.length && (
        <h1 className="text-5xl font-bold mb-2 typewriter">
          {typedText}
          <span className="blinking-cursor">|</span>
        </h1>
      )}
    </div>
  );
}
