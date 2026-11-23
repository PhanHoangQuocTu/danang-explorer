import type { PropsWithChildren } from 'react';

import { Footer } from './Footer';
import { Header } from './Header';

export const MainLayout = ({ children, showTravelRefresh }: PropsWithChildren<{ showTravelRefresh?: boolean }>) => (
  <div className='flex min-h-dvh flex-col'>
    <Header showTravelRefresh={showTravelRefresh} />
    <main className='mx-auto w-full max-w-5xl flex-1 px-4 py-8'>{children}</main>
    <Footer />
  </div>
);
