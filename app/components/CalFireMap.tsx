'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

interface CalFireMapProps {
  onFireSelect?: (fireData: any) => void;
}

const DynamicMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <div className="text-gray-600">Loading interactive map...</div>
      </div>
    </div>
  )
});

export default function CalFireMap({ onFireSelect }: CalFireMapProps) {
  return (
    <div className="relative w-full h-full">
      <DynamicMap onFireSelect={onFireSelect} />
    </div>
  );
}