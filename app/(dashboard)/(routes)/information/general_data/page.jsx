"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import DataBox from "./_components/DataBox"
import DataRow from "./_components/DataRow"

const chartData = [
    { month: "January", rate: 3 },
    { month: "February", rate: 9 },
    { month: "March", rate: 7 },
    { month: "April", rate: 5 },
    { month: "May", rate: 8 },
    { month: "June", rate: 11 },
]

const chartConfig = {
    rate: {
        label: "Accident Rate",
        color: "hsl(var(--chart-1))",
    },
}

const dataRows = [
    { icon: "/images/employees_icon.png", title: "Employees", content: "+20K" },
    { icon: "/images/hours_rate_icon.png", title: "Security Hours Working", content: "+16K" },
    { icon: "/images/injuries_icon.png", title: "Injuries This Month", content: "+12" },
    { icon: "/images/accident_rate_icon.png", title: "Accident Rate In Month", content: "30%" },
]

export default function Page() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold py-2 border-l-4 pl-3 border-[#F75902] mb-5">General Data</h1>

            <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                    <DataBox title="Project Name" content="Sindalah" />
                    <DataBox title="Project Manager" content="Hossam Nagozt" />
                    <DataBox title="Project Progress" />
                    <DataBox title="Safety Manager" content="Mark" />
                </div>

                <div className="my-5 grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-white rounded-lg p-4">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold">Accident Monthly Rate</h2>
                            <p className="text-gray-500">Displayed the number of personal injuries in the last 6 months.</p>
                        </div>
                        <div className="shadow-md p-4 rounded-lg">
                            <ChartContainer config={chartConfig}>
                                <LineChart className="w-full h-full" data={chartData} margin={{ left: 12, right: 12 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <YAxis />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Line
                                        dataKey="rate"
                                        type="linear"
                                        stroke="var(--color-rate)"
                                        strokeWidth={2}
                                        dot={{ r: 6, fill: "white", stroke: "var(--color-rate)", strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </div>
                        <div className="mt-4 text-sm">
                            <p className="flex gap-2 mb-1 font-medium leading-none">
                                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                            </p>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold border-l-4 py-2 pl-3 border-[#F75902] mb-4">Details</h1>
                        <div className="flex flex-col gap-4">{dataRows.map((row, idx) => <DataRow key={idx} {...row} />)}</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <DataBox title='Client Name' content='Neom' />
                    <DataBox title='Consult' content='Aecom' />
                </div>
            </div>
        </div>
    )
}
