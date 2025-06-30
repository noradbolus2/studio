"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText, IndianRupee, BarChart3, Bell } from "lucide-react";
import Link from "next/link";

interface ActionItem {
  id: string;
  labelEn: string;
  labelHi: string;
  icon: React.ElementType;
  href: string;
}

interface AccountantDashboardViewProps {
  accountantName: string;
  actions: ActionItem[];
}

const accountantStats = [
  { id: "fees_collected", labelEn: "Fees Collected (Today)", labelHi: "आज एकत्रित शुल्क", value: "₹50,000", icon: IndianRupee },
  { id: "pending_dues", labelEn: "Pending Dues", labelHi: "लंबित बकाया", value: "₹1,20,000", icon: FileText },
  { id: "expenses_month", labelEn: "Expenses (This Month)", labelHi: "व्यय (इस माह)", value: "₹80,000", icon: BarChart3 },
];

export default function AccountantDashboardView({ accountantName, actions }: AccountantDashboardViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">
            <BilingualText en={`Welcome, ${accountantName}! (Accountant)`} hi={`स्वागत है, ${accountantName}! (लेखाकार)`} />
          </CardTitle>
          <CardDescription>
            <BilingualText en="Manage school financials, fee collections, and expenses." hi="स्कूल वित्तीय, शुल्क संग्रह और व्यय का प्रबंधन करें।" />
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accountantStats.map(stat => (
          <Card key={stat.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><BilingualText en={stat.labelEn} hi={stat.labelHi}/></CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline"><BilingualText en="Accounts Quick Actions" hi="लेखा त्वरित कार्रवाइयां"/></CardTitle>
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
            <CardTitle className="font-headline"><BilingualText en="Recent Transactions" hi="हाल के लेनदेन"/></CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-sm">
                <BilingualText en="[Placeholder for recent fee payments, expense approvals]" hi="[हाल के शुल्क भुगतान, व्यय अनुमोदन के लिए प्लेसहोल्डर]" />
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
