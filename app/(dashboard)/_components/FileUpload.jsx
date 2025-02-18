'use client';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export const FileUpload = ({ acceptedFileTypes, onFileUpload }) => {
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setIsUploading(true);
            try {
                await onFileUpload(acceptedFiles[0]);
            } catch (error) {
                console.error(error);
            }
            setIsUploading(false);
        }
    }, [onFileUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedFileTypes?.reduce((acc, ext) => ({
            ...acc,
            [ext === '.docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/msword']: []
        }), {}),
        multiple: false
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-4 cursor-pointer 
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        >
            <input {...getInputProps()} />
            <div className="text-center">
                {isUploading ? (
                    <p>Uploading...</p>
                ) : (
                    <>
                        <p className="text-sm">
                            {isDragActive ?
                                'Drop the file here' :
                                'Drag & drop a Word file, or click to select'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Accepted formats: {acceptedFileTypes?.join(', ')}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};