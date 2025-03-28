import React from 'react';
import HeaderBox from "@/components/ui/HeaderBox";
import TotalBalanceBox from "@/components/ui/TotalBalanceBox";
import RightSidebar from "@/components/ui/RightSidebar";
import { getLoggedInUSer } from '@/lib/actions/user.actions';

const Home = async () => {
    const loggedIn = await getLoggedInUSer();
    return (
        <section className='home'>
            <div className='home-content'>
                <header className='home-header'>
                    <HeaderBox
                     type='greeting'
                     title="Welcome"
                     user={loggedIn?.name || 'Guest'}
                     subtext='Access and manage your account and transactions efficiently.'
                    />
                    <TotalBalanceBox        
                     accounts={[]}
                     totalBanks={1}
                     totalCurrentBalance={1500.10}
                    />
                </header>

                RECENT TRANSACTIONS
            </div>

            <RightSidebar
             user={loggedIn}
             transactions={[]}
             banks={[{currentBalance: 1500}, {currentBalance: 1000.50}]}
            />
        </section>
    );
}

export default Home;
