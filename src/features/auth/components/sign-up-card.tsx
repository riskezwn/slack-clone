import { useState } from 'react';

import { useAuthActions } from '@convex-dev/auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockIcon, MailIcon, TriangleAlert, User } from 'lucide-react';
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

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

const minLengthErrorMessage = 'Password must be at least 8 characters long';
const maxLengthErrorMessage = 'Password must not exceed 20 characters';
const uppercaseErrorMessage = 'Password must contain at least one uppercase letter';
const lowercaseErrorMessage = 'Password must contain at least one lowercase letter';
const numberErrorMessage = 'Password must contain at least one number';
const specialCharacterErrorMessage =
  'Password must contain at least one special character (!@#$%^&*)';

const passwordSchema = z
  .string()
  .min(8, { message: minLengthErrorMessage })
  .max(20, { message: maxLengthErrorMessage })
  .refine((password) => /[A-Z]/.test(password), {
    message: uppercaseErrorMessage,
  })
  .refine((password) => /[a-z]/.test(password), {
    message: lowercaseErrorMessage,
  })
  .refine((password) => /[0-9]/.test(password), { message: numberErrorMessage })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: specialCharacterErrorMessage,
  });

const signUpSchema = z
  .object({
    name: z.string().min(2, {
      message: 'Username must be at least 2 characters.',
    }),
    email: z.string().email({ message: 'Invalid email address.' }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });

type SignUpSchema = z.infer<typeof signUpSchema>;

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      confirmPassword: '',
      email: '',
      name: '',
      password: '',
    },
  });

  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const onCredentialsSignUp = async (values: SignUpSchema) => {
    const { confirmPassword, password, name, email } = values;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setPending(true);
    signIn('password', { name, email, password, flow: 'signUp' })
      .catch(() => {
        setError('Something went wrong');
      })
      .finally(() => setPending(false));
  };

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>Use your email or another service to sign up.</CardDescription>
      </CardHeader>
      {!!error && (
        <div className="mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCredentialsSignUp)} className="space-y-2.5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={pending}
                  placeholder="Full name"
                  type="text"
                  icon={<User />}
                  // required
                />
              )}
            />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={pending}
                  type="password"
                  icon={<LockIcon />}
                  placeholder="Confirm password"
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
