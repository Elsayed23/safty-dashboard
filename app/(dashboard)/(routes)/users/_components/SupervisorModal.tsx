'use client'
import * as React from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { boolean, z } from 'zod';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { toast } from "sonner";

// Define the schema for the form inputs
const formSchema = z.object({
    supervisor_id: z.string(),
    user_id: z.string(),
});

// Define the interface for form values based on the schema
interface FormValues {
    supervisor_id: string;
    user_id: string;
}
type SupervisorModalProps = {
    isOpen: boolean;
    onClose: () => void;
    user_id: string
    setIsSupervisorDone: any;
    supervisor_id: any
};
const Supervisor: React.FC<SupervisorModalProps> = ({ isOpen, onClose, user_id, supervisor_id, setIsSupervisorDone }) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            supervisor_id: '',
            user_id: '',
        },
    });

    const [supervisors, setSupervisors] = React.useState<any[] | null>(null)

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');

    const getSupervisors = async () => {
        try {
            const { data } = await axios.get('/api/users?isSupervisor=true')
            setSupervisors(data)
            console.log(data);

        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        if (supervisor_id) {
            setValue(supervisor_id)
        } else {
            setValue('')
        }
    }, [isOpen])

    React.useEffect(() => {
        getSupervisors()
    }, [])


    const onSubmit = async (values: FormValues) => {

        try {
            const dataSend = { ...values, user_id: user_id }

            const { data } = await axios.patch('/api/supervisor', dataSend)

            console.log(data);

            toast.success('done')
        } catch (error) {
            console.log(error);
        }


        setIsSupervisorDone((prev: boolean) => !prev)

    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Supervisor</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                >
                                    {value
                                        ? supervisors?.find((type: any) => type.id === value)?.name
                                        : "select supervisor..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput
                                        onChangeCapture={(e) => {
                                            console.log(e);
                                        }} placeholder="Search about supervisor..." />
                                    <CommandList>
                                        <CommandEmpty>No supervisors found.</CommandEmpty>
                                        <CommandGroup>
                                            {supervisors?.map((type: any) => (
                                                <CommandItem
                                                    key={type.id}
                                                    value={type.id}
                                                    className="text-black"
                                                    onSelect={(currentValue: any) => {
                                                        setValue(currentValue === value ? "" : currentValue);
                                                        form.setValue('supervisor_id', currentValue === value ? "" : currentValue);
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
                        <DialogClose asChild>
                            <Button type="submit">save</Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default Supervisor;
