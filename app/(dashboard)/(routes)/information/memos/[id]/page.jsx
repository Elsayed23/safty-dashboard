import React from 'react';
import Image from 'next/image';
import axios from 'axios';


const Page = async ({
    params: { id },
}) => {
    // Fetch memo data from the API
    const { data: memo } = await axios.get(`http://localhost:3000/api/memos/${id}`);

    if (!memo) {
        return <div className="p-6">Memo not found</div>;
    }

    return (
        <div className="p-6">
            {/* Banner Image */}
            {memo.banner && (
                <div className="w-full h-80 relative mb-6">
                    <Image
                        src={memo.banner}
                        alt="Memo Banner"
                        fill
                        className="object-fill rounded-lg"
                    />
                </div>
            )}

            {/* Memo Details */}
            <h1 className="text-2xl font-bold mb-4">{memo.title}</h1>
            <div className="text-sm text-gray-500 mb-4">
                Created by: {memo.user.name} - ({memo.user.email})
            </div>
            <div className="text-sm text-gray-500 mb-6">
                Created at: {new Date(memo.createdAt).toLocaleDateString()}
            </div>
            <div
                className="job_desciption max-w-none"
                dangerouslySetInnerHTML={{ __html: memo.content }}
            />
        </div>
    );
};

export default Page;