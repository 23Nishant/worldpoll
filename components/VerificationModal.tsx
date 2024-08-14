'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VerificationModal({ isOpen, onClose }: VerificationModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleVerify = () => {
    router.push('/communitiespage');
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <Image src="/scan.PNG" alt="Verification Image" width={300} height={300} />
        <button onClick={handleVerify}>Verify</button>
      </div>
    </div>
  );
}