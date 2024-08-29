import { useAuthActions } from '@convex-dev/auth/react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';

export const OAuthButtons = () => {
  const { signIn } = useAuthActions();

  const handleProviderSignIn = (provider: 'github' | 'google') => signIn(provider);

  return (
    <div className="flex flex-col gap-y-2.5">
      <Button
        disabled={false}
        onClick={() => handleProviderSignIn('google')}
        variant="outline"
        size="lg"
        className="relative w-full"
      >
        <FcGoogle className="absolute left-2.5 size-5" />
        Continue with Google
      </Button>
      <Button
        disabled={false}
        onClick={() => handleProviderSignIn('github')}
        variant="outline"
        size="lg"
        className="relative w-full"
      >
        <FaGithub className="absolute left-2.5 size-5" />
        Continue with Github
      </Button>
    </div>
  );
};
