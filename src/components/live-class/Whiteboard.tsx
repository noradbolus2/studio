// src/components/live-class/Whiteboard.tsx
"use client";

import React, { useRef, useEffect, useImperativeHandle, useCallback } from 'react';

interface WhiteboardProps {
  tool: 'pen' | 'eraser';
  color: string;
  lineWidth: number;
}

export interface WhiteboardHandle {
  clearCanvas: () => void;
}

const Whiteboard = React.forwardRef<WhiteboardHandle, WhiteboardProps>(
  ({ tool, color, lineWidth }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const isDrawing = useRef(false);

    const getCoords = (event: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { offsetX: 0, offsetY: 0 };
      
      const rect = canvas.getBoundingClientRect();
      
      if ('touches' in event.nativeEvent && event.nativeEvent.touches.length > 0) {
        return { 
          offsetX: event.nativeEvent.touches[0].clientX - rect.left, 
          offsetY: event.nativeEvent.touches[0].clientY - rect.top 
        };
      } else if ('offsetX' in event.nativeEvent) {
          return { offsetX: event.nativeEvent.offsetX, offsetY: event.nativeEvent.offsetY };
      }
      return { offsetX: 0, offsetY: 0 };
    }

    // Effect for setting up canvas and handling resizes
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;
      contextRef.current = context;

      // This function sets the canvas buffer size to match its display size.
      const handleResize = () => {
        const { width, height } = canvas.getBoundingClientRect();
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          // Note: This will clear the canvas on resize. A more advanced
          // implementation would store and redraw drawing history.
        }
      };

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(canvas);
      handleResize(); // Initial size set

      return () => resizeObserver.disconnect();
    }, []);

    // Effect for updating drawing properties
    useEffect(() => {
        if(contextRef.current) {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = lineWidth;
            contextRef.current.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
        }
    }, [color, lineWidth, tool]);

    const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
      const context = contextRef.current;
      if (!context) return;
      const { offsetX, offsetY } = getCoords(event);
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      isDrawing.current = true;
    };

    const finishDrawing = () => {
      const context = contextRef.current;
      if (!context) return;
      context.closePath();
      isDrawing.current = false;
    };

    const draw = (event: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing.current) return;
      const context = contextRef.current;
      if (!context) return;
      const { offsetX, offsetY } = getCoords(event);
      context.lineTo(offsetX, offsetY);
      context.stroke();
    };

    useImperativeHandle(ref, () => ({
      clearCanvas() {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (canvas && context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing} // Added to stop drawing if mouse leaves canvas
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={finishDrawing}
        onTouchMove={draw}
        className="w-full h-full bg-white rounded-lg shadow-inner border border-border"
      />
    );
  }
);

Whiteboard.displayName = 'Whiteboard';
export default Whiteboard;
