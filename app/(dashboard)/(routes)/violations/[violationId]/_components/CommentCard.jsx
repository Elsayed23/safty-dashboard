import Image from 'next/image';
import React from 'react';

const CommentCard = ({
    user,
    comment
}) => {
    return (
        <li className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-start">
                <Image
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full mr-4"
                    src={user.user_photo || ''}
                    alt={`${user.name}'s profile`}
                />
                <div>
                    <p className="text-sm text-gray-500">
                        {user.name} ({user.email})
                    </p>
                    <p className="text-gray-800">{comment}</p>
                </div>
            </div>
        </li>
    );
};

export default CommentCard;
