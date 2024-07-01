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
import toast from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useInstrument } from '@/app/context/InstrumentContext';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
    name: z.string().min(1, {
        message: "name is required"
    }),
    typeId: z.string().min(1),
    place: z.string().min(1),
    customInstrumentId: z.string().min(1)
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

const Page = ({ searchParams: { instrument_type_id } }: { searchParams: { instrument_type_id: string } }) => {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [files, setFiles] = useState<PreviewFile[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            typeId: instrument_type_id,
            place: '',
            customInstrumentId: ''
        }
    });

    const { typesData, getInstrumentTypes, handleCreateInstrument } = useInstrument();

    const typeName = typesData?.filter((type: any) => {
        return type.id === instrument_type_id;
    })[0]?.name;

    const { isSubmitting, isValid } = form.formState;

    useEffect(() => {
        getInstrumentTypes();
    }, []);

    const onDrop = (acceptedFiles: File[]) => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
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
        formData.append('typeId', values.typeId);
        formData.append('place', values.place);
        formData.append('customInstrumentId', values.customInstrumentId);
        files.forEach((file) => {
            formData.append('images', file);
        });

        try {
            const { data } = await axios.post('/api/instruments', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            router.push('/instruments');


        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <div className='mb-6 border bg-slate-100 rounded-md p-4 max-w-lg w-full mx-auto'>
                <div className='font-medium text-sm mb-4 flex items-center justify-between'>
                    Instrument type
                </div>

                {
                    typeName === undefined
                        ?
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                >
                                    {value
                                        ? typesData.find((type: any) => type.id === value)?.name
                                        : "select type..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput
                                        onChangeCapture={(e) => {
                                            console.log(e);
                                        }} placeholder="Search about instrument type..." />
                                    <CommandList>
                                        <CommandEmpty>No instruments found.</CommandEmpty>
                                        <CommandGroup>
                                            {typesData.map((type: any) => (
                                                <CommandItem
                                                    key={type.id}
                                                    value={type.id}
                                                    onSelect={(currentValue) => {
                                                        setValue(currentValue === value ? "" : currentValue);
                                                        form.setValue('typeId', currentValue === value ? "" : currentValue);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            value === type.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {type.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        :
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    disabled
                                    className="w-[260px] justify-between"
                                >
                                    {typeName}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                        </Popover>
                }

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <Label className='mb-4' htmlFor='name'>Instrument name</Label>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            className='mb-5'
                                            id='name'
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'جرااااااف'"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Label className='mb-4' htmlFor='customInstrumentId'>Instrument ID</Label>
                        <FormField
                            control={form.control}
                            name='customInstrumentId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            className='mb-5'
                                            id='customInstrumentId'
                                            disabled={isSubmitting}
                                            placeholder="Instrument id..."
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Label className='mb-4' htmlFor='place'>Place</Label>
                        <FormField
                            control={form.control}
                            name='place'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            className='mb-5'
                                            id='place'
                                            disabled={isSubmitting}
                                            placeholder="place..."
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Label className='mb-4' htmlFor='image'>Images</Label>

                        <div {...getRootProps({ className: 'dropzone' })} className="border-dashed border-2 p-4 text-center cursor-pointer">
                            <input id='image' {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                            <aside style={thumbsContainer}>
                                {thumbs}
                            </aside>
                        </div>

                        <div className='flex justify-between items-center gap-2 mt-4'>
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
        </div>
    );
};

export default Page;
