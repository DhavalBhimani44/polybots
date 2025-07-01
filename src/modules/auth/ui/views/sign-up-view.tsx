/* eslint-disable @next/next/no-img-element */
"use client";

import { OctagonAlertIcon, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaGoogle, FaGithub } from 'react-icons/fa';


import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormMessage, FormItem, FormField, FormLabel } from '@/components/ui/form';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { authClient } from '@/lib/auth-client';

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required." }),
  confirmPassword: z.string().min(1, { message: "Password is required." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignUpView() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null);
  const [loadingButton, setLoadingButton] = useState<null | 'email' | 'google' | 'github'>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setLoadingButton('email');
    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: '/'
      },
      {
        onSuccess: () => {
          setLoadingButton(null);
          router.push('/')
        },
        onError: ({ error }) => {
          setLoadingButton(null);
          setError(error.message);
        }
      }
    );
  };

  return (
    <div className='flex flex-col gap-6'>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-8'>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col items-center text-center'>
                  <h1 className='text-2xl font-bold'>Let&apos;s get started</h1>
                  <p className='text-muted-foreground text-balance'>Create your account</p>
                </div>

                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder='John Doe' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type='email' placeholder='john@example.com' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type='password' placeholder='********' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type='password' placeholder='********' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!!error && (
                  <Alert className='bg-destructive/10 border-none'>
                    <OctagonAlertIcon className='h-4 w-4 !text-destructive' />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}

                <Button
                  disabled={loadingButton !== null}
                  type='submit'
                  className={`w-full flex items-center justify-center gap-2 ${loadingButton === 'email' ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {loadingButton === 'email' && <Loader2 className='h-4 w-4 animate-spin' />}
                  Sign up
                </Button>

                <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                  <span className='bg-card text-muted-foreground relative z-10 px-2'>
                    Or continue with
                  </span>
                </div>

                <div className='grid grid-cols-2 gap-2'>
                  <Button
                    disabled={loadingButton !== null}
                    onClick={() => {
                      setLoadingButton('google');
                      authClient.signIn.social({ provider: 'google' });
                    }}
                    variant='outline'
                    type='button'
                    className={`w-full flex items-center justify-center gap-2 ${loadingButton === 'google' ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {loadingButton === 'google' && <Loader2 className='h-4 w-4 animate-spin' />}
                    <FaGoogle />
                  </Button>

                  <Button
                    disabled={loadingButton !== null}
                    onClick={() => {
                      setLoadingButton('github');
                      authClient.signIn.social({ provider: 'github' });
                    }}
                    variant='outline'
                    type='button'
                    className={`w-full flex items-center justify-center gap-2 ${loadingButton === 'github' ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {loadingButton === 'github' && <Loader2 className='h-4 w-4 animate-spin' />}
                    <FaGithub />
                  </Button>
                </div>

                <div className='text-center text-sm'>
                  Already have an account?{" "}
                  <Link href="/sign-in" className='underline underline-offset-4'>Sign in</Link>
                </div>
              </div>
            </form>
          </Form>

          <div className='bg-[radial-gradient(circle,var(--primary)_0%,var(--primary-foreground)_100%)] relative hidden md:flex flex-col gap-y-4 items-center justify-center'>
            <img src="/logo.svg" alt="logo" className='h-[92px] w-[92px]' />
            <p className='text-2xl font-semibold text-white'>
              Polybots
            </p>
          </div>
        </CardContent>
      </Card>

      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a> and <a href="#">Privacy Policy</a>
      </div>
    </div>
  );
}