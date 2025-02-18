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
import { ArrowUpDown, ChevronDown, CirclePlus, MoreHorizontal } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
import Loading from "../../../_components/Loading"
import { useInstrument } from "@/app/context/InstrumentContext"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios";

export type Activity = {
    id: string
    name: string
    createdAt: string
}

export const columns: ColumnDef<Activity>[] = [
    {
        accessorKey: "num",
        header: "Num",
        cell: ({ row, table }) => {
            const filteredRows = table.getFilteredRowModel().rows;
            const rowIndex = filteredRows.findIndex((filteredRow) => filteredRow.id === row.id);
            return <div>{rowIndex + 1}</div>;
        },
    },
    {
        accessorKey: "name",
        header: () => <div className="text-center">Activity name</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "id",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            const idx = row.index;

            const statusInfo = [
                { color: "bg-red-500", text: "طالع عنيهاا" },
                { color: "bg-yellow-500", text: "عليها ملاحظه" },
                { color: "bg-green-500", text: "فل الفل" },
            ];

            const { color, text } = statusInfo[idx % statusInfo.length];

            return (
                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className={`mx-auto w-5 h-5 rounded-full ${color}`}></div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>{text}</span>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },

    {
        accessorKey: "createdAt",
        header: () => <div className="text-right">Added date</div>,
        cell: ({ row }) => <div className="text-right">{new Date(row.getValue("createdAt")).toLocaleDateString('en-US')}</div>,
    },
    // {
    //     id: "actions",
    //     enableHiding: false,
    //     cell: ({ row }) => {
    //         const activity = row.original
    //         const router = useRouter()

    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal className="h-4 w-4" />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                     <DropdownMenuItem
    //                         onClick={() => navigator.clipboard.writeText(activity.name)}
    //                     >
    //                         Copy activity name
    //                     </DropdownMenuItem>
    //                     <DropdownMenuSeparator />
    //                     <DropdownMenuItem onClick={() => router.push(`/instruments/${activity.id}`)}>View details</DropdownMenuItem>
    //                     <DropdownMenuItem>Edit instrument</DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         )
    //     },
    // },
]

const Page = ({ params: { placeId } }: { params: { placeId: string } }) => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    const searchParams = useSearchParams()
    const placeName = searchParams.get('name')

    const [loading, setLoading] = React.useState(true)

    const [data, setData] = React.useState<Activity[]>([])


    const fetchPlaceActivities = async () => {
        try {

            const { data } = await axios.get(`/api/places/${placeId}/activity`)
            setData(data)

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const router = useRouter()


    React.useEffect(() => {
        fetchPlaceActivities()
    }, [])


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
            <h2 className="text-center text-2xl font-semibold">{placeName}</h2>
            <Button variant='default' onClick={() => router.push(`/place/${placeId}/activity/add?place_name=${placeName}`)} className='flex bg-[#FE5000] hover:bg-[#fe5000e1] items-center self-start gap-1'>
                Add activity <CirclePlus size={18} />
            </Button>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter activity names..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
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
                            table.getRowModel().rows.map((row: any) => (
                                <TableRow
                                    onClick={() => router.push(`/place/${placeId}/activity/${row.original?.id}`)}
                                    key={row.id}
                                    className="cursor-pointer"
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell: any) => (
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
        </div>
    )
}

export default Page
