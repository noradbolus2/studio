
// Placeholder for Brain Scan Aura Report UI
import * as React from "react"; 
import { BilingualText } from "@/components/shared/BilingualText";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, TrendingUp, TrendingDown, Smile, Sun } from "lucide-react";

// Mock data - replace with actual data fetching
const auraReportData = {
  userName: "Aarav S.",
  weekOf: "June 10 - June 16, 2024",
  brainScore: 78, // Overall score
  focus: { value: 85, trend: "up", color: "bg-green-500" }, // Higher is better
  stress: { value: 30, trend: "down", color: "bg-blue-500" }, // Lower is better
  energy: { value: 70, trend: "stable", color: "bg-yellow-500" }, // Higher is better
  clarity: { value: 75, trend: "up", color: "bg-purple-500" }, // Higher is better
  mood: "Positive", // Could be based on Mind Diary
  insights: [
    { en: "Great improvement in focus this week!", hi: "इस सप्ताह फोकस में शानदार सुधार!" },
    { en: "Stress levels are well managed.", hi: "तनाव का स्तर अच्छी तरह से प्रबंधित है।" },
  ],
  recommendations: [
    { en: "Continue with focused study sessions.", hi: "केंद्रित अध्ययन सत्र जारी रखें।" },
    { en: "Try a 5-minute meditation before sleep.", hi: "सोने से पहले 5 मिनट का ध्यान करें।" },
  ]
};

export default function BrainScanReportPage() {
  return (
    <React.Fragment>
      <div className="space-y-6">
        <header className="text-center py-4">
          <h1 className="text-3xl font-bold font-headline text-primary">
            <BilingualText en="OSO Brain Scan™ Report" hi="OSO ब्रेन स्कैन™ रिपोर्ट" />
          </h1>
          <p className="text-muted-foreground">
            <BilingualText en={`Weekly Aura Map for ${auraReportData.userName}`} hi={`${auraReportData.userName} के लिए साप्ताहिक ऑरा मैप`} />
          </p>
          <p className="text-sm text-muted-foreground">{auraReportData.weekOf}</p>
        </header>

        <Card className="w-full max-w-md mx-auto shadow-xl bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <CardHeader className="items-center text-center">
            <div className="relative w-48 h-48 mb-4">
              {/* Placeholder for Aura Map UI - This would be a complex SVG or Canvas visualization */}
              <div className="absolute inset-0 rounded-full bg-purple-200 animate-pulse-subtle opacity-30" data-ai-hint="aura map visualization"></div>
              <div className="absolute inset-4 rounded-full bg-blue-200 animate-pulse-subtle opacity-40 delay-100"></div>
              <div className="absolute inset-8 rounded-full bg-green-200 animate-pulse-subtle opacity-50 delay-200"></div>
              <div className="absolute inset-12 rounded-full bg-yellow-200 animate-pulse-subtle opacity-60 delay-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-16 h-16 text-primary opacity-75" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">{auraReportData.brainScore}</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-primary"><BilingualText en="Brain Score" hi="ब्रेन स्कोर" />: {auraReportData.brainScore}/100</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 pb-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { labelEn: "Focus", labelHi: "फोकस", data: auraReportData.focus, icon: Zap },
                { labelEn: "Stress", labelHi: "तनाव", data: auraReportData.stress, icon: TrendingDown },
                { labelEn: "Energy", labelHi: "ऊर्जा", data: auraReportData.energy, icon: TrendingUp },
                { labelEn: "Clarity", labelHi: "स्पष्टता", data: auraReportData.clarity, icon: Sun },
              ].map(item => (
                <Card key={item.labelEn} className={`p-3 rounded-lg shadow-sm bg-opacity-10 ${item.data.color.replace('bg-','border-')}/30 border-2 ${item.data.color.replace('bg-','border-')}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold flex items-center gap-1.5">
                      <item.icon className={`w-4 h-4 ${item.data.color.replace('bg-','text-')}`} />
                      <BilingualText en={item.labelEn} hi={item.labelHi} />
                    </h3>
                    <span className={`text-lg font-bold ${item.data.color.replace('bg-','text-')}`}>{item.data.value}%</span>
                  </div>
                  <p className={`text-xs ${item.data.color.replace('bg-','text-')} opacity-80`}>
                    <BilingualText en={`Trend: ${item.data.trend}`} hi={`प्रवृत्ति: ${item.data.trend === "up" ? "ऊपर" : item.data.trend === "down" ? "नीचे" : "स्थिर"}`} />
                  </p>
                </Card>
              ))}
            </div>
            
            <Card className="p-3 bg-muted/50">
              <h3 className="font-semibold text-sm mb-1"><BilingualText en="Mood Insight" hi="मनोदशा अंतर्दृष्टि"/></h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-green-500"/> 
                  <BilingualText en={`Overall mood: ${auraReportData.mood}`} hi={`समग्र मनोदशा: ${auraReportData.mood === "Positive" ? "सकारात्मक" : "चिंतनशील" }`}/>
              </p>
            </Card>

            <div className="space-y-2">
              <div>
                <h4 className="font-semibold"><BilingualText en="Key Insights" hi="मुख्य अंतर्दृष्टि" /></h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                  {auraReportData.insights.map((insight, i) => <li key={i}><BilingualText en={insight.en} hi={insight.hi} /></li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold"><BilingualText en="Recommendations" hi="सिफारिशें" /></h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                  {auraReportData.recommendations.map((rec, i) => <li key={i}><BilingualText en={rec.en} hi={rec.hi} /></li>)}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </React.Fragment>
  );
}
