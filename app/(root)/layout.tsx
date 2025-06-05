import Image from "next/image";
import { getLoggedInUSer } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export default async function RootLayout({children,}:
    Readonly<{ children: React.ReactNode; }>) {
    const loggedIn = await getLoggedInUSer();

    if(!loggedIn) redirect('/sign-in')
    return ( 
        <main className="flex h-screen w-full font-inter">
            <Sidebar user={loggedIn} />

            <div className="flex size-full flex-col">
                <div className="root-layout">
                    <Image src="/icons/logo2.svg" width={50} height={50} alt="logo" />
                    <div>
                        <MobileNav user={loggedIn} />
                    </div>
                </div>
                {children}
            </div>
        </main>
    );
}
