
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserManagementPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Users className="h-7 w-7 text-primary" />
          <BilingualText en="User Management" hi="उपयोगकर्ता प्रबंधन" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/platform-admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Admin" hi="एडमिन पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="All Users" hi="सभी उपयोगकर्ता" /></CardTitle>
          <CardDescription><BilingualText en="View, search, and manage all users across the platform." hi="प्लेटफ़ॉर्म पर सभी उपयोगकर्ताओं को देखें, खोजें और प्रबंधित करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-center py-8">
                <BilingualText en="This feature is under construction. Check back soon!" hi="यह सुविधा निर्माणाधीन है। जल्द ही वापस देखें!" />
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
