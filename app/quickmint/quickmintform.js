"use client"
import React, { useRef, useState } from "react";
import Link from "next/link";
import classNames from "classnames";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Form } from "antd";
import { NFTStorage, File, Blob } from "nft.storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFingerprint, faRocket } from "@fortawesome/free-solid-svg-icons";
import lit from "./lit";
import { upload } from "@spheron/browser-upload";
export default function QuickMintForm() {
  const [activeStep, setActiveStep] = useState(0);

  const [fileBlob, setFileBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
    const [image, setImageLink] =useState("");
    const [metadata, setMetadata] = useState("");
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState("");
    const [uploadLink, setUploadLink]= useState("");
    const [isLoading,setIsLoading] = useState("")
  const { Dragger } = Upload;

  async function convertToBlob(imageUrl) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    setFileBlob(blob);
    console.log(blob);
  }

  async function uploadToIPFS() {
    setLoading(true);
    try {
      const client = new NFTStorage({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhDNkQ4M2JiYzNiOWI5OUIwZENBOWNEOGM2NWZFMTJENWE3Qjk3NGUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4NzA4Nzc3NjYwNCwibmFtZSI6Im5mdC1taW50ZXIifQ.7-pCnR5Cis1uM1wIvezdntpwjJH9kApiV_MOUiudE48",
      });

      await convertToBlob(image);

      const metadata = await client.store({
        name: name,
        description: description,
        image: new File([fileBlob], "image.jpg", { type: "image/jpeg" }),
      });

      console.log('metadata', metadata)
      let nftURI = "https://ipfs.io/ipfs/" + metadata.url.slice(7);
      const data = await fetch(nftURI);
      const json = await data.json();

      let imageLink = "https://nftstorage.link/ipfs/" + json.image.slice(7);

      console.log("imageLink: ", imageLink);
      console.log("nftURI: ", nftURI)

      const metadataURL = "https://nftstorage.link/ipfs/" + metadata.url.slice(7);
      setMetadata(metadataURL);
    //   setImageLink(imageLink);
    //   setNFTURI(nftURI);
      return metadata.url;
    } catch (error) {
      console.error("IPFS upload failed:", error);
    }
  }

  const steps = [
    "Step 1: Upload File",
    "Step 2: View Encrypted Metadata",
    "Step 3: Confirm",
  ];

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleStep0 = async (e) => {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Description:", description);
    await uploadToIPFS();
    setActiveStep((prevStep) => prevStep + 1);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FileBlob:", fileBlob);
    console.log("Name:", name);
    console.log("Description:", description);
    await uploadToIPFS();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setOne(false);
    setTwo(true);
    setLoading(false);
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
    setFileType(selectedFile.name);
    console.log("selectedFile",selectedFile)
    setUploadLink("");

    
  };

  const handleEncryptUpload = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8111/initiate-upload");
      const responseJson = await response.json();

      const uploadResult = await lit.encryptFile(file, {
        token: responseJson.uploadToken,
      });

      setUploadLink(uploadResult.protocolLink);
      setMetadata(uploadResult.protocolLink);
      console.log("Name:", name);
    console.log("Description:", description);
    setActiveStep((prevStep) => prevStep + 1);
    setLoading(false);

    } catch (err) {
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleFinalMint = async () => {
    await MintNFT();
  };

  async function MintNFT() {
    const addr = localStorage.getItem("walletAddress");
   
      // Check if MetaMask is installed
      console.log("from check function in QuickMintForm.js: ", addr);
      if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask first.");
        return;
      }

      // Connect to the MetaMask provider
      window.addEventListener("load", async () => {
        try {
          await window.ethereum.request({
            method: "eth_requestAccounts",
          });
        } catch (error) {}
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // MetaMask requires requesting permission to connect users accounts
      // Request access to the user's MetaMask account
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      // Get the signer for the account
      const signer = provider.getSigner(account);

      const contractAddress = collectionAddress; // Replace with your contract address
      const abi = QUICKMINT_COLLECTION_ABI; // Replace with your contract ABI
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Create the transaction
      const transaction = await contract.quickMint(nftURI);

      console.log(transaction);
      setTxHash(transaction.hash);
      console.log(transaction.hash);
      console.log("NFT MINTED");
    
  }


  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-8">
        {/* <h2 className="text-2xl font-semibold mb-4 text-black">Stepper</h2> */}
        <div className="flex items-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className={classNames(
                "flex-grow border-t-2",
                {
                  "border-blue-500": index <= activeStep,
                  "border-gray-300": index > activeStep,
                },
                { "ml-4": index !== 0 }
              )}
            ></div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={classNames("text-sm font-medium", {
                "text-blue-500": index === activeStep,
                "text-gray-500": index !== activeStep,
              })}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      <div>
        {activeStep === 0 && (
          <div>
            <Form
              layout="vertical"
              style={{ maxWidth: 600 }}
              labelCol={{ span: 400, style: { color: "black" } }} // Add style property to change label color
            >
              <div className="mt-1">
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="border rounded-md p-2 w-full"
                  placeholder="Title"
                  required
                  onChange={(event) => setName(event.target.value)}
                />
                <br />
                <br />
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="border rounded-md p-2 w-full"
                  placeholder="Description"
                  required
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              
                <br/>
                <button
          type="button"
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md"
          onClick={handleSelectFile}
        >
          Select Image
          <input
                    id="file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="w-full h-full"
                    style={{ display: "none" }}
                  />
        </button>
            </Form>
          </div>
        )}

        {activeStep === 1 && (
   
            <div>
  <Link href={metadata} target="_blank">
  
      <div className="flex justify-center">
        <div className="w-full sm:w-1/2 md:w-1/4">
          <div className="flex items-center flex-col">
          <FontAwesomeIcon icon={faFingerprint} className="text-red-500 text-6xl" />
            <h3 className="text-xl text-black text-center font-bold mt-2">
              View Metadata Link
            </h3>
          </div>
        </div>
      </div>

  </Link>
</div>

     
        )}

        {activeStep === 2 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">{steps[2]}</h3>
            <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full py-2 px-4 flex items-center"
      onClick={handleFinalMint}
    >
      <FontAwesomeIcon icon={faRocket} className="mr-2" />
      Mint NFT
    </button>
          </div>
        )}
      </div>

      <div className="mt-8">
            {activeStep === 0 && (
                <button
                onClick={handleEncryptUpload}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Encrypt Metadata
              </button>
            )}


{activeStep === 1 && (
                <button
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Ready to Mint
              </button>
            )}
        {/* {activeStep > 0 && (
          <button
            onClick={handlePreviousStep}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mr-2"
          >
            Previous
          </button>
        )}
        {activeStep < steps.length - 1 && (
          <button
            onClick={handleNextStep}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        )}
        {activeStep === steps.length - 1 && (
          <button
            onClick={handleNextStep}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Finish
          </button>
        )} */}
      </div>
    </div>
  );
}
