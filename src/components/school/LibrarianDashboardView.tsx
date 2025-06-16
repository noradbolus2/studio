
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen as LibraryIcon, ArrowLeftRight, BarChart3, Users, Bell } from "lucide-react";
import Link from "next/link";

interface ActionItem {
  id: string;
  labelEn: string;
  labelHi: string;
  icon: React.ElementType;
  href: string;
}

interface LibrarianDashboardViewProps {
  librarianName: string;
  actions: ActionItem[];
}

const librarianStats = [
  { id: "total_books", labelEn: "Total Books", labelHi: "कुल पुस्तकें", value: "5,000+", icon: LibraryIcon },
  { id: "issued_today", labelEn: "Issued Today", labelHi: "आज जारी", value: "25", icon: ArrowLeftRight },
  { id: "overdue_books", labelEn: "Overdue Books", labelHi: "अतिदेय पुस्तकें", value: "10", icon: Bell, color: "text-destructive" },
];

export default function LibrarianDashboardView({ librarianName, actions }: LibrarianDashboardViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">
            <BilingualText en={`Welcome, ${librarianName}! (Librarian)`} hi={`स्वागत है, ${librarianName}! (लाइब्रेरियन)`} />
          </CardTitle>
          <CardDescription>
            <BilingualText en="Manage library resources and student activity." hi="पुस्तकालय संसाधनों और छात्र गतिविधि का प्रबंधन करें।" />
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {librarianStats.map(stat => (
          <Card key={stat.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><BilingualText en={stat.labelEn} hi={stat.labelHi}/></CardTitle>
              <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color || ''}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline"><BilingualText en="Library Quick Actions" hi="पुस्तकालय त्वरित कार्रवाइयां"/></CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {actions.map(action => (
                <Button
                    key={action.id}
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary"
                    asChild
                >
                    <Link href={action.href}>
                        <action.icon className="h-7 w-7 text-primary mb-1"/>
                        <span className="text-xs font-medium"><BilingualText en={action.labelEn} hi={action.labelHi} /></span>
                    </Link>
                </Button>
            ))}
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
            <CardTitle className="font-headline"><BilingualText en="Recent Library Activity" hi="हाल की पुस्तकालय गतिविधि"/></CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-sm">
                <BilingualText en="[Placeholder for recent book issues, returns, new additions]" hi="[हाल की पुस्तक जारी, वापसी, नए परिवर्धन के लिए प्लेसहोल्डर]" />
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
