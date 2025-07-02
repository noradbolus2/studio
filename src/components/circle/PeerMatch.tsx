
"use client";

import React from 'react';
import { useState, type FormEvent } from 'react';
import { aiPeerMatch, type AiPeerMatchInput, type AiPeerMatchOutput } from '@/ai/flows/ai-peer-match';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { Users, MapPin, BookOpen, Phone, LocateFixed } from 'lucide-react';
import { BilingualText } from '@/components/shared/BilingualText';
import { useToast } from '@/hooks/use-toast';

export function PeerMatch() {
  const [formData, setFormData] = useState<AiPeerMatchInput>({
    location: '',
    subject: '',
    numberOfMatches: 3,
  });
  const [results, setResults] = useState<AiPeerMatchOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'numberOfMatches' ? Number(value) : value }));
  };
  
  const handleAutoCatchLocation = () => {
    if (!navigator.geolocation) {
        toast({ title: "Geolocation not supported", description: "Your browser does not support this feature.", variant: "destructive" });
        return;
    }

    setIsFetchingLocation(true);
    toast({ title: "Fetching your location..." });

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

            if (!apiKey) {
                toast({ title: "Configuration Error", description: "Google Maps API key is missing.", variant: "destructive" });
                setIsFetchingLocation(false);
                return;
            }

            try {
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
                const data = await response.json();
                
                if (data.status === 'OK' && data.results[0]) {
                    const addressComponents = data.results[0].address_components;
                    const locality = addressComponents.find((c: any) => c.types.includes('locality'))?.long_name;
                    const city = addressComponents.find((c: any) => c.types.includes('administrative_area_level_2'))?.long_name;
                    
                    const formattedLocation = [locality, city].filter(Boolean).join(', ');

                    setFormData(prev => ({ ...prev, location: formattedLocation || data.results[0].formatted_address }));
                    toast({ title: "Location Found!", description: formattedLocation, variant: "default" });
                } else {
                    throw new Error(data.error_message || "Could not determine address from coordinates.");
                }
            } catch (apiError: any) {
                toast({ title: "Error Fetching Address", description: apiError.message, variant: "destructive" });
            } finally {
                setIsFetchingLocation(false);
            }
        },
        (error) => {
            let errorMessage = "An unknown error occurred.";
            if (error.code === error.PERMISSION_DENIED) {
                errorMessage = "You denied the request for Geolocation.";
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                errorMessage = "Location information is unavailable.";
            } else if (error.code === error.TIMEOUT) {
                errorMessage = "The request to get user location timed out.";
            }
            toast({ title: "Geolocation Error", description: errorMessage, variant: "destructive" });
            setIsFetchingLocation(false);
        }
    );
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const result = await aiPeerMatch(formData);
      setResults(result);
    } catch (err) {
      setError('Failed to find matches. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
            <Users className="text-primary h-7 w-7" />
            <BilingualText en="AI Peer Match" hi="एआई पीयर मैच" />
        </CardTitle>
        <CardDescription>
            <BilingualText en="Find study buddies near you based on your subject." hi="अपने विषय के आधार पर अपने आस-पास अध्ययन मित्रों को ढूंढें।" />
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle><BilingualText en="Error" hi="त्रुटि" /></AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="location"><BilingualText en="Your Location (City/Area)" hi="आपका स्थान (शहर/क्षेत्र)" /></Label>
            <div className="flex items-center gap-2">
              <Input id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g., Delhi, Karol Bagh" required />
              <Button type="button" variant="outline" size="icon" onClick={handleAutoCatchLocation} disabled={isFetchingLocation} aria-label="Auto-detect location">
                {isFetchingLocation ? <LoadingSpinner size={16} /> : <LocateFixed className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="subject"><BilingualText en="Subject" hi="विषय" /></Label>
            <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="e.g., Physics, Class 10 Maths" required />
          </div>
          <div>
            <Label htmlFor="numberOfMatches"><BilingualText en="Number of Matches" hi="मैचों की संख्या" /></Label>
            <Input id="numberOfMatches" name="numberOfMatches" type="number" min="1" max="10" value={formData.numberOfMatches} onChange={handleInputChange} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size={20} /> : <BilingualText en="Find Peers" hi="सहकर्मी ढूंढें" />}
          </Button>
        </CardFooter>
      </form>

      {isLoading && !results && (
        <div className="p-6 text-center">
          <LoadingSpinner size={32} />
          <p className="mt-2 text-muted-foreground"><BilingualText en="Finding potential study partners..." hi="संभावित अध्ययन भागीदारों को ढूंढा जा रहा है..." /></p>
        </div>
      )}

      {results && results.matches.length > 0 && (
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold font-headline"><BilingualText en="Your Matches" hi="आपके मैच" />:</h3>
          {results.matches.map((match, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex items-start space-x-4">
                <Image src={`https://placehold.co/60x60.png?text=${match.name.substring(0,1)}`} alt={match.name} width={60} height={60} className="rounded-full border" data-ai-hint="student avatar" />
                <div className="flex-grow">
                  <h4 className="font-semibold text-md text-primary">{match.name}</h4>
                  <div className="text-sm text-muted-foreground space-y-1 mt-1">
                    <p className="flex items-center gap-1.5"><BookOpen size={14} /> <BilingualText en="Subject" hi="विषय" />: {match.subject}</p>
                    <p className="flex items-center gap-1.5"><MapPin size={14} /> <BilingualText en="Location" hi="स्थान" />: {match.location}</p>
                    <p className="flex items-center gap-1.5"><Phone size={14} /> <BilingualText en="Contact" hi="संपर्क करें" />: {match.contactInfo}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm"><BilingualText en="Connect" hi="जुडिये" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {results && results.matches.length === 0 && (
         <div className="p-6 text-center text-muted-foreground">
            <BilingualText en="No matches found for your criteria. Try broadening your search!" hi="आपके मानदंडों के लिए कोई मेल नहीं मिला। अपनी खोज को व्यापक बनाने का प्रयास करें!" />
        </div>
      )}
    </Card>
  );
}
