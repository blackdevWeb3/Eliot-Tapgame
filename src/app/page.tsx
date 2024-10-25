// app/page.tsx
'use client'
import { Suspense } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

function UserDataFetcher() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserData } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      const id = searchParams.get('id');
      
      if (!id) {
        console.error('No ID provided');
        return;
      }

      try {
        const response = await fetch(`/api/user?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        console.log(userData);
        setUserData(userData);
        router.push("/play");
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error appropriately
      }
    };

    fetchUserData();
  }, [searchParams, router, setUserData]);

  return null;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserDataFetcher />
    </Suspense>
  );
}
