'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from 'axios';

// Define the schema for the form inputs
const formSchema = z.object({
    name: z.string().min(1, 'You must add a Training Name field'),
    abbreviation: z.string().min(1, 'You have to add a abbreviation field.'),
    comments: z.string().optional()
});

// Define the interface for form values based on the schema
interface FormValues {
    name: string;
    abbreviation: string;
    comments: string;
}

const AddTraninings = ({ getTrainings }: { getTrainings: () => void }) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            abbreviation: "",
            comments: ""
        },
    });


    const onSubmit = async (values: FormValues) => {
        try {
            const { data } = await axios.post('/api/trainings', values)
            console.log(data);
            getTrainings()
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className='flex bg-[#FE5000] hover:bg-[#fe5000e1] items-center self-start gap-1'>Add training</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle >Add Training</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tranining Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="abbreviation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Abbreviation</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Abbreviation..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="comments"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comments</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Comments... (optional)" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogClose>
                            <Button type="submit">save</Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddTraninings;
