import { useAuthActions } from '@convex-dev/auth/react';

import { GithubIcon } from '@/components/assets/icons/github-icon';
import { GoogleIcon } from '@/components/assets/icons/google-icon';
import { Button } from '@/components/ui/button';

interface OAuthButtonsProps {
  setPending: (pending: boolean) => void;
}

export const OAuthButtons = ({ setPending }: OAuthButtonsProps) => {
  const { signIn } = useAuthActions();

  const handleProviderSignIn = (provider: 'github' | 'google') => {
    setPending(true);
    signIn(provider).finally(() => setPending(false));
  };

  return (
    <div className="flex flex-col gap-y-2.5">
      <Button
        disabled={false}
        onClick={() => handleProviderSignIn('google')}
        variant="outline"
        size="lg"
        className="relative w-full"
      >
        <GoogleIcon className="absolute left-2.5 size-5" />
        Continue with Google
      </Button>
      <Button
        disabled={false}
        onClick={() => handleProviderSignIn('github')}
        variant="outline"
        size="lg"
        className="relative w-full"
      >
        <GithubIcon className="absolute left-2.5 size-5" />
        Continue with GitHub
      </Button>
    </div>
  );
};
