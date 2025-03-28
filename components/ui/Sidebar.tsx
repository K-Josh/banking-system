"use client"
import React from 'react';
import {SidebarProps} from "@/types";
import Link from "next/link";
import Image from "next/image";
import {sidebarLinks} from "@/constants";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import Footer from './Footer';

function Sidebar({user}: SidebarProps) {
    // we wanna change a link depending on it's active state
    const pathname = usePathname();
    return (
        <section className='sidebar'>
          <nav className='flex flex-col gap-4'>
            <Link href='/' className='mb-10 flex cursor-pointer items-center gap-2'>
                <Image
                 src="/icons/logo2.svg"
                 alt='NextGen'
                 width={34}
                 height={34}
                 className='size-[3rem] max-xl:size-[3rem]'
                />
                <h1 className='sidebar-logo'>NewGen</h1>
            </Link>

              {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)
                  return (
                      <Link href={item.route} key={item.label} className={cn('sidebar-link', {'bg-bank-gradient': isActive})}>
                          <div className='relative size-6'>
                              <Image
                                  src={item.imgURL}
                                  alt={item.label}
                                  fill
                                className={cn({'brightness-[3] invert-0': isActive})}
                              />
                          </div>
                          <p className={cn('sidebar-label', {'!text-white': isActive})}>
                              {item.label}
                          </p>
                      </Link>
                  )
              })}
              USER
          </nav>

            <Footer user={user} />
        </section>
    );
}

export default Sidebar;
