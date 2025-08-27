'use client';

import { useEffect, useRef } from 'react';

interface FireMapProps {
  incidents: any[];
}

export default function FireMap({ incidents }: FireMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw California outline (simplified)
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(100, 50);
    ctx.lineTo(200, 50);
    ctx.lineTo(250, 100);
    ctx.lineTo(250, 300);
    ctx.lineTo(200, 350);
    ctx.lineTo(150, 350);
    ctx.lineTo(50, 250);
    ctx.closePath();
    ctx.stroke();

    // Draw fire incidents
    incidents.forEach(incident => {
      const x = ((incident.longitude + 124) / 10) * canvas.width;
      const y = ((42 - incident.latitude) / 10) * canvas.height;
      const radius = Math.sqrt(incident.acresBurned) / 50;

      // Draw fire circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      
      if (incident.isActive) {
        // Active fire - red with pulse effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 100, 0, 0.2)');
        ctx.fillStyle = gradient;
      } else {
        // Contained fire - gray
        ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
      }
      
      ctx.fill();
      
      // Draw fire name
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.fillText(incident.incidentName, x - 20, y - radius - 5);
    });

    // Draw legend
    ctx.fillStyle = '#fff';
    ctx.font = '12px sans-serif';
    ctx.fillText('🔴 Active Fire', 10, canvas.height - 30);
    ctx.fillText('⚫ Contained', 10, canvas.height - 10);
  }, [incidents]);

  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-orange-400">Fire Activity Map</h2>
      <div className="relative">
        <canvas 
          ref={canvasRef}
          className="w-full h-[400px] bg-gray-900 rounded"
          style={{ imageRendering: 'crisp-edges' }}
        />
        <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs">
          California
        </div>
      </div>
    </div>
  );
}