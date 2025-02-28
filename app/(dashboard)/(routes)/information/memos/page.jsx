"use client";
import Loading from "@/app/(dashboard)/_components/Loading";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";

const page = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get("/api/memos");
                setData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Loading />

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold">Memos and Statements</h1>
                <Button variant="outline">
                    <Link href="/information/memos/add" className="flex items-center gap-2">
                        Add Memos <FaPlus size={18} />
                    </Link>
                </Button>
            </div>

            {data.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map(({ id, banner, title, user: { name }, createdAt }) => (
                        <div key={id} onClick={() => router.push(`/information/memos/${id}`)} className="border cursor-pointer rounded-lg shadow-md bg-white">
                            {banner && (
                                <img
                                    src={banner}
                                    alt="Memo Banner"
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                            )}
                            <div className="p-4">
                                <h6 className="text-xs mb-2 text-slate-600">Added date: {new Date(createdAt).toLocaleDateString()}</h6>

                                <h3 className="text-lg font-semibold">{title}</h3>
                                <p className="text-gray-500 text-xs mt-1">By: {name || "Unknown"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No memos found.</p>
            )}
        </div>
    );
};

export default page;
