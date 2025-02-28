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
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"


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
        <div className="flex min-h-screen px-4 items-center justify-center bg-[url(../public/images/login_bg.jpeg)] relative before:absolute before:inset-0 bg-blend-darken before:bg-[#00000083] before:z-10 bg-cover">
            <div className="absolute top-0 w-full flex justify-between p-10 z-20">
                <Image src={require('@/app/assets/images/logo.png')} width={275} height={55} alt="logo" className="w-[275px] h-[55px]" />
                <Link href="/register">
                    <button className="bg-[#C54702] text-white px-16 py-5 text-[16px] rounded-2xl">sign up</button>
                </Link>
            </div>
            <div className="mx-auto w-full max-w-md space-y-6 z-20">
                <p className="text-2xl text-center text-white">Login to your account</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 flex flex-col gap-3 mt-4'>
                        <div>
                            <Label className="mb-3 block text-white" htmlFor="email">Email</Label>
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
                            <Label className="mb-3 block text-white" htmlFor="password">Password</Label>
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
                            <div className="flex justify-between text-white my-2">
                                <div className="flex items-center gap-1 cursor-pointer">
                                    <Checkbox id='test' className="border-white" />
                                    <Label htmlFor="test" className="cursor-pointer">Remember me</Label>
                                </div>
                                <p className="cursor-pointer">Forgot passwrd?</p>
                            </div>
                        </div>

                        <Button
                            type='submit'
                            variant='outline'
                            className="w-full border-2 border-[#F97A35] bg-transparent text-white rounded-2xl"
                            disabled={isSubmitting || !isValid}
                        >
                            Log in
                        </Button>
                    </form >
                </Form>
                {/* <p className="text-center text-sm text-gray-500 dark:text-gray-400 ">
                    Don't have an account?{" "}
                    <Link href="/register" className="font-medium text-gray-900 hover:underline dark:text-gray-400" prefetch={false}>
                        Create an account
                    </Link>
                </p> */}
            </div>
        </div>
    )
}

export default page