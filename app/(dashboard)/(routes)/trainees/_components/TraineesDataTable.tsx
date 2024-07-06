"use client"

import * as React from "react"
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
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axios from "axios"
import Loading from "../../../_components/Loading"
import AddTrainingModal from "./AddTrainingModal"
import AddViolationModal from './AddViolationModal'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/app/context/AuthContext"

export type Violation = {
    id: string
    user_id: string
    name: string
    description: string
    status: string
}

export type Training = {
    id: string
    name: string
    job_title: { title: string }
    work_id: string
    violations: Violation[]
}



const TraineesDataTable = ({ jobTitleId }: { jobTitleId: string }) => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    const { user } = useAuth()

    const [addTrainingModal, setAddTrainingModal] = React.useState({
        status: false,
        user_id: ''
    })

    const onCloseTraining = () => {
        setAddTrainingModal(prevData => {
            return {
                ...prevData,
                status: false
            }
        })
    }

    const [addViolationModal, setAddViolationModal] = React.useState({
        status: false,
        user_id: ''
    })

    const onCloseViolation = () => {
        setAddViolationModal(prevData => {
            return {
                ...prevData,
                status: false
            }
        })
    }

    const columns: ColumnDef<Training>[] = [
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
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("work_id")}</div>,
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <div>{row.getValue("name")}</div>,
        },
        {
            accessorKey: "job_title",
            header: () => <div className="text-right">Job title</div>,
            cell: ({ row }) => {
                const jobTitle = row.getValue('job_title') as { title: string }
                return <div className="text-right">{jobTitle?.title}</div>
            },
        },
        {
            accessorKey: "violations",
            header: () => <div className="text-right">Violations</div>,
            cell: ({ row }) => {
                const violations = row.getValue('violations') as Violation[]
                return (
                    <div className="text-right flex items-center justify-end gap-2">
                        {
                            violations.map((_, idx) => {
                                return (
                                    <TooltipProvider key={idx} delayDuration={200}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className={`w-3 h-3 rounded-full cursor-default bg-red-800`}></div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Not approved yet</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )
                            })
                        }

                    </div>
                )
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const training = row.original

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
                                onClick={() => navigator.clipboard.writeText(training.work_id)}
                            >
                                Copy trainee Id
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {
                                user?.role.name === 'Instructor' || user?.role.name === 'Admin'
                                &&
                                <DropdownMenuItem onClick={() => setAddTrainingModal({ status: true, user_id: training.id })}>
                                    Add training
                                </DropdownMenuItem>
                            }


                            <DropdownMenuItem onClick={() => setAddViolationModal({ status: true, user_id: training.id })}>
                                Add violation
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const [data, setData] = React.useState<Training[]>([])
    const [loading, setLoading] = React.useState(true)

    const getTrainings = async () => {
        try {
            const { data } = await axios.get(`/api/users/${jobTitleId}`)
            setData(data)
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        getTrainings()
    }, [jobTitleId])

    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

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
    })

    if (loading) {
        return <Loading isFull={false} />
    }

    return (
        <div className="w-full p-6" dir="ltr">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter trainees by id..."
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
                                )
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
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
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
            <AddViolationModal isOpen={addViolationModal.status} user_id={addViolationModal.user_id} onClose={onCloseViolation} />
            <AddTrainingModal isOpen={addTrainingModal.status} user_id={addTrainingModal.user_id} onClose={onCloseTraining} />
        </div>
    )
}

export default TraineesDataTable
