'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

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

  const onSuccess = () => {
    console.log("Verification successful");
    router.push('./pollpage');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl bg-transparent shadow-lg rounded-lg overflow-hidden">
        <div className="w-1/2 bg-black p-12 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">World</h1>
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
                className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition duration-200 mb-4"
                onClick={open}
              >
                Verify with World ID
              </button>
            )}
          </IDKitWidget>
          <div className="text-center my-4 text-gray-500">OR</div>
          <button className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition duration-200 mb-8">
            Verify with Wallet & World ID
          </button>
          <a href="https://apps.apple.com/no/app/world-app-worldcoin-wallet/id1560859847" 
             className="block text-blue-500 hover:underline mb-8 text-center"
          >
            Get the WorldID App →
          </a>
          <p className="text-sm text-gray-500 text-center whitespace-nowrap">
            Sybil-resistant identity verification powered by World ID.
          </p>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}