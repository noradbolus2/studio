
"use client";

// This file is no longer primarily used as profile editing is consolidated 
// into /src/app/(app)/edit-profile/page.tsx.
// This file can be kept as a simplified redirector or removed if not needed.
// For now, let's make it redirect to the consolidated page with the correct role.

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { BilingualText } from "@/components/shared/BilingualText";

export default function EditSchoolProfileRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // The recommended safe way to clone searchParams without enumeration
    const newParams = new URLSearchParams(Array.from(searchParams.entries()));
    newParams.set('role', 'school');

    // Redirect to the consolidated edit profile page
    router.replace(`/edit-profile?${newParams.toString()}`);
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <LoadingSpinner size={48} />
      <p className="mt-4 text-muted-foreground">
        <BilingualText en="Redirecting to School Profile Editor..." hi="स्कूल प्रोफ़ाइल संपादक पर रीडायरेक्ट किया जा रहा है..." />
      </p>
    </div>
  );
}
