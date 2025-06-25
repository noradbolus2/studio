
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SystemSettingsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary" />
          <BilingualText en="System Settings" hi="सिस्टम सेटिंग्स" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/platform-admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Admin" hi="एडमिन पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="General Settings" hi="सामान्य सेटिंग्स" /></CardTitle>
          <CardDescription><BilingualText en="Configure global settings for the OSO application." hi="ओएसओ एप्लिकेशन के लिए वैश्विक सेटिंग्स कॉन्फ़िगर करें।" /></CardDescription>
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
