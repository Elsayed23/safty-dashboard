'use client';

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import axios from "axios";
import Loading from "../../../_components/Loading";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ModifyRole from "./ModifyRoleModal";

export type User = {
    id: string;
    name: string;
    job_title: { title: string };
    role: { name: string };
    work_id: string;
    roleId: string
    approved: any
}

const UsersDataTable = () => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );

    const [isOpen, setIsOpen] = React.useState(false)
    const [user_id, setUser_id] = React.useState('')
    const [role_id, setRole_id] = React.useState('')
    const [isRoleModifiedDone, setIsRoleModifiedDone] = React.useState(false)
    const [isApproved, setIsApproved] = React.useState(false)

    const handleModifyRole = (user_id: string, role_id: string) => {
        setIsOpen(true)
        setUser_id(user_id)
        setRole_id(role_id)
    }

    const router = useRouter()

    const handleApproved = async (user_id: string) => {
        try {
            await axios.patch('/api/approve', { user_id })
            toast.success('Approved successfully')
            setIsApproved(prev => !prev)
        } catch (error) {
            console.log(error);

        }
    }

    const columns: ColumnDef<User>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "work_id",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("work_id")}</div>,

        },
        {
            accessorKey: "name",
            header: "User name",
            cell: ({ row }) => <div>{row.getValue("name")}</div>,

        },
        {
            accessorKey: "job_title",
            header: "job_title",
            cell: ({ row }) => {
                const jobTitle = row.getValue('job_title') as { title: string }
                return <div>{jobTitle?.title}</div>
            },
        },
        {
            accessorKey: "role",
            header: "role",
            cell: ({ row }) => {
                const role = row.getValue('role') as { name: string }
                return <div>{role?.name}</div>
            },
        },
        {
            accessorKey: "approved",
            header: "Approved",
            cell: ({ row }) => <div>{row.getValue("approved") === true ? 'Yes' : 'No'}</div>,

        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(user.work_id)}
                            >
                                Copy User ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => { router.push(`/profile/${user.id}`) }}
                            >
                                User profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => { handleApproved(user.id) }}
                            >
                                Approved
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => { handleModifyRole(user.id, user.roleId) }}
                            >
                                Modify Role
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const [data, setData] = React.useState<User[]>([]);
    const [loading, setLoading] = React.useState(true);

    const getUsers = async () => {
        const { data } = await axios.get('/api/users')
        setData(data)
        setLoading(false)
    }

    React.useEffect(() => {
        getUsers()
    }, [isRoleModifiedDone, isApproved])


    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    if (loading) {
        return <Loading isFull={false} />;
    }

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter users by ID..."
                    value={(table.getColumn("work_id")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("work_id")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    // onClick={() => router.push(`/violations/${row.original.id}`)}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
            <ModifyRole isOpen={isOpen} user_id={user_id} setIsRoleModifiedDone={setIsRoleModifiedDone} role_id={role_id} onClose={() => setIsOpen(false)} />
        </div>
    );
};

export default UsersDataTable;
