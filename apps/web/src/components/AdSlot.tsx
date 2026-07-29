'use client';
import { useEffect, useRef } from 'react';

export default function AdSlot({ html }: { html?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!html || !containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    // Create a temporary div to parse the HTML string
    const range = document.createRange();
    const documentFragment = range.createContextualFragment(html);

    // Contextual fragment correctly handles and runs scripts inside the fragment when appended
    containerRef.current.appendChild(documentFragment);
  }, [html]);

  if (!html) return null;

  return (
    <div className="w-full overflow-hidden flex justify-center my-6">
      <div ref={containerRef} className="w-full flex justify-center" />
    </div>
  );
}
