'use client'
import {
    LogOut,
    User
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/app/context/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"

const ProfileDropdown = () => {

    const router = useRouter()

    const { logout, user } = useAuth()

    const signOut = () => {
        logout()
        router.push('/login')
    }

    return (
        <DropdownMenu>
            {
                user
                    ?
                    <DropdownMenuTrigger asChild>
                        <Image src={user?.user_photo} width={36} height={36} alt="profileImage" className="rounded-full w-9 h-9 cursor-pointer" />
                    </DropdownMenuTrigger>
                    :
                    <Skeleton className="w-9 h-9 rounded-full" />
            }
            <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => { router.push('/profile') }}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ProfileDropdown