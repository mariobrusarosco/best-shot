import { ReactNode, useEffect, useState } from 'react';
import { LDProvider, createLDUser } from '@/utils/featureFlags';

interface LaunchDarklyProviderProps {
  children: ReactNode;
}

/**
 * LaunchDarkly Provider Component
 * 
 * This component wraps your application and initializes the LaunchDarkly client.
 * It sets up an anonymous user initially - the actual user identification
 * is handled by the LaunchDarklyUserIdentifier component.
 */
export const LaunchDarklyProvider = ({ 
  children
}: LaunchDarklyProviderProps) => {
  const [ldClientId, setLdClientId] = useState<string>('');

  useEffect(() => {
    // Get the client-side SDK key from environment variables
    const clientKey = import.meta.env.VITE_LAUNCHDARKLY_CLIENT_KEY;
    setLdClientId(clientKey || '');
    
    if (!clientKey) {
      console.warn('LaunchDarkly client key not found in environment variables');
    }
  }, []);

  // Create an initial anonymous user context
  // The real user identity will be set by LaunchDarklyUserIdentifier
  const initialUser = createLDUser();

  // Don't render anything if the client ID isn't available yet
  if (!ldClientId) {
    return <>{children}</>;
  }

  // Configure LaunchDarkly
  const ldConfig = {
    clientSideID: ldClientId,
    user: initialUser,
    options: {
      bootstrap: 'localStorage' as const,
      streaming: true
    }
  };

  return (
    <LDProvider {...ldConfig}>
      {children}
    </LDProvider>
  );
}; 