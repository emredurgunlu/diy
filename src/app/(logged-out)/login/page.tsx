"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordSchema } from "@/validation/passwordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginWithCredentials, resendVerificationEmail } from "./action";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import AuthOptions from "../auth-options";

const formSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export default function Login() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await loginWithCredentials({
      email: data.email,
      password: data.password,
    });

    if (response?.error) {
      form.setError("root", {
        message: response.message,
      });
    } else {
      router.push("/my-account");
    }
  };
  // const email kısmının amacı şu:
  // if the user has typed in an email
  // address on the login form, and then they click on through to reset my password, the email address
  // value will be passed from the login page to the password reset page, and it will automatically populate
  // bu nedenle de aşağıdaki <Link href="/password-reset" kısmında düzeltme yaptık
  // const email = form.getValues("email");
  const email = form.watch("email");

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Log in to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <AuthOptions onEmail={() => setShowForm(true)} />
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-2"
              >
                <fieldset
                  disabled={form.formState.isSubmitting}
                  className="flex flex-col gap-2"
                >
                  {/*fieldset kısmı kullanıcının register butonuna bastığı zaman formun submit edildiğini farketmesi için bir loading state göstermek amaçlı */}
                  {/*yani form submit edilirken bu field sete disabled özelliği ekleyeceğiz */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                    )}
                  ></FormField>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                  {!!form.formState.errors.root?.message && (
                    <>
                      <FormMessage>
                        {form.formState.errors.root.message}
                      </FormMessage>
                      {form.formState.errors.root.message === "Please verify your account before logging in." && (
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2"
                          onClick={() => resendVerificationEmail(form.getValues("email"))}
                        >
                          Resend verification email
                        </Button>
                      )}
                    </>
                  )}
                  <Button type="submit">Login</Button>
                </fieldset>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>
          <div className="text-muted-foreground text-sm">
            Forgot password?{" "}
            <Link
              href={`/password-reset${email ? `?email=${encodeURIComponent(email)}` : ""
                }`}
              className="underline"
            >
              Reset my password
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
