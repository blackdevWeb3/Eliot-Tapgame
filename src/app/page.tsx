'use client'
import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';

function InviteCodeInput({ onCodeComplete }: { onCodeComplete: (code: string) => void }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [currentIndex, setCurrentIndex] = useState(0);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isComplete = code.every(char => char !== '');
    if (isComplete) {
      onCodeComplete(code.join(''));
    }
  }, [code, onCodeComplete]);

  const handleInput = (value: string) => {
    if (/^[a-zA-Z0-9]$/.test(value)) {
      if (currentIndex < 6) {
        const newCode = [...code];
        newCode[currentIndex] = value.toUpperCase();
        setCode(newCode);
        setCurrentIndex(prev => Math.min(prev + 1, 5));
      }
    }
  };

  const handleBackspace = () => {
    const newCode = [...code];
    if (currentIndex === 5 && code[5] !== '') {
      newCode[5] = '';
    } else if (currentIndex > 0) {
      newCode[currentIndex - 1] = '';
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
    setCode(newCode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      handleBackspace();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      handleInput(value[value.length - 1]);
    }
    e.target.value = '';
  };

  const focusInput = () => {
    hiddenInputRef.current?.focus();
  };

  return (
    <div className="relative" onClick={focusInput}>
      <input
        ref={hiddenInputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCapitalize="characters"
        className="opacity-0 absolute top-0 left-0 w-px h-px"
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      <div className="flex gap-2">
        {code.map((char, index) => (
          <div
            key={index}
            className={`w-[36px] h-[48px] bg-[#567980] flex items-center justify-center text-white text-2xl font-bold
              ${index === currentIndex ? 'border-2 border-yellow-400' : ''}`}
          >
            {char}
          </div>
        ))}
      </div>
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
      console.log(id);

      try {
        const response = await fetch(`/api/user?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        console.log(response);

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
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  const isMobileDevice = () => /Mobi|Android/i.test(navigator.userAgent);

  useEffect(() => {
    setIsMobile(isMobileDevice());
    
    // Expand the WebApp to full screen when it loads
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.ready();
    }
  }, []);
  
  const handleCodeComplete = (code: string) => {
    setIsComplete(true);
  };

  const handleSubmit = async () => {
    if (!isComplete || isLoading) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/play');
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  if (!isMobile) {
    return (
      <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl mb-8 text-white">Please run the app on mobile device</h1>
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG
            value="https://t.me/chuckletapbot"
            size={200}
            level="H"
            includeMargin={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen h-full flex items-center justify-center p-4 bg-[#1C1C1E]">
      <div className="relative w-full max-w-md mx-auto">
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
            
            <h1 className="mt-[60px] text-[24px] font-bold leading-[29.21px] text-black">
              Early Access Airdrop
            </h1>
            
            <p className="mt-3 text-base font-normal leading-[18.95px] text-black">
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
              className="mt-3 mb-16 text-base font-bold leading-[19.47px] hover:opacity-70 transition-opacity text-black"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}