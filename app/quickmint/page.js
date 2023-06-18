"use client"
import React, { useEffect } from "react";
import classNames from "classnames";
import QuickMintForm from "./quickmintform";

const QuickMint = (props) => {
  const [cardAnimation, setCardAnimation] = React.useState("cardHidden");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCardAnimation("");
    }, 700);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const { ...rest } = props;

  return (
    <div>
      <div className="h-1/2 relative">
  <div className="absolute inset-0">
    <div className="bg-cover bg-center h-full"
      style={{
        backgroundImage: `url("https://as2.ftcdn.net/v2/jpg/02/67/82/41/1000_F_267824136_o7c7xwQ1Ue2BINEPvJwyeFzok1Xq2h8h.jpg")`
      }}
    ></div>
    <div className="absolute inset-0 bg-black opacity-50"></div>
  </div>
  <div className="container mx-auto py-16 relative z-10">
    <div className="text-white text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Quick Mint</h1>
      <p className="text-lg md:text-xl mb-8">
        MintBoxx empowers digital creators to unleash their creativity
        by providing the ability to create innovative NFT experiences
        for their audiences.
      </p>
    </div>
  </div>
</div>


      <div className="h-1/2 bg-white">
      <div className="container mx-auto py-16">
  <div className="grid grid-cols-5 md:grid-cols-5 gap-8">
    <div className="col-span-3">
      <div className="bg-white shadow-lg rounded-lg p-8 h-full">
   
        <QuickMintForm />
      </div>
    </div>
    <div className="col-span-2 flex justify-center items-center h-2/3">
      <div className="bg-white rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Quick Mint
        </h1>
        <img
          className="w-full"
          src="https://hbobis.files.wordpress.com/2015/12/animation-rocket.gif"
          alt="Rocket"
        />
      </div>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default QuickMint;
