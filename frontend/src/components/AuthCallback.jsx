import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const { handleOAuthCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { provider } = useParams(); // 'google' or 'github'
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleAuth = async () => {
      try {
        // Check for OAuth callback (code in query params)
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        
        if (code && provider) {
          // OAuth callback from Google or GitHub
          await handleOAuthCallback(provider, code);
          navigate('/dashboard', { replace: true });
          return;
        }

        // No valid auth data found
        console.error('No valid auth data found');
        navigate('/signin', { replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/signin', { replace: true });
      }
    };

    handleAuth();
  }, [location.search, navigate, provider, handleOAuthCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background" data-testid="auth-callback">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-500 mx-auto mb-4" />
        <p className="text-muted-foreground">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
