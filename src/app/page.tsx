'use client';

import { CmsProvider } from '@/context/CmsProvider';
import App from '@/App';

export default function HomePage() {
  return (
    <CmsProvider>
      <App />
    </CmsProvider>
  );
}
