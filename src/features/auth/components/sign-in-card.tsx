import { useState } from 'react';

import { LockIcon, MailIcon } from 'lucide-react';

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

import { OAuthButtons } from './oauth-buttons';

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>Use your email or another service to sign in.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            icon={<MailIcon />}
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            icon={<LockIcon />}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            Continue
          </Button>
        </form>
        <Separator />
        <OAuthButtons setPending={setPending} />
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <span
            onClick={() => setState('signUp')}
            className="cursor-pointer text-sky-500 hover:underline"
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
