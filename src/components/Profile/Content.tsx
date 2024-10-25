'use client'
import React, { useState, useEffect } from "react";
import CartoonBox from "@/components/Common/CartoonBox";
import Header from "@/components/Header/Header";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import { useSnackbar } from "notistack";
import { useTonConnectUI } from '@tonconnect/ui-react';

const Content: React.FC = () => {
  const { userData } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const [copying, setCopying] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const [isConnected, setIsConnected] = useState(false);

  // Check wallet connection status
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await tonConnectUI.connected;
      setIsConnected(connected);
    };
    
    checkConnection();
    
    // Listen for wallet events
    const unsubscribe = tonConnectUI.onStatusChange(
      (wallet) => {
        setIsConnected(!!wallet);
        if (wallet) {
          enqueueSnackbar('Wallet connected successfully!', {
            variant: 'success',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
          });
        }
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [tonConnectUI, enqueueSnackbar]);

  // Function to copy referral link
  const copyToClipboard = async () => {
    if (!userData?.referalLink || copying) return;

    setCopying(true);
    try {
      await navigator.clipboard.writeText(userData.referalLink);
      enqueueSnackbar('Referral link copied to clipboard!', {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback copy method
      const textarea = document.createElement('textarea');
      textarea.value = userData.referalLink;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        enqueueSnackbar('Referral link copied to clipboard!', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
      } catch (err) {
        enqueueSnackbar('Failed to copy referral link', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
      }
      document.body.removeChild(textarea);
    } finally {
      setCopying(false);
    }
  };

  // Function to handle wallet connection
  const handleConnectWallet = async () => {
    try {
      if (!isConnected) {
        await tonConnectUI.openModal();
      } else {
        await tonConnectUI.disconnect();
        enqueueSnackbar('Wallet disconnected', {
          variant: 'info',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      enqueueSnackbar('Failed to connect wallet', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    }
  };

  return (
    <div className="relative h-[calc(100vh-6rem)] p-4 bg-[#1B2F31] mx-8 my-4 border-2 border-black shadow-lg text-white overflow-y-scroll">
      <Header />

      <CartoonBox
        width={"100%"}
        height={"3.5rem"}
        backgroundColor="#335056"
        borderColor="#569CAA"
        className="my-2 sm:my-4"
        contentClass="flex items-center justify-between"
      >
        <div className="p-4">
          <span className="text-xs sm:text-sm text-gray-400 leading-none">
            Your invitation earnings:
          </span>
          <h2 className="text-md sm:text-2xl font-normal leading-none">
            {userData?.totalEarned || 0}pts
          </h2>
        </div>
        <Image
          src="/assets/Profile/earnings-add-icon.png"
          alt="Add Earnings Icon"
          width={64}
          height={64}
          className="absolute -right-0 top-1/4 transform -translate-y-1/2 w-16 h-16"
        />
      </CartoonBox>

      <CartoonBox
        width={"100%"}
        height={"1.7rem"}
        backgroundColor="#569CAA"
        borderColor="black"
        className={`w-full mb-2 cursor-pointer transition-opacity duration-200 ${
          copying ? 'opacity-75' : 'opacity-100'
        }`}
        contentClass="flex items-center justify-center"
        onClick={copyToClipboard}
      >
        <Image 
          src="/assets/Profile/copy-icon.svg" 
          alt="Link Icon" 
          width={16} 
          height={16} 
          className={`w-4 h-4 mr-1 ${copying ? 'animate-pulse' : ''}`}
        />
        <span className="text-md mt-[3px]">
          {copying ? 'Copying...' : 'Copy referral link'}
        </span>
      </CartoonBox>

      <div className="w-full bg-[#FAB757] border-b-8 border-[#8D5908]">
        <div className="p-2 sm:p-4">
          <div className="flex items-center gap-4">
            <Image
              src="/assets/Profile/airdrop-icon.png"
              alt="Airdrop Icon"
              width={48}
              height={56}
              className="w-8 h-10 sm:w-12 sm:h-14"
            />
            <div>
              <h2 className="text-xl font-semibold text-black">Airdrop</h2>
              <p className="text-sm text-black tracking-wider max-w-[180px]">
                Complete tasks and do daily logs for rewards
              </p>
            </div>
          </div>

          <div className="mt-4">
            <CartoonBox
              backgroundColor="#000"
              borderColor="transparent"
              className={`w-full cursor-pointer transition-transform duration-200 ${
                isConnected ? 'bg-opacity-80' : ''
              } hover:scale-[1.02] active:scale-[0.98]`}
              onClick={handleConnectWallet}
            >
              <div className="sm:py-2 flex items-center justify-center gap-2">
                <span className="text-white text-md mt-1">
                  {isConnected ? 'Disconnect wallet' : 'Connect wallet'}
                </span>
                <Image 
                  src="/assets/Profile/wallet-icon.svg" 
                  alt="Wallet Icon" 
                  width={20} 
                  height={20} 
                  className={`w-5 h-5 ${isConnected ? 'opacity-50' : ''}`}
                />
              </div>
            </CartoonBox>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
