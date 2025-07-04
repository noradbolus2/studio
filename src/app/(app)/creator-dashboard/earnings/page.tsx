
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { IndianRupee, BarChart3, PieChart as PieChartIcon, Download } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, Pie, Cell, Tooltip as RechartsTooltip, PieChart } from "recharts";
import { BarChart } from "recharts";

const weeklyEarningsData = [
    { week: "W1", earnings: 12540 },
    { week: "W2", earnings: 15200 },
    { week: "W3", earnings: 11800 },
    { week: "W4", earnings: 17500 },
];

const workTypeSplitData = [
    { type: "Doubts", value: 3500, fill: "hsl(var(--chart-1))" },
    { type: "Flashcards", value: 4000, fill: "hsl(var(--chart-2))" },
    { type: "Voiceovers", value: 2540, fill: "hsl(var(--chart-3))" },
    { type: "MCQs", value: 2500, fill: "hsl(var(--chart-4))" },
];

export default function EarningsPage() {
    return (
        <div className="space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2">
                        <IndianRupee className="h-7 w-7 text-primary" />
                        <BilingualText en="Earnings & Payouts" hi="कमाई और भुगतान" />
                    </CardTitle>
                    <CardDescription>
                        <BilingualText en="Track your earnings and manage payouts." hi="अपनी कमाई को ट्रैक करें और भुगतान प्रबंधित करें।" />
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Weekly Earnings Snapshot</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-1">
                            <p>✔️ 5 Doubts Solved – INR 125</p>
                            <p>✔️ 1 Voiceover – INR 40</p>
                            <p>✔️ 2 Flashcard Sets – INR 400</p>
                            <p className="font-bold pt-2">Total This Week: INR 565</p>
                        </CardContent>
                    </Card>
                    <p className="text-center text-sm font-semibold text-muted-foreground">Next Payout: Friday</p>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button className="w-full">Request Payout</Button>
                    <Button variant="link" className="text-muted-foreground">View Full Ledger</Button>
                </CardFooter>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart3/> Weekly Income Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[250px] w-full">
                            <BarChart data={weeklyEarningsData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis tickFormatter={(value) => `INR ${value / 1000}k`} />
                                <RechartsTooltip formatter={(value: number) => `INR ${value.toLocaleString()}`} content={<ChartTooltipContent />} />
                                <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PieChartIcon/> Work Type Split</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <ChartContainer config={{}} className="h-[250px] w-full max-w-xs">
                           <PieChart>
                              <RechartsTooltip content={<ChartTooltipContent nameKey="type" />} />
                              <Pie data={workTypeSplitData} dataKey="value" nameKey="type" cx="50%" cy="50%" outerRadius={80} label>
                                {workTypeSplitData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardFooter className="pt-6">
                    <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4"/> Download Full Earnings Report
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
