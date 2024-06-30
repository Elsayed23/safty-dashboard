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
import { Input } from '@/components/ui/input'
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
import { useInstrument } from '@/app/context/InstrumentContext'


const formSchema = z.object({
    typeId: z.string().min(1)
})

const Page = () => {

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            typeId: value
        }
    })


    const { typesData, getInstrumentTypes, setInstrumentType } = useInstrument()


    useEffect(() => {
        getInstrumentTypes()
    }, [])


    return (
        <div className="px-3">
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
                        <CommandInput onChangeCapture={(e) => {
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
                                            setInstrumentType(currentValue === value ? "" : currentValue)
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
        </div>
    )
}

export default Page
