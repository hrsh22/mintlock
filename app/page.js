"use client"
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';

const Home = () => {
  const [address, setAddress] = useState(null);
  const [isWalletConnected,setIsWalletConnected] = useState(false);

  useEffect(() => {
    const addr = localStorage.getItem("walletAddress");
    setAddress(addr);
  }, []);

  const truncateRegex = /^(0x[a-zA-Z0-9]{6})[a-zA-Z0-9]+([a-zA-Z0-9]{5})$/;

const truncateEthAddress = (addr) => {
  const match = addr?.match(truncateRegex);
  if (!match) return addr;
  return `${match[1]}... ${match[2]}`;
};

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please Install MetaMask");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setIsWalletConnected(true);


      localStorage.setItem("walletAddress", accounts[0]);
      setAddress(accounts[0]);
      // router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const disconnectWallet = async () => {
    localStorage.removeItem("walletAddress");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-indigo-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Create and Mint Your Own NFTs</h1>
            <p className="text-xl md:text-2xl mb-8">Be Secure with our encypted nfts.</p>
            <button className="bg-white text-indigo-500 hover:text-indigo-600 px-6 py-3 rounded-md font-bold">
              <Link href='/quickmint'>QuickMint NFT</Link>
              </button>
          </div>
        </div>
      </header>
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl text-sky-600 font-bold mb-8 text-center">Why Choose Our NFT Minting App?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="text-2xl mb-4 text-indigo-500">
              <svg className="w-8 h-8 inline-block text-indigo-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Easy to Use
            </div>
            <p className='text-gray-900'>Create and mint NFTs with just a few simple steps. Our intuitive interface makes the process hassle-free.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="text-2xl mb-4 text-indigo-500">
              <svg className="w-8 h-8 inline-block text-indigo-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6a7.5 7.5 0 00-7.5 7.5v1.75h15V13.5A7.5 7.5 0 0012 6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6a7.5 7.5 0 00-7.5 7.5v1.75h15V13.5A7.5 7.5 0 0012 6z" />
              </svg>
              Secure and Reliable
            </div>
            <p className='text-gray-900'>Your NFTs are stored securely on the blockchain, ensuring their authenticity and permanence.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="text-2xl mb-4 text-indigo-500">
              <svg className="w-8 h-8 inline-block text-indigo-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6a7.5 7.5 0 00-7.5 7.5v1.75h15V13.5A7.5 7.5 0 0012 6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6a7.5 7.5 0 00-7.5 7.5v1.75h15V13.5A7.5 7.5 0 0012 6z" />
              </svg>
              Community and Exposure
            </div>
            <p className='text-gray-900'>Encypted NFTs helps securing privacy between dealers.</p>
          </div>
        </div>
      </section>
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2023 MintLock. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
