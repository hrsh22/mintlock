"use client"
import * as PushAPI from "@pushprotocol/restapi";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUser, faBell } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import { Button, Drawer, Card } from "antd";

const Navbar = () => {
  const [address, setAddress] = useState(null);
  const [isWalletConnected,setIsWalletConnected] = useState(false);

  const [open, setOpen] = useState(false);

  const [notification, SetNotification] = useState([]);
  const NotificationReceiver = async (props) => {
    const notifications = await PushAPI.user.getFeeds({
      user: `eip155:80001:${address}`, // user address in CAIP
      env: "staging",
    });
    SetNotification(notifications);
    console.log(notifications);
  };

  const showDrawer = () => {
    NotificationReceiver();
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

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
<nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            
            <div className="text-xl font-bold text-gray-800">MintLock</div>
            {/* <button className="text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md" onClick={connectWallet}>Connect Wallet</button> */}
            {/* {address ? (
              <>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center"
                  onClick={disconnectWallet}
                >
                  <span className="mr-2">{address}</span>
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="h-6 w-6"
                  />
                </button>
              </>
            ) : (
              <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                // className="bg-[#1E50FF] outline-none border-none py-3 px-5 rounded-xl font-body cursor-pointer  duration-250 ease-in-out hover:transform-x-1 hover:drop-shadow-xl hover:shadow-sky-600 w-full mt-8 transition transform hover:-translate-y-3 motion-reduce:transition-none motion-reduce:hover:transform-none "
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            )} */}
            <div className='flex justify-items-end'>
            {address ? (
          <>
            <button
            className="text-white bg-indigo-500 hover:bg-indigo-600 px-4 mx-4 py-2 rounded-md"

              onClick={disconnectWallet}
            >
              {truncateEthAddress(address)}
              &nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon={faRightFromBracket} />
            </button>

            <button
                type="button"
                onClick={showDrawer}
                className="border-none outline-none active:scale-110 transition-all duration-300 relative"
              >
                 <FontAwesomeIcon icon={faBell} className="mr-2 text-black" />
              </button>
              <Drawer
                title="Push Notifications - MintLock"
                width={"700px"}
                placement="right"
                onClose={onClose}
                open={open}
              >
                {notification.map((item, index) => {
                  // console.log(notification);
                  return (
                    <Card
                      key="key"
                      className="mt-3"
                      type="inner"
                      title={item["title"]}
                      extra={
                        <a href="mintlock.vercel.app">
                          <b>MintLock</b>
                        </a>
                      }
                    >
                      {item["message"]}
                    </Card>
                  );
                })}
              </Drawer>
          </>
        ) : (
          <button
          className="text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md"
            // className="bg-[#1E50FF] outline-none border-none py-3 px-5 rounded-xl font-body cursor-pointer  duration-250 ease-in-out hover:transform-x-1 hover:drop-shadow-xl hover:shadow-sky-600 w-full mt-8 transition transform hover:-translate-y-3 motion-reduce:transition-none motion-reduce:hover:transform-none "
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
          )}
          </div>
          </div>
        </div>
      </nav>
       );
    };
    
    export default Navbar;