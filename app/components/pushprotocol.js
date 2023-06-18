import * as PushAPI from "@pushprotocol/restapi";
import { ethers } from "ethers";

export const sendNotifications = async (txHash) => {
  //   const { title, message } = props;
  const address = localStorage.getItem("walletAddress");

  const PK = "9b2d1f23d1831949ccf603490528ec2ea407d87dbb3f49baa8a851133761ba41";
  const Pkey = `0x${PK}`;

  const _signer = new ethers.Wallet(Pkey);
  const apiResponse = await PushAPI.payloads.sendNotification({
    signer: _signer,
    type: 3, // target
    identityType: 0, // minimal payload
    notification: {
      title: "NFT Minted",
      body: `Your NFT has been minted Successfully`,
    },
    payload: {
      title: "NFT Minted Successfully",
      body: "Your NFT has been minted Successfully",
      cta: "",
      img: "",
    },
    recipients: [`eip155:80001:${address}`], // recipients addresses
    channel: "eip155:80001:0xD490fB9eee2578444CFa56D74B4afaf215EfC269", // your channel address
    env: "staging",
  });
  console.log(apiResponse);
};
