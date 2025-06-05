"use client"
import React from 'react';
import {MobileNavProps} from "@/types";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image";
import Link from "next/link";
import {sidebarLinks} from "@/constants";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import { SheetClose } from "@/components/ui/sheet";
import Footer from './Footer';

function MobileNav({ user }: MobileNavProps) {
    const pathname = usePathname()
    return (
     <section className='w-full max-w-[264px]'>
         <Sheet>
          <SheetTrigger className='my-3'>
             <Image
               src='/icons/hamburger.svg'
               alt='menu'
               width={30}
               height={30}
             />
         </SheetTrigger>
           <SheetContent side="left" className='bg-white border-none'>
             <Link href='/' className='cursor-pointer flex items-center gap-1 px-4'>
                <Image
                   src='/icons/logo2.svg'
                   alt='logo'
                   width={58}
                   height={58}
               />
               <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>NewGen</h1>
             </Link>

              <div className='mobilenav-sheet'>
               <SheetClose asChild>
                 <nav className='pt-16 flex-col gap-6 text-white h-full'>
                     {sidebarLinks.map((item) => {
                         const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)
                      return (
                       <SheetClose asChild key={item.route}>
                          <Link href={item.route}
                                key={item.label}
                               className={cn('mobilenav-sheet_close w-full', {'bg-bank-gradient': isActive})}>
                            <Image
                               src={item.imgURL}
                               alt={item.label}
                               width={25}
                               height={25}
                               className={cn({'brightness-[3] invert-0': isActive})}
                            />
                            <p className={cn('text-16 font-semibold text-black-2', {'text-white': isActive})}>
                                  {item.label}
                            </p>
                          </Link>
                      </SheetClose>
                              )
                      })}

                                USER
                </nav>
               </SheetClose>

                     <Footer user={user} type='mobile' />
             </div>
           </SheetContent>
         </Sheet>

     </section>
    );
}

export default MobileNav;
