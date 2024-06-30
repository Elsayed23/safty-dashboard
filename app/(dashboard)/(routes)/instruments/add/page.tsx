'use client'
import React, { useEffect, useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Check, ChevronsUpDown } from "lucide-react"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from '@/components/ui/form'
import {
    Input
} from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Pencil } from 'lucide-react'
import toast from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTests } from '@/app/context/TestContext'
import { useInstrument } from '@/app/context/InstrumentContext'
import { Label } from '@/components/ui/label'

interface TypeData {
    id: string;
    name: string;
    place: string
    customInstrumentId: string
}


const formSchema = z.object({
    name: z.string().min(1, {
        message: "name is required"
    }),
    typeId: z.string().min(1),
    place: z.string().min(1),
    customInstrumentId: z.string().min(1)
})

const Page = ({ searchParams: { instrument_type_id } }: { searchParams: { instrument_type_id: string } }) => {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            typeId: instrument_type_id,
            place: '',
            customInstrumentId: ''
        }
    })

    const { typesData, getInstrumentTypes } = useInstrument()

    const typeName = typesData?.filter((type: any) => {
        return type.id === instrument_type_id
    })[0]?.name

    console.log(instrument_type_id);


    const { handleCreateInstrument } = useTests()
    const { isSubmitting, isValid } = form.formState


    useEffect(() => {
        getInstrumentTypes()
    }, [])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);

    }

    return (
        <div className="flex justify-center items-center  h-[calc(100vh-80px)]">
            <div className='mb-6 border bg-slate-100 rounded-md p-4 max-w-lg w-full mx-auto'>
                <div className='font-medium mb-4 flex items-center justify-between'>
                    Instrument type
                </div>

                {
                    instrument_type_id === undefined
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
                                            console.log(e)
                                        }} placeholder="Search about instrument type..." />
                                    <CommandList>
                                        <CommandEmpty>No instruments found.</CommandEmpty>
                                        <CommandGroup>
                                            {typesData.map((type: any) => (
                                                <CommandItem
                                                    key={type.id}
                                                    value={type.id}
                                                    onSelect={(currentValue) => {
                                                        setValue(currentValue === value ? "" : currentValue)
                                                        form.setValue('typeId', currentValue === value ? "" : currentValue)
                                                        setOpen(false)
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

                        <div className='flex justify-between items-center gap-2'>
                            <Button onClick={() => { router.push('/instruments') }} variant='destructive'>Cancel</Button>
                            <Button
                                type='submit'
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Page
