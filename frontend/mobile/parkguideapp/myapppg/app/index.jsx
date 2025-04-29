// app/index.jsx
import { useEffect } from 'react';
import { useRouter, useNavigationContainerRef } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (navigationRef.isReady()) {
        router.replace('/with-layout');
      }
    }, 0); // queue it after mount

    return () => clearTimeout(timeout);
  }, [navigationRef, router]);

  return null;
}
