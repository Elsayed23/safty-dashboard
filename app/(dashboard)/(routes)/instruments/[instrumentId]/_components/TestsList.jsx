import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FaCheck, FaXmark, FaImage } from 'react-icons/fa6';

const TestsList = ({ testsData }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const tests = testsData?.map(({ typeOfTestName, testEntriesChecks, createdAt }, idx) => {
        return (
            <Dialog key={idx}>
                <DialogTrigger asChild>
                    <li className="cursor-pointer underline underline-offset-1">{typeOfTestName}</li>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]" dir="rtl">
                    <DialogHeader>
                        <DialogTitle>Inspection result</DialogTitle>
                    </DialogHeader>
                    <ul className="flex flex-col gap-2 list-decimal px-4">
                        {testEntriesChecks?.map((check, idx) => {
                            return (
                                <li key={idx} className="flex items-center justify-between gap-3 border-t border-b px-1 py-2">
                                    <span>{check.testCheckName}</span>
                                    <div className="flex items-center gap-3">
                                        {String(check.check) === 'true' ? <FaCheck size={19} /> : <FaXmark size={20} />}
                                        {check.image && ( // Show image button if an image exists
                                            <button
                                                onClick={() => setSelectedImage(check.image)} // Set the selected image
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <FaImage size={20} />
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <DialogFooter className="sm:justify-start">
                        <p>Date created: {new Date(createdAt).toLocaleString('en-US')}</p>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    });

    return (
        <>
            <ul>{tests}</ul>

            {/* Image Modal */}
            {selectedImage && (
                <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Image Preview</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center">
                            <img
                                src={selectedImage}
                                alt="Inspection Image"
                                className="max-w-full h-auto rounded-lg"
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default TestsList;