import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const ShowData = ({ isValid, checksData }) => {

    const template = checksData?.map((check, idx) => {
        return (
            <li key={idx}>{check?.testCheckName}</li>
        )
    })

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="submit" disabled={!isValid}>Show inspection data</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" dir="rtl">
                <DialogHeader>
                    <DialogTitle>Inspection type template</DialogTitle>
                </DialogHeader>
                <ul className="flex flex-col gap-2 list-decimal px-4">
                    {template}
                </ul>
            </DialogContent>
        </Dialog>
    )
}

export default ShowData