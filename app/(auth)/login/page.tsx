'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { toast } from "sonner"
import axios from "axios"
import { useAuth } from "@/app/context/AuthContext"


const formSchema = z.object({
    email: z.string().min(1, {
        message: "email is required"
    }),
    password: z.string().min(1)
})


const page = () => {


    const router = useRouter()

    const { login } = useAuth()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const { isSubmitting, isValid } = form.formState



    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        try {
            const { data } = await axios.post('/api/auth/login', values)
            const { status, token, message } = data;
            if (status === 200) {
                login(token)
            } else {
                toast.info(message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex min-h-screen px-4 items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="mx-auto w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                <p className="text-3xl text-center dark:text-gray-400">Login</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 flex flex-col gap-3 mt-4'>
                        <div>
                            <Label className="mb-3 block" htmlFor="email">Email</Label>
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id='email'
                                                    autoComplete="off"
                                                    disabled={isSubmitting}
                                                    placeholder="e.g. test@mail.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )
                                }}
                            />
                        </div>
                        <div>
                            <Label className="mb-3 block" htmlFor="password">Password</Label>
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    disabled={isSubmitting}
                                                    type="password"
                                                    id='password'
                                                    autoComplete="off"
                                                    placeholder="*******"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )
                                }}
                            />
                        </div>
                        <Button
                            type='submit'
                            className="w-full"
                            disabled={isSubmitting || !isValid}
                        >
                            Login
                        </Button>
                    </form >
                </Form>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{" "}
                    <Link href="/register" className="font-medium text-gray-900 hover:underline dark:text-gray-400" prefetch={false}>
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default page