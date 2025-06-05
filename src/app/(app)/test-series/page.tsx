
import { BilingualText } from "@/components/shared/BilingualText";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

export default function TestSeriesPage() {
  // Mock data for test series categories
  const testCategories = [
    { id: "jee", nameEn: "JEE Main & Advanced", nameHi: "जेईई मुख्य और एडवांस्ड", descriptionEn: "Full syllabus mock tests, previous year papers.", descriptionHi: "पूर्ण पाठ्यक्रम मॉक टेस्ट, पिछले वर्ष के प्रश्नपत्र।"},
    { id: "neet", nameEn: "NEET UG", nameHi: "नीट यूजी", descriptionEn: "Subject-wise tests, all India ranking.", descriptionHi: "विषयवार टेस्ट, अखिल भारतीय रैंकिंग।"},
    { id: "cuet", nameEn: "CUET", nameHi: "सीयूईटी", descriptionEn: "Practice tests for all sections.", descriptionHi: "सभी वर्गों के लिए अभ्यास परीक्षण।"},
    { id: "boards", nameEn: "Class 10 & 12 Boards", nameHi: "कक्षा 10 और 12 बोर्ड", descriptionEn: "Chapter tests and model papers.", descriptionHi: "अध्याय परीक्षण और मॉडल पेपर।"},
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <Target className="h-8 w-8 text-primary"/>
            <BilingualText en="Test Series" hi="टेस्ट सीरीज़" />
        </h1>
        <p className="text-muted-foreground">
            <BilingualText en="Practice and ace your exams." hi="अभ्यास करें और अपनी परीक्षाओं में उत्कृष्टता प्राप्त करें।" />
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testCategories.map(category => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="font-headline"><BilingualText en={category.nameEn} hi={category.nameHi} /></CardTitle>
                    <CardDescription><BilingualText en={category.descriptionEn} hi={category.descriptionHi} /></CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full"><BilingualText en="View Tests" hi="टेस्ट देखें" /></Button>
                </CardContent>
            </Card>
        ))}
      </div>

      <Card className="bg-accent/10 border-accent/30">
        <CardHeader>
            <CardTitle className="font-headline text-accent"><BilingualText en="Why OSO Test Series?" hi="OSO टेस्ट सीरीज़ क्यों?" /></CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
            <p><BilingualText en="✓ AI-powered performance analysis" hi="✓ एआई-संचालित प्रदर्शन विश्लेषण" /></p>
            <p><BilingualText en="✓ Real exam simulation" hi="✓ वास्तविक परीक्षा सिमुलेशन" /></p>
            <p><BilingualText en="✓ Detailed solutions and explanations" hi="✓ विस्तृत समाधान और स्पष्टीकरण" /></p>
        </CardContent>
      </Card>
    </div>
  );
}
