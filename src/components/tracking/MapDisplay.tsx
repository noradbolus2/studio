
"use client";
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { useState, useMemo } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { AlertCircle } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '300px', 
  borderRadius: '0.5rem', 
};

interface MapDisplayProps {
  mapCenter?: { lat: number; lng: number };
  markerPosition?: { lat: number; lng: number };
  zoom?: number;
}

// Using a default center in Delhi, India for example
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 };
const DEFAULT_ZOOM = 12;

export function MapDisplay({ mapCenter, markerPosition, zoom }: MapDisplayProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const center = useMemo(() => mapCenter || DEFAULT_CENTER, [mapCenter]);
  const currentMarkerPosition = useMemo(() => markerPosition || center, [markerPosition, center]);
  const currentZoom = useMemo(() => zoom || DEFAULT_ZOOM, [zoom]);

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] bg-muted rounded-lg p-4 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-2" />
        <p className="font-semibold text-destructive">Google Maps API Key Missing</p>
        <p className="text-sm text-muted-foreground">
          Please add <code className="text-xs bg-destructive/20 p-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your .env file.
        </p>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      loadingElement={<div className="flex items-center justify-center h-[300px]"><LoadingSpinner size={32}/> <span className="ml-2">Loading Map...</span></div>}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={currentZoom}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControlOptions: { position: 9 /* google.maps.ControlPosition.RIGHT_BOTTOM */ },
        }}
      >
        {currentMarkerPosition && <MarkerF position={currentMarkerPosition} />}
      </GoogleMap>
    </LoadScript>
  );
}
