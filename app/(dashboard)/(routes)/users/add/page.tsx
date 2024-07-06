'use client';
import { Input } from "@/components/ui/input";
import Link from "next/link";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    work_id: z.string().min(1),
    password: z.string().min(4, { message: "Password must be at least 4 characters." }),
    address: z.string().min(1, { message: "Address is required." }),
    telephone: z.string().min(1, { message: "Telephone is required." }),
    job_title_id: z.string(),
    user_photo: z.any(), // No validation
});

const page = () => {
    const { register: registerUser } = useAuth();
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [job_titles, setJob_titles] = useState<any[] | null>(null)

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    const getJobTitles = async () => {
        const { data } = await axios.get('/api/job_title')
        setJob_titles(data)

    }

    useEffect(() => {
        getJobTitles()
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            work_id: '',
            password: '',
            address: '',
            telephone: '',
            job_title_id: '',
            user_photo: undefined,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('work_id', values.work_id);
            formData.append('password', values.password);
            formData.append('address', values.address);
            formData.append('job_title_id', values.job_title_id);
            formData.append('telephone', values.telephone);
            if (file) {
                formData.append('user_photo', file);
            }

            const { data } = await axios.post('/api/auth/register?approved=true', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const { status, token, message } = data;

            if (status === 200) {
                router.push('/users')
                toast.success('Successfully added user')
            } else {
                toast.info(message);
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] px-4 items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="mx-auto w-full container space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                <h1 className="text-3xl text-center dark:text-gray-400">Add user</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 flex flex-col gap-7 mx-auto">
                        <div className="grid grid-cols-3 gap-5">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="work_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ID..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User email</FormLabel>
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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User password</FormLabel>
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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User address</FormLabel>
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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User telephone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Telephone" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-2">
                                <Label>Job Title</Label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className="w-full justify-between"
                                        >
                                            {value
                                                ? job_titles?.find((type: any) => type.id === value)?.title
                                                : "select job title..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput
                                                onChangeCapture={(e) => {
                                                    console.log(e);
                                                }} placeholder="Search about job title..." />
                                            <CommandList>
                                                <CommandEmpty>No job titles found.</CommandEmpty>
                                                <CommandGroup>
                                                    {job_titles?.map((type: any) => (
                                                        <CommandItem
                                                            key={type.id}
                                                            value={type.id}
                                                            onSelect={(currentValue) => {
                                                                setValue(currentValue === value ? "" : currentValue);
                                                                form.setValue('job_title_id', currentValue === value ? "" : currentValue);
                                                                setOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    value === type.id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {type.title}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <FormField
                                control={form.control}
                                name="user_photo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User photo</FormLabel>
                                        <FormControl>
                                            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" disabled={isSubmitting || !isValid}>Add</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default page;
