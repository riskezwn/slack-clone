import { useState } from 'react';

import { useAuthActions } from '@convex-dev/auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockIcon, MailIcon, TriangleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { SignInFlow } from '../types';

import { OAuthButtons } from './oauth-buttons';

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string(),
});
type SignInSchema = z.infer<typeof signInSchema>;

export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const onCredentialsSignIn = async (values: SignInSchema) => {
    const { password, email } = values;

    setPending(true);

    signIn('password', { email, password, flow: 'signIn' })
      .catch(() => {
        setError('Invalid email or password');
      })
      .finally(() => setPending(false));
  };

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>Use your email or another service to sign in.</CardDescription>
      </CardHeader>
      {!!error && (
        <div className="mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCredentialsSignIn)} className="space-y-2.5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={pending}
                  placeholder="Email"
                  type="email"
                  icon={<MailIcon />}
                  // required
                />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={pending}
                  type="password"
                  placeholder="Password"
                  icon={<LockIcon />}
                  // required
                />
              )}
            />
            <Button type="submit" className="w-full" size="lg" disabled={pending}>
              Continue
            </Button>
          </form>
        </Form>
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
