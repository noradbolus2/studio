
"use client";

import { useState, type FormEvent } from 'react';
import { predictColleges, type CollegePredictorInput, type CollegePredictorOutput } from '@/ai/flows/college-predictor-flow';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GraduationCap, IndianRupee, MapPin, BookOpen, ListChecks, Percent, Landmark } from "lucide-react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Badge } from '@/components/ui/badge';

export default function CollegePredictorPage() {
  const [formData, setFormData] = useState<Partial<CollegePredictorInput>>({
    percentage12th: undefined, // Use undefined for easier number input handling
    jeeRank: undefined,
    budget: undefined,
    preferredLocation: '',
    preferredCourses: [],
  });
  const [results, setResults] = useState<CollegePredictorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "preferredCourses") {
        setFormData((prev) => ({ ...prev, [name]: value.split(',').map(course => course.trim()).filter(course => course) }));
    } else if (name === "percentage12th" || name === "jeeRank" || name === "budget") {
        setFormData((prev) => ({ ...prev, [name]: value ? Number(value) : undefined }));
    }
     else {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.percentage12th === undefined || formData.budget === undefined) {
        setError("Please fill in 12th Percentage and Budget.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const inputForApi = {
        percentage12th: formData.percentage12th,
        budget: formData.budget,
        jeeRank: formData.jeeRank,
        preferredLocation: formData.preferredLocation,
        preferredCourses: formData.preferredCourses
      } as CollegePredictorInput; // Type assertion after validation

      const result = await predictColleges(inputForApi);
      setResults(result);
    } catch (err) {
      setError('Failed to predict colleges. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getChanceBadgeVariant = (chance: string | undefined) => {
    switch (chance) {
      case 'High': return 'default'; // bg-primary
      case 'Medium': return 'secondary'; // bg-secondary
      case 'Low': return 'outline'; // text-foreground, border
      case 'Very Low': return 'destructive'; // bg-destructive
      default: return 'outline';
    }
  };


  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center justify-center gap-2">
          <GraduationCap className="h-8 w-8" />
          <BilingualText en="AI College Predictor" hi="एआई कॉलेज भविष्यवक्ता" />
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          <BilingualText en="Enter your details for AI-powered suggestions. Remember, for many professional courses, entrance exam scores are more important than 12th marks." hi="एआई-संचालित सुझावों के लिए अपना विवरण दर्ज करें। याद रखें, कई व्यावसायिक पाठ्यक्रमों के लिए, 12वीं के अंकों की तुलना में प्रवेश परीक्षा स्कोर अधिक महत्वपूर्ण हैं।" />
        </p>
      </header>

      <Card className="w-full max-w-xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ListChecks className="text-accent h-6 w-6"/>
                <BilingualText en="Enter Your Details" hi="अपना विवरण दर्ज करें" />
            </CardTitle>
            <CardDescription>
                <BilingualText en="Provide your 12th marks for eligibility and entrance exam ranks for accurate predictions." hi="पात्रता के लिए अपने 12वीं के अंक और सटीक भविष्यवाणियों के लिए प्रवेश परीक्षा रैंक प्रदान करें।" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle><BilingualText en="Error" hi="त्रुटि" /></AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="percentage12th" className="flex items-center gap-1"><Percent size={14}/> <BilingualText en="12th Standard Percentage" hi="12वीं कक्षा का प्रतिशत" />*</Label>
                    <Input id="percentage12th" name="percentage12th" type="number" step="0.01" min="0" max="100" value={formData.percentage12th || ''} onChange={handleInputChange} placeholder="e.g., 85.5" required />
                </div>
                <div>
                    <Label htmlFor="jeeRank" className="flex items-center gap-1"><GraduationCap size={14}/> <BilingualText en="JEE Rank (Optional)" hi="जेईई रैंक (वैकल्पिक)" /></Label>
                    <Input id="jeeRank" name="jeeRank" type="number" min="0" value={formData.jeeRank || ''} onChange={handleInputChange} placeholder="e.g., 50000" />
                </div>
            </div>
            <div>
                <Label htmlFor="budget" className="flex items-center gap-1"><IndianRupee size={14}/> <BilingualText en="Annual Budget (INR)" hi="वार्षिक बजट (INR)" />*</Label>
                <Input id="budget" name="budget" type="number" min="0" value={formData.budget || ''} onChange={handleInputChange} placeholder="e.g., 200000 for 2 Lakhs" required/>
            </div>
            <div>
                <Label htmlFor="preferredLocation" className="flex items-center gap-1"><MapPin size={14}/> <BilingualText en="Preferred Location (Optional)" hi="पसंदीदा स्थान (वैकल्पिक)" /></Label>
                <Input id="preferredLocation" name="preferredLocation" value={formData.preferredLocation} onChange={handleInputChange} placeholder="e.g., Pune, Delhi, Tamil Nadu" />
            </div>
            <div>
                <Label htmlFor="preferredCourses" className="flex items-center gap-1"><BookOpen size={14}/> <BilingualText en="Preferred Courses (Optional, comma-separated)" hi="पसंदीदा पाठ्यक्रम (वैकल्पिक, अल्पविराम से अलग)" /></Label>
                <Textarea id="preferredCourses" name="preferredCourses" value={formData.preferredCourses?.join(', ') || ''} onChange={handleInputChange} placeholder="e.g., Computer Science, AI & ML, Electronics" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : <BilingualText en="Predict Colleges" hi="कॉलेज की भविष्यवाणी करें" />}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isLoading && !results && (
        <div className="p-6 text-center">
          <LoadingSpinner size={48} />
          <p className="mt-4 text-muted-foreground"><BilingualText en="Finding the best colleges for you..." hi="आपके लिए सर्वोत्तम कॉलेजों की तलाश है..." /></p>
        </div>
      )}

      {results && (
        <Card className="w-full max-w-2xl mx-auto mt-8 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-headline text-primary"><BilingualText en="College Suggestions" hi="कॉलेज सुझाव"/></CardTitle>
                <CardDescription>{results.disclaimer}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            {results.suggestions.length > 0 ? (
                results.suggestions.map((college, index) => (
                <Card key={index} className="overflow-hidden border hover:shadow-md transition-shadow">
                    <CardHeader className="bg-muted/30 p-4">
                        <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
                            <Landmark size={20}/> {college.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1"><MapPin size={14}/>{college.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2 text-sm">
                        <p><strong className="font-medium"><BilingualText en="Courses:" hi="पाठ्यक्रम:"/></strong> {college.coursesOffered.join(', ')}</p>
                        <p><strong className="font-medium"><BilingualText en="Est. Fee:" hi="अनुमानित शुल्क:"/></strong> {college.estimatedAnnualFee}</p>
                        <div className="flex items-center gap-2">
                            <strong className="font-medium"><BilingualText en="Admission Chance:" hi="प्रवेश संभावना:"/></strong> 
                            <Badge variant={getChanceBadgeVariant(college.admissionChance)}>{college.admissionChance}</Badge>
                        </div>
                        {college.remarks && <p className="text-xs italic text-muted-foreground">({college.remarks})</p>}
                    </CardContent>
                </Card>
                ))
            ) : (
                <p className="text-muted-foreground text-center py-4"><BilingualText en="No specific college suggestions found based on your criteria. Try adjusting your inputs." hi="आपके मानदंडों के आधार पर कोई विशिष्ट कॉलेज सुझाव नहीं मिला। अपनी जानकारी समायोजित करने का प्रयास करें।" /></p>
            )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
