import { logoutAccount } from '@/lib/actions/user.actions'
import { FooterProps } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = ({ user, type = 'desktop' }: FooterProps) => {

  const router = useRouter();

  const handleLogOut = async () => {
    const loggedOut = await logoutAccount();

    if(loggedOut) router.push('/sign-in')
  }

  return (
   <footer className='footer'>
    <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
      <p className='text-gray-600 text-xl font-bold'>
        {user.name[0]}
      </p>
    </div>

    <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
      <h1 className='text-14 truncate text-gray-500 font-semibold'>{user.name}</h1>
      <p className='text-14 truncate font-normal text-blue-500'>{user.email }</p> 
    </div>

    <div className='footer_image' onClick={handleLogOut}>
      <Image src="icons/logout.svg" alt='logout' fill />
    </div>
   </footer>
  )
}

export default Footer
