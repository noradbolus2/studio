
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface LogEntry {
    id: string;
    timestamp: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
    service: string;
    message: string;
    user?: string;
}

const mockLogs: LogEntry[] = [
    { id: "log1", timestamp: "2024-07-22 10:31:05", level: "INFO", service: "Auth", message: "User 'admin@oso.com' logged in successfully.", user: "admin@oso.com"},
    { id: "log2", timestamp: "2024-07-22 10:30:15", level: "INFO", service: "Orders", message: "New order #ORD78923 placed.", user: "student@oso.com"},
    { id: "log3", timestamp: "2024-07-22 10:25:00", level: "WARN", service: "API-Gateway", message: "High latency detected on /api/recommendations (1500ms)."},
    { id: "log4", timestamp: "2024-07-22 10:15:45", level: "ERROR", service: "Payments", message: "Payment failed for user 'student2@oso.com'. Reason: Insufficient funds.", user: "student2@oso.com"},
    { id: "log5", timestamp: "2024-07-22 10:05:10", level: "CRITICAL", service: "Database", message: "Failed to connect to primary database cluster. Failing over to replica."},
];

export default function SystemLogsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = mockLogs.filter(log => 
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getLevelBadgeVariant = (level: LogEntry['level']) => {
    switch(level) {
        case 'INFO': return 'bg-blue-500/20 text-blue-700 border-blue-400';
        case 'WARN': return 'bg-yellow-500/20 text-yellow-700 border-yellow-400';
        case 'ERROR': return 'bg-orange-500/20 text-orange-700 border-orange-400';
        case 'CRITICAL': return 'bg-red-500/20 text-red-700 border-red-400';
        default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Eye className="h-7 w-7 text-primary" />
          <BilingualText en="System Logs" hi="सिस्टम लॉग" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/platform-admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Admin" hi="एडमिन पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Activity Logs" hi="गतिविधि लॉग" /></CardTitle>
          <CardDescription><BilingualText en="View system-wide activity logs and events." hi="सिस्टम-व्यापी गतिविधि लॉग और ईवेंट देखें।" /></CardDescription>
        </CardHeader>
        <CardContent>
             <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder_en="Search logs by message, service, level, or user..." 
                        placeholder_hi="संदेश, सेवा, स्तर या उपयोगकर्ता द्वारा लॉग खोजें..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                 <Button variant="outline" className="w-full sm:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    <BilingualText en="Filter Logs" hi="लॉग फ़िल्टर करें" />
                </Button>
             </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">Timestamp</TableHead>
                            <TableHead className="w-[100px]">Level</TableHead>
                            <TableHead className="w-[120px]">Service</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead className="w-[150px]">User</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLogs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                                <TableCell><Badge variant="outline" className={getLevelBadgeVariant(log.level)}>{log.level}</Badge></TableCell>
                                <TableCell className="font-medium">{log.service}</TableCell>
                                <TableCell className="font-mono text-xs">{log.message}</TableCell>
                                <TableCell>{log.user || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}
