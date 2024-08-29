import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SignInFlow } from '../types';

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProviderSignIn = (provider: 'github' | 'google') => signIn(provider);

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>Use your email or another service to sign up.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            disabled={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Input
            disabled={false}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            type="password"
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Continue
          </Button>
        </form>
        <Separator />
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
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <span
            onClick={() => setState('signIn')}
            className="cursor-pointer text-sky-500 hover:underline"
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
