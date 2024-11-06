'use client'
import React, { useState } from "react";
import CartoonBox from "@/components/Common/CartoonBox";
import Header from "@/components/Header/Header";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import { useSnackbar } from "notistack";
import { 
  DynamicContextProvider, 
  DynamicWidget, 
  useDynamicContext 
} from "@dynamic-labs/sdk-react";
import { SolanaWalletConnector } from "@dynamic-labs/solana";

const WalletButton = () => {
  const { primaryWallet, handleLogOut } = useDynamicContext();
  const { enqueueSnackbar } = useSnackbar();

  const handleWalletClick = async () => {
    try {
      if (primaryWallet) {
        await handleLogOut();
        enqueueSnackbar('Wallet disconnected', {
          variant: 'info',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      enqueueSnackbar('Failed to disconnect wallet', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    }
  };

  return (
    <CartoonBox
      backgroundColor="#000"
      borderColor="transparent"
      className={`w-full cursor-pointer transition-transform duration-200 ${
        primaryWallet ? 'bg-opacity-80' : ''
      } hover:scale-[1.02] active:scale-[0.98]`}
      onClick={handleWalletClick}
    >
      <div className="sm:py-2 flex items-center justify-center gap-2">
        {primaryWallet ? (
          <>
            <span className="text-white text-md mt-1">
              {primaryWallet.address.slice(0, 4)}...{primaryWallet.address.slice(-4)}
            </span>
            <span className="text-white text-md mt-1">Disconnect</span>
          </>
        ) : (
          <DynamicWidget />
        )}
        <Image 
          src="/assets/Profile/wallet-icon.svg" 
          alt="Wallet Icon" 
          width={20} 
          height={20} 
          className="w-5 h-5"
        />
      </div>
    </CartoonBox>
  );
};

const Content: React.FC = () => {
  const { userData } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const [copying, setCopying] = useState(false);

  // Copy to clipboard function remains the same
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
            <WalletButton />
          </div>
        </div>
      </div>
    </div>
  );
};

const WrappedContent: React.FC = () => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "d0e577ef-2b42-414a-b164-58496a29adbf", // Replace with your Dynamic environment ID
        newToWeb3WalletChainMap: {
           primary_chain: "sol", 
           wallets: {
               evm: "phantomevm",
               solana: "phantom"
           }
        }
      }}
    >
      <Content />
    </DynamicContextProvider>
  );
};

export default WrappedContent;