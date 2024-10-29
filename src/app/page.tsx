'use client'
import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

function InviteCodeInput({ onCodeComplete }: { onCodeComplete: (code: string) => void }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<HTMLDivElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const isComplete = code.every(char => char !== '');
    if (isComplete) {
      onCodeComplete(code.join(''));
    }
  }, [code, onCodeComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[a-zA-Z0-9]$/.test(e.key)) {
        if (currentIndex < 6) {
          const newCode = [...code];
          newCode[currentIndex] = e.key.toUpperCase();
          setCode(newCode);
          setCurrentIndex(prev => Math.min(prev + 1, 5));
        }
      } else if (e.key === 'Backspace') {
        const newCode = [...code];
        if (currentIndex === 5 && code[5] !== '') {
          newCode[5] = '';
        } else if (currentIndex > 0) {
          newCode[currentIndex - 1] = '';
          setCurrentIndex(prev => Math.max(prev - 1, 0));
        }
        setCode(newCode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, currentIndex]);

  return (
    <div className="flex gap-2">
      {code.map((char, index) => (
        <div
          key={index}
          ref={el => {
            if (el) inputRefs.current[index] = el;
          }}
          className={`w-[36px] h-[48px] bg-[#567980] flex items-center justify-center text-white text-2xl font-bold
            ${index === currentIndex ? 'border-2 border-yellow-400' : ''}`}
        >
          {char}
        </div>
      ))}
    </div>
  );
}

function UserDataFetcher() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserData } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      const id = searchParams.get('id');
      
      if (!id) {
        console.error('No ID provided');
        return;
      }

      try {
        const response = await fetch(`/api/user?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        console.log(userData);
        setUserData(userData);
        router.push("/play");
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [searchParams, router, setUserData]);

  return null;
}
export default function Page() {
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeComplete = (code: string) => {
    setIsComplete(true);
  };

  const handleSubmit = async () => {
    if (!isComplete || isLoading) return;
    
    setIsLoading(true);
    // Add any API calls here if needed
    try {
      // Simulate API call with small delay
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/play');
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full min-h-[500px] h-full flex items-center justify-center p-4">
      <div className="relative w-full">
        <div 
          className="absolute inset-0 w-full bg-[#569CAA] border-[3px] border-black"
          style={{
            transform: 'rotate(-4deg) translate(4px, -24px)',
          }}
        />
        <div 
          className="relative w-full min-h-[500px] bg-[#B6DCE4] border-[3px] border-black"
          style={{
            backgroundImage: 'url(/frame.png)',
            backgroundPosition: 'top center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Background Items */}
          <div className="absolute left-0 top-0">
            <Image
              src="/back/left-top.svg"
              alt="Left Top Decoration"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>
          <div className="absolute right-0 top-0">
            <Image
              src="/back/right-top.svg"
              alt="Right Top Decoration"
              width={70}
              height={70}
              className="object-contain"
            />
          </div>
          <div className="absolute left-0 bottom-0">
            <Image
              src="/back/left-bottom.svg"
              alt="Left Bottom Decoration"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col items-center pt-5">
            <Image
              src="/back/icon.svg"
              alt="Airdrop"
              width={50}
              height={50}
              className="object-contain"
            />
            
            <h1 className="mt-[60px] text-[24px] font-bold leading-[29.21px]">
              Early Access Airdrop
            </h1>
            
            <p className="mt-3 text-base font-normal leading-[18.95px]">
              Enter your invite code to claim your airdrop
            </p>

            <div className="mt-4">
              <InviteCodeInput onCodeComplete={handleCodeComplete} />
            </div>

            <button 
              onClick={handleSubmit}
              disabled={!isComplete || isLoading}
              className={`mt-[120px] px-6 py-3 flex items-center gap-2 text-xl font-bold
                transition-all duration-200 transform active:scale-95
                ${isComplete 
                  ? 'bg-[#569CAA] text-white hover:bg-[#4a8795] cursor-pointer' 
                  : 'bg-[#8BA1A5] text-gray-300 cursor-not-allowed'
                }
                ${isLoading ? 'animate-pulse' : ''}
              `}
            >
              {isLoading ? 'Processing...' : 'Submit'}
              <ArrowRight size={20} />
            </button>

            <button 
              onClick={() => router.back()} 
              className="mt-3 mb-16 text-base font-bold leading-[19.47px] hover:opacity-70 transition-opacity"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
