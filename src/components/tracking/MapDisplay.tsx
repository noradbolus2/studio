
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

interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  label?: string; 
  iconUrl?: string; 
  iconSize?: { width: number; height: number }; 
}

interface MapDisplayProps {
  mapCenter?: { lat: number; lng: number };
  markers?: MapMarker[];
  zoom?: number;
}

const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 }; // Delhi
const DEFAULT_ZOOM = 10;

export function MapDisplay({ mapCenter, markers, zoom }: MapDisplayProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const center = useMemo(() => mapCenter || DEFAULT_CENTER, [mapCenter]);
  const currentZoom = useMemo(() => zoom || DEFAULT_ZOOM, [zoom]);
  const displayMarkers = useMemo(() => markers || [], [markers]);

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
        {displayMarkers.map((marker) => {
          let markerIcon: google.maps.Icon | string | undefined = undefined;
          if (marker.iconUrl && typeof window !== 'undefined' && window.google && window.google.maps) {
            markerIcon = {
              url: marker.iconUrl,
              scaledSize: marker.iconSize 
                ? new window.google.maps.Size(marker.iconSize.width, marker.iconSize.height) 
                : new window.google.maps.Size(30, 30), // Default size if not provided
            };
          }

          return (
            <MarkerF 
              key={marker.id} 
              position={marker.position} 
              label={marker.label}
              icon={markerIcon}
            />
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
}
