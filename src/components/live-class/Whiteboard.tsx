// src/components/live-class/Whiteboard.tsx
"use client";

import React, { useRef, useEffect, useImperativeHandle } from 'react';

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

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Set canvas size to match display size
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');
      if (!context) return;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      contextRef.current = context;
    }, []);

    useEffect(() => {
        if(contextRef.current) {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = lineWidth;
            contextRef.current.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
        }
    }, [color, lineWidth, tool]);

    const startDrawing = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
      const { offsetX, offsetY } = getCoords(nativeEvent);
      if(!contextRef.current || offsetX === undefined || offsetY === undefined) return;
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      isDrawing.current = true;
    };

    const finishDrawing = () => {
      if(!contextRef.current) return;
      contextRef.current.closePath();
      isDrawing.current = false;
    };

    const draw = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing.current) return;
      const { offsetX, offsetY } = getCoords(nativeEvent);
       if(!contextRef.current || offsetX === undefined || offsetY === undefined) return;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    };

    const getCoords = (event: MouseEvent | TouchEvent) => {
      if(event instanceof MouseEvent) {
        return { offsetX: event.offsetX, offsetY: event.offsetY };
      }
      if(event.touches && event.touches.length > 0) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        return { offsetX: event.touches[0].clientX - rect.left, offsetY: event.touches[0].clientY - rect.top };
      }
      return {offsetX: undefined, offsetY: undefined};
    }

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
