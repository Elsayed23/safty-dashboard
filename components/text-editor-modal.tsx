import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (value: string) => void;
    title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title }) => {
    const [inputValue, setInputValue] = React.useState("");

    const handleSubmit = () => {
        onConfirm(inputValue);
        setInputValue(""); // Clear input field after submission
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Please enter the URL below.
                    </DialogDescription>
                </DialogHeader>


                <div className="flex items-center gap-2">
                    <Label htmlFor="url">
                        URL
                    </Label>
                    <Input
                        id="url"
                        type="text"
                        placeholder="Enter URL..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="col-span-3"
                    />
                </div>


                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="button" className="ml-2" onClick={handleSubmit}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default Modal;