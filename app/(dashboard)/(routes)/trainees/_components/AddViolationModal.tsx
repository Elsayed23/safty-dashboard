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
    FormMessage
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
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useAuth } from "@/app/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Define the schema for the form inputs
const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    status: z.string().min(1, { message: "Status is required" }),
    images: z.array(z.instanceof(File)),
    approvals: z.array(z.object({
        user_id: z.string().min(1)
    }))
});

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
} as React.CSSProperties;

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
} as React.CSSProperties;

interface PreviewFile extends File {
    preview: string;
}

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
} as React.CSSProperties;

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
} as React.CSSProperties;

type AddViolationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    user_id: string;
};

const AddViolation: React.FC<AddViolationModalProps> = ({ isOpen, onClose, user_id }) => {
    const router = useRouter();
    const { user } = useAuth();
    const [files, setFiles] = useState<PreviewFile[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            status: 'red',
            images: [],
            approvals: [{ user_id: user?.id || '' }]
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onDrop = (acceptedFiles: File[]) => {
        const previewFiles = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        setFiles(previewFiles);
        form.setValue('images', acceptedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpeg', '.webp', '.jpg'] }
    });

    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <img
                    src={file.preview}
                    style={img}
                    onLoad={() => { URL.revokeObjectURL(file.preview) }}
                />
            </div>
        </div>
    ));

    useEffect(() => {
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description || '');
        formData.append('status', values.status);
        formData.append('user_id', user_id);
        values.images.forEach((file) => {
            formData.append('images', file);
        });
        values.approvals.forEach((approval) => {
            formData.append('approvals', approval.user_id);
        });

        try {
            const { data } = await axios.post('/api/violations', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("Violation created successfully:", data);
            onClose(); // Close the modal
            router.push('/violations'); // Redirect to the violations page

        } catch (error) {
            console.error("Error creating violation:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Violation</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Violation Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Description..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Status..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Images</FormLabel>
                                    <FormControl>
                                        <div {...getRootProps({ className: 'dropzone' })} className="border-dashed border-2 p-4 text-center cursor-pointer">
                                            <input {...getInputProps()} />
                                            <p>Drag 'n' drop some files here, or click to select files</p>
                                            <aside style={thumbsContainer}>
                                                {thumbs}
                                            </aside>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting || !isValid}>Save</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddViolation;
