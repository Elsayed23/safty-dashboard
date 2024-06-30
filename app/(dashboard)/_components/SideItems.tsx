'use client'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { IconType } from 'react-icons';



interface SidebarItemsProps {
  icon: IconType;
  isAvtiveIcon: IconType;
  label: string;
  href: string;

}

const SideItems = ({
  icon: Icon,
  isAvtiveIcon: AvtiveIcon,
  label,
  href
}: SidebarItemsProps) => {


  const pathname = usePathname()
  const router = useRouter()


  const isActive =
    (pathname === '/' && href === '/')
    ||
    pathname === href
    ||
    pathname?.startsWith(`${href}/`)

  const onClick = () => {
    router.push(href)
  }


  return (
    <button onClick={onClick} className={cn('flex relative w-full items-center gap-x-2 text-[#ec7831] pl-6 hover:text-[#fe5000ce] hover:bg-[#ec7831] hover:bg-opacity-10 duration-300', isActive && 'text-[#ec7831] bg-[#ec7831] bg-opacity-20 hover:bg-[#ec7831] hover:bg-opacity-20 hover:text-[#ec7831]')}>
      <div className={`flex items-center gap-2 ${isActive ? 'font-bold' : 'font-medium'} py-4`}>
        {
          isActive
            ?
            <AvtiveIcon size={23} className={cn('text-[#ec7831]', isActive && 'text-[#ec7831]')} />
            :
            <Icon size={23} className={cn('text-[#ec7831]', isActive && 'text-[#ec7831]')} />
        }
        {label}
      </div>
      <div className={cn('absolute right-0 h-full opacity-0 border-2 border-[#ec7831] transition-all', isActive && 'opacity-100 ')}></div>
    </button>
  )
}

export default SideItems