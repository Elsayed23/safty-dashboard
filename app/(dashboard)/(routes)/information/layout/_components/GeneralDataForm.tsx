'use client'
import * as React from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import axios from "axios";
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

// Define the schema for the form inputs
const formSchema = z.object({
    name: z.string().min(1, { message: 'The field must have at least 1 character' }).optional(),
    supervisorId: z.string().optional(),
    siteManagerId: z.string().optional(),
});

// Define the interface for form values based on the schema
interface FormValues {
    name?: string;
    supervisorId?: string;
    siteManagerId?: string;
}

const GeneralDataForm = ({ data, field, onClose, onRefresh }: any) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: data || { name: '', supervisorId: '', siteManagerId: '' },
    });

    const [supervisors, setSupervisors] = React.useState<any[] | null>(null);
    const [siteManagers, setSiteManagers] = React.useState<any[] | null>(null);

    const [openSupervisor, setOpenSupervisor] = React.useState(false);
    const [openSiteManager, setOpenSiteManager] = React.useState(false);

    const getSupervisors = async () => {
        try {
            const { data } = await axios.get('/api/users?isSupervisor=true');
            setSupervisors(data);
        } catch (error) {
            console.log(error);
        }
    };

    const getUsers = async () => {
        try {
            const { data } = await axios.get('/api/users?isSiteManager=true');
            setSiteManagers(data);
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        getSupervisors();
        getUsers();
    }, []);

    const onSubmit = async (values: FormValues) => {
        try {
            if (data.id) {
                await axios.patch('/api/general_data', { id: data.id, ...values });
            } else {
                await axios.post('/api/general_data', values);
            }
            onRefresh();
            onClose();
        } catch (error) {
            console.error('Error saving general data:', error);
        }
    };

    return (
        <div className="mb-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {(field === 'name' || field === 'all') && (
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    {(field === 'supervisorId' || field === 'all') && (
                        <div className="space-y-2">
                            <FormLabel>Supervisor</FormLabel>
                            <Popover open={openSupervisor} onOpenChange={setOpenSupervisor}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openSupervisor}
                                        className="w-full justify-between"
                                    >
                                        {form.getValues('supervisorId')
                                            ? supervisors?.find((type: any) => type.id === form.getValues('supervisorId'))?.name
                                            : "select supervisor..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0 relative z-[99999999999]">
                                    <Command>
                                        <CommandInput placeholder="Search about supervisor..." />
                                        <CommandList>
                                            <CommandEmpty>No supervisors found.</CommandEmpty>
                                            <CommandGroup>
                                                {supervisors?.map((type: any) => (
                                                    <CommandItem
                                                        key={type.id}
                                                        value={type.id}
                                                        className="text-black"
                                                        onSelect={(currentValue: any) => {
                                                            form.setValue('supervisorId', currentValue);
                                                            setOpenSupervisor(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                form.getValues('supervisorId') === type.id ? "opacity-100" : "opacity-0"
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
                    )}
                    {(field === 'siteManagerId' || field === 'all') && (
                        <div className="space-y-2 relative z-50">
                            <FormLabel>Site manager</FormLabel>
                            <Popover open={openSiteManager} onOpenChange={setOpenSiteManager}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openSiteManager}
                                        className="w-full justify-between"
                                    >
                                        {form.getValues('siteManagerId')
                                            ? siteManagers?.find((type: any) => type.id === form.getValues('siteManagerId'))?.name
                                            : "select site manager..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0 relative z-[99999999999]">
                                    <Command>
                                        <CommandInput placeholder="Search about site manager..." />
                                        <CommandList>
                                            <CommandEmpty>No managers found.</CommandEmpty>
                                            <CommandGroup>
                                                {siteManagers?.map((type: any) => (
                                                    <CommandItem
                                                        key={type.id}
                                                        value={type.id}
                                                        className="text-black"
                                                        onSelect={(currentValue: any) => {
                                                            form.setValue('siteManagerId', currentValue);
                                                            setOpenSiteManager(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                form.getValues('siteManagerId') === type.id ? "opacity-100" : "opacity-0"
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
                    )}
                    <Button type="submit" className="self-end">Save</Button>
                </form>
            </Form>
        </div>
    );
};

export default GeneralDataForm;
