'use client'
import { Input } from "@/components/ui/input"
import Link from "next/link"
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import axios from "axios"
import { useAuth } from "@/app/context/AuthContext"


const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(4, { message: "Password must be at least 4 characters." }),
    address: z.string().min(1, { message: "Address is required." }),
    telephone: z.string().min(1, { message: "Telephone is required." }),
    user_photo: z.string().url({ message: "User photo must be a valid URL." }),
});


const page = () => {


    const { register } = useAuth()


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            address: '',
            telephone: '',
            user_photo: '',
        },
    })

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const { data } = await axios.post('/api/auth/register', values)
            const { status, token, message } = data;
            if (status === 200) {
                register(token)
            } else {
                toast.info(message)
            }

        } catch (error) {
            console.log(error);

        }


    }

    return (
        <div className="flex min-h-screen px-4 items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="mx-auto w-full container space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                <h1 className="text-3xl text-center dark:text-gray-400">Register</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 max-w-4xl flex flex-col gap-7 mx-auto">
                        <div className="grid grid-cols-3 gap-5">
                            <FormField
                                control={form.control}
                                name="name"
                                disabled={isSubmitting}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                disabled={isSubmitting}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                disabled={isSubmitting}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                disabled={isSubmitting}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="telephone"
                                disabled={isSubmitting}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telephone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Telephone" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="user_photo"
                                disabled={isSubmitting}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Photo URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Photo URL" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" disabled={isSubmitting || !isValid}>Register</Button>
                    </form>
                </Form>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    You have an account{" "}
                    <Link href="/login" className="font-medium text-gray-900 hover:underline dark:text-gray-400" prefetch={false}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default page