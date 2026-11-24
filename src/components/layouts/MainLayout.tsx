import type { PropsWithChildren } from 'react';

import { Footer } from './Footer';
import { Header } from './Header';

export const MainLayout = ({ children, showTravelRefresh }: PropsWithChildren<{ showTravelRefresh?: boolean }>) => (
  <div className='flex min-h-dvh flex-col'>
    <Header showTravelRefresh={showTravelRefresh} />
    <main
      id='main-content'
      tabIndex={-1}
      className='mx-auto w-full max-w-[1200px] min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-9 lg:px-8 lg:py-12'
    >
      {children}
    </main>
    <Footer />
  </div>
);
