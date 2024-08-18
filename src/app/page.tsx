'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit';
import { useWallet } from '../hooks/useWallet';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { isActive, account, connect, disconnect } = useWallet();
  const [verificationStatus, setVerificationStatus] = useState('');
  const [isWalletVerification, setIsWalletVerification] = useState(false);
  const [isWorldIDVerified, setIsWorldIDVerified] = useState(false);

  const handleVerify = async (proof: any) => {
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proof),
      });

      if (response.ok) {
        const { verified } = await response.json();
        return verified;
      } else {
        const { error } = await response.json();
        throw new Error(error);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred during verification');
      }
      return false;
    }
  };

  const onSuccess = async () => {
    console.log("World ID Verification successful");
    setIsWorldIDVerified(true);
    if (isWalletVerification) {
      setVerificationStatus('World ID verified. Connecting wallet...');
      await connectWallet();
    } else {
      router.push('./pollpage');
    }
  };

  const connectWallet = async () => {
    try {
      if (!isActive) {
        await connect();
      }
      
      if (!isActive || !account) {
        setVerificationStatus('Wallet connection failed. Please try again.');
        return;
      }

      setVerificationStatus('Wallet connected successfully');
      router.push('./pollpage');
    } catch (error) {
      console.error('Wallet connection error:', error);
      setVerificationStatus('Wallet connection failed. Please try again.');
    }
  };

  const handleWalletAndWorldIDVerify = () => {
    setIsWalletVerification(true);
    const worldIDWidget = document.getElementById('world-id-widget');
    if (worldIDWidget) {
      (worldIDWidget as any).click();
    } else {
      setVerificationStatus('World ID widget not found');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl bg-transparent shadow-lg rounded-lg overflow-hidden">
        <div className="w-1/2 bg-black p-12 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">World Poll</h1>
        </div>
        <div className="w-1/2 p-12 bg-white bg-opacity-70">
          <h2 className="text-3xl font-bold mb-4 text-center">Login or create account</h2>
          <p className="mb-8 text-gray-600 text-center">Connect and verify with World ID.</p>
          <IDKitWidget
            app_id="app_3c762ce1e3076d670a6ba49788c80c4a"
            action="trial-world-poll"
            onSuccess={onSuccess}
            handleVerify={handleVerify}
            verification_level={VerificationLevel.Device}
          >
            {({ open }) => (
              <button
                id="world-id-widget"
                className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition duration-200 mb-4"
                onClick={() => {
                  setIsWalletVerification(false);
                  open();
                }}
              >
                Verify with World ID
              </button>
            )}
          </IDKitWidget>
          <div className="text-center my-4 text-gray-500">OR</div>
          <button 
            className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition duration-200 mb-8"
            onClick={handleWalletAndWorldIDVerify}
          >
            Verify with World ID & Wallet
          </button>
          {isWorldIDVerified && isWalletVerification && !isActive && (
            <button 
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200 mb-8"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
          <a href="https://apps.apple.com/no/app/world-app-worldcoin-wallet/id1560859847" 
             className="block text-blue-500 hover:underline mb-8 text-center"
          >
            Get the WorldID App →
          </a>
          <p className="text-sm text-gray-500 text-center whitespace-nowrap">
            Sybil-resistant identity verification powered by World ID.
          </p>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          {verificationStatus && <p className="text-blue-500 mt-4 text-center">{verificationStatus}</p>}
          {isActive && <p className="text-green-500 mt-4 text-center">Wallet connected: {account}</p>}
        </div>
      </div>
    </div>
  );
}