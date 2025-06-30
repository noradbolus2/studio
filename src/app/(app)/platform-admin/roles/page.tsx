
"use client";

import { useState } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, ShieldCheck, User, Briefcase, School, Sparkles, UserPlus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Permission {
  id: string;
  label: string;
}

interface Role {
  id: string;
  name: string;
  icon: React.ElementType;
  permissions: string[]; // Array of permission IDs
}

const allPermissions: Permission[] = [
  // User Management
  { id: "users.view", label: "View Users" },
  { id: "users.edit", label: "Edit Users" },
  { id: "users.suspend", label: "Suspend Users" },
  // Content Management
  { id: "content.view", label: "View Content" },
  { id: "content.moderate", label: "Moderate Content" },
  { id: "content.delete", label: "Delete Content" },
  // Financials
  { id: "finance.view_reports", label: "View Financial Reports" },
  { id: "finance.manage_payouts", label: "Manage Payouts" },
  // Platform Settings
  { id: "settings.edit_theme", label: "Edit Platform Theme" },
  { id: "settings.toggle_features", label: "Toggle Feature Flags" },
];

const initialRoles: Role[] = [
  { id: "student", name: "Student", icon: User, permissions: ["content.view"] },
  { id: "school_admin", name: "School Admin", icon: School, permissions: ["users.view", "users.edit", "content.view"] },
  { id: "vendor", name: "Vendor", icon: Briefcase, permissions: ["content.view"] },
  { id: "creator", name: "Creator", icon: Sparkles, permissions: ["content.view"] },
  { id: "platform_moderator", name: "Platform Moderator", icon: ShieldCheck, permissions: ["users.view", "content.moderate", "content.delete"]},
  { id: "platform_admin", name: "Platform Admin", icon: ShieldCheck, permissions: allPermissions.map(p => p.id) },
];


export default function RoleManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  
  const handlePermissionChange = (roleId: string, permissionId: string, checked: boolean) => {
    setRoles(currentRoles => 
        currentRoles.map(role => {
            if (role.id === roleId) {
                const newPermissions = checked
                    ? [...role.permissions, permissionId]
                    : role.permissions.filter(p => p !== permissionId);
                return { ...role, permissions: newPermissions };
            }
            return role;
        })
    );
  };
  
  const handleSaveChanges = () => {
    // In a real app, this would be an API call to save the roles state.
    // For now, we just show a success toast.
    console.log("Saving Roles:", roles);
    toast({
        title: "Roles Saved (Simulated)",
        description: "User roles and permissions have been updated.",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-primary" />
          <BilingualText en="Role Management" hi="भूमिका प्रबंधन" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/platform-admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Admin" hi="एडमिन पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Roles & Permissions" hi="भूमिकाएँ और अनुमतियाँ" /></CardTitle>
          <CardDescription><BilingualText en="Define and manage user roles and their access permissions." hi="उपयोगकर्ता भूमिकाओं और उनकी एक्सेस अनुमतियों को परिभाषित और प्रबंधित करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {roles.map(role => (
                    <AccordionItem key={role.id} value={role.id}>
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                                <role.icon className="h-5 w-5 text-primary"/>
                                <span className="font-semibold text-md">{role.name}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-muted/30 rounded-md">
                            <h4 className="text-sm font-semibold mb-3">Permissions:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {allPermissions.map(permission => (
                                    <div key={permission.id} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`${role.id}-${permission.id}`} 
                                            checked={role.permissions.includes(permission.id)}
                                            onCheckedChange={(checked) => handlePermissionChange(role.id, permission.id, !!checked)}
                                        />
                                        <Label htmlFor={`${role.id}-${permission.id}`} className="text-sm font-normal cursor-pointer">
                                            {permission.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
        <CardFooter className="justify-between border-t pt-4">
            <Button variant="outline"><UserPlus className="mr-2 h-4 w-4"/> Add New Role</Button>
            <Button onClick={handleSaveChanges}><Save className="mr-2 h-4 w-4"/> Save All Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
