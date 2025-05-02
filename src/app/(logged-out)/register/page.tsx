"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerUser } from "./actions";
import Link from "next/link";
import { useState } from "react";
import AuthOptions from "../auth-options";

const formSchema = z
    .object({
        email: z.string().email(),
    })
    .and(passwordMatchSchema);

export default function Register() {
    const [showForm, setShowForm] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirm: "",
        },
    });

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const response = await registerUser({
            email: data.email, // bu kısmı data.email, yerine "", yaparsan client tarafında arayüzde hata vermez ama browser konsolunda hata verir çünkü action.ts tarafı hata dönderir. Yani hata yönetimi hem ui tarafında hem de server tarafında var
            password: data.password,
            passwordConfirm: data.passwordConfirm,
        });

        if (response?.error) { // bu kısım action.ts dosyasındaki An account is already registered with that email address. kısmı için 
            form.setError("email", {
                message: response?.message,
            });
        }

        console.log(response);
    };

    return (
        <main className="flex justify-center items-center min-h-screen">
            {form.formState.isSubmitSuccessful ? (
                <Card className="w-[350px]">
                    <CardHeader className="flex justify-center items-center">
                        <CardTitle>Check your email to verify your account</CardTitle>
                    </CardHeader>
                    <CardContent>
                    We have sent a verification link to your email address. Please check your inbox and click the link to activate your account.
                        {/* child prop means all of the styles for the button is going to be applied to the link component */}
                        <Button asChild className="w-full mt-4">
                            <Link href="/login">Back to Login</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>
                            Register
                        </CardTitle>
                        <CardDescription>
                            Register for a new account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!showForm ? (
                            <AuthOptions onEmail={() => setShowForm(true)} />
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-2">
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
                                                    <FormLabel>
                                                        Email
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="email" />
                                                    </FormControl>
                                                    <FormMessage>

                                                    </FormMessage>
                                                </FormItem>
                                            )}>
                                        </FormField>
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" />
                                                    </FormControl>
                                                    <FormMessage>

                                                    </FormMessage>
                                                </FormItem>
                                            )}>
                                        </FormField>
                                        <FormField
                                            control={form.control}
                                            name="passwordConfirm"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Password confirm
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" />
                                                    </FormControl>
                                                    <FormMessage>

                                                    </FormMessage>
                                                </FormItem>
                                            )}>
                                        </FormField>
                                        <Button type="submit">
                                            Register
                                        </Button>
                                    </fieldset>
                                </form>
                            </Form>
                        )}
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <div className="text-muted-foreground text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="underline">
                                Login
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            )
            }
        </main>
    );
}