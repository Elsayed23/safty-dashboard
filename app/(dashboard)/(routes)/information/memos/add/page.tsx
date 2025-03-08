'use client';
import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { Check, ChevronsUpDown } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Input
} from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useInstrument } from '@/app/context/InstrumentContext';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MdCloudUpload } from 'react-icons/md';
import RichTextEditor from '@/components/RichTextEditor';
import { useAuth } from '@/app/context/AuthContext';

const formSchema = z.object({
    title: z.string().min(2, {
        message: "The title should have at least 2 characters",
    }),
    banner: z.union([z.instanceof(File), z.string()]).optional(),
    content: z.string().optional(),
});



const Page = () => {
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            banner: undefined,
            content: '',
        }
    });

    const { user } = useAuth()


    const {
        handleSubmit,
        formState: { isSubmitting, isValid },
        setValue,
        reset,
        getValues,
    } = form;

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length) {
            setValue("banner", acceptedFiles[0]);
            setImagePreview(URL.createObjectURL(acceptedFiles[0]));
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".png", ".jpeg", ".webp", ".jpg"] },
        maxSize: 5000000,
    });

    const handleRemoveImage = () => {
        reset({ banner: undefined });
        setImagePreview(null);
    };

    const onSubmit = async ({
        banner,
        title,
        content
    }: z.infer<typeof formSchema>) => {
        console.log(banner,
            title,
            content);

        try {
            const formData = new FormData();

            formData.append("banner", banner as any);
            formData.append("title", title);
            formData.append("content", content as string);
            formData.append("userId", user.id)

            const { data } = await axios.post("/api/memos", formData);

            const { message } = data;

            toast.success(message);
            router.push("/information/memos");
        } catch (error) {
            console.error(error);
            toast.success("Field to create the post");
        }
    };

    return (
        <div className="p-6">
            <h1 className='mb-4 text-center text-4xl font-semibold'>Add new Memo</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                    {imagePreview ? (
                        <div className="mt-2 flex flex-col items-center">
                            <img
                                src={imagePreview}
                                alt="Banner Preview"
                                className="w-96 h-56 object-cover rounded-md shadow-lg"
                            />
                            <Button
                                variant="link"
                                type="button"
                                onClick={handleRemoveImage}
                                className="mt-2 text-blue-700"
                            >
                                Change Image
                            </Button>
                        </div>
                    ) : (
                        <FormField
                            control={form.control}
                            name="banner"
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="font-medium">Upload Banner</Label>
                                    <FormControl>
                                        <div
                                            {...getRootProps()}
                                            className={`border-2 cursor-pointer border-dashed px-4 py-12 rounded-md transition-all duration-300 ${isDragActive
                                                ? "border-blue-400 bg-gray-100"
                                                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                                                }`}
                                        >
                                            <input {...getInputProps()} />
                                            <div className="flex flex-col items-center">
                                                <MdCloudUpload className="text-3xl text-gray-500 mb-2" />
                                                <p className="text-gray-700">
                                                    {isDragActive
                                                        ? "Drop the files here ..."
                                                        : "Drag 'n' drop an image here, or click to select files"}
                                                </p>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}


                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <Label className="font-medium">Title</Label>
                                <FormControl>
                                    <Input {...field} placeholder="Enter the title" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <Label className="font-medium">Content</Label>
                                <FormControl>
                                    <RichTextEditor
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex justify-between items-center gap-2 my-4'>
                        <Button onClick={() => { router.push('/instruments') }} variant='destructive'>Cancel</Button>
                        <Button
                            type='submit'
                            disabled={isSubmitting || !isValid}
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Page;