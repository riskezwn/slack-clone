'use client';

import { useAuthActions } from '@convex-dev/auth/react';

import { Button } from '@/components/ui/button';

const HomePage = () => {
  const { signOut } = useAuthActions();
  return (
    <div>
      Logged in!
      <Button onClick={signOut} variant="destructive">
        Sign out
      </Button>
    </div>
  );
};

export default HomePage;
