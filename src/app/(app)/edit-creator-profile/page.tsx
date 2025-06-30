
"use client";

// This file is no longer primarily used as profile editing is consolidated 
// into /src/app/(app)/edit-profile/page.tsx.
// This file can be kept as a simplified redirector or removed if not needed.
// For now, let's make it redirect to the consolidated page with the correct role.

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { BilingualText } from "@/components/shared/BilingualText";

export default function EditCreatorProfileRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Construct new search params for the consolidated edit page
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('role', 'creator'); // Ensure role is correctly set for creator

    // Redirect to the consolidated edit profile page
    router.replace(`/edit-profile?${newParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <LoadingSpinner size={48} />
      <p className="mt-4 text-muted-foreground">
        <BilingualText en="Redirecting to Creator Profile Editor..." hi="निर्माता प्रोफ़ाइल संपादक पर रीडायरेक्ट किया जा रहा है..." />
      </p>
    </div>
  );
}
