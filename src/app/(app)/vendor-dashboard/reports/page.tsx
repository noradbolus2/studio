
// src/app/(app)/vendor-dashboard/reports/page.tsx
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, IndianRupee, Package, TrendingUp, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const reportTypes = [
  { id: "sales_overview", titleEn: "Sales Overview", titleHi: "बिक्री अवलोकन", icon: IndianRupee, descriptionEn: "Total sales, revenue, and profit margins.", descriptionHi: "कुल बिक्री, राजस्व और लाभ मार्जिन।" },
  { id: "product_performance", titleEn: "Product Performance", titleHi: "उत्पाद प्रदर्शन", icon: Package, descriptionEn: "Best-selling items, stock levels, and category analysis.", descriptionHi: "सबसे ज्यादा बिकने वाली वस्तुएं, स्टॉक स्तर और श्रेणी विश्लेषण।" },
  { id: "customer_insights", titleEn: "Customer Insights", titleHi: "ग्राहक अंतर्दृष्टि", icon: Users, descriptionEn: "Purchase patterns, new vs. returning customers.", descriptionHi: "खरीद पैटर्न, नए बनाम लौटने वाले ग्राहक।" },
  { id: "trends", titleEn: "Sales Trends", titleHi: "बिक्री रुझान", icon: TrendingUp, descriptionEn: "Daily, weekly, and monthly sales performance.", descriptionHi: "दैनिक, साप्ताहिक और मासिक बिक्री प्रदर्शन।" },
];

export default function VendorReportsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" />
          <BilingualText en="Sales Reports & Analytics" hi="बिक्री रिपोर्ट और एनालिटिक्स" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/vendor-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Business Performance Insights" hi="व्यापार प्रदर्शन अंतर्दृष्टि" /></CardTitle>
          <CardDescription><BilingualText en="Generate and view analytical reports to understand your sales." hi="अपनी बिक्री को समझने के लिए विश्लेषणात्मक रिपोर्ट तैयार करें और देखें।" /></CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map(report => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-1">
                  <report.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-md font-semibold"><BilingualText en={report.titleEn} hi={report.titleHi} /></CardTitle>
                </div>
                <CardDescription className="text-xs"><BilingualText en={report.descriptionEn} hi={report.descriptionHi} /></CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">
                  <BilingualText en="View Report" hi="रिपोर्ट देखें" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
