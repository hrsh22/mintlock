import React, { useState } from "react";
import classNames from "classnames";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Form } from "antd";
import { NFTStorage, File, Blob } from "nft.storage";

export default function QuickMintForm() {
  const [activeStep, setActiveStep] = useState(0);

  const [fileBlob, setFileBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { Dragger } = Upload;

  async function uploadToIPFS() {
    setLoading(true);
    try {
      const client = new NFTStorage({
        token:
          "",
      });

      const metadata = await client.store({
        name: name,
        description: description,
        image: new File([fileBlob], "image.jpg", { type: "image/jpeg" }),
      });
      let nftURI = "https://nftstorage.link/ipfs/" + metadata.url.slice(7);
      const data = await fetch(nftURI);
      const json = await data.json();

      let imageLink = "https://nftstorage.link/ipfs/" + json.image.slice(7);
      setImageLink(imageLink);
      setNFTURI(nftURI);
      return metadata.url;
    } catch (error) {
      console.error("IPFS upload failed:", error);
    }
  }

  const props = {
    name: "file",
    multiple: false,
    action: "/",
    onChange(info) {
      const { status, response } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        const reader = new FileReader();
        reader.readAsArrayBuffer(info.file.originFileObj);
        reader.onloadend = async () => {
          try {
            const blob = new Blob([reader.result], { type: info.file.type });
            setFileBlob(blob);
          } catch (error) {
            console.log(error);
          }
        };
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
      setFileList(info.fileList);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleFileUpload = (info) => {
    const { status, response } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
      const reader = new FileReader();
      reader.readAsArrayBuffer(info.file.originFileObj);
      reader.onloadend = async () => {
        try {
          const blob = new Blob([reader.result], { type: info.file.type });
          setFileBlob(blob);
        } catch (error) {
          console.log(error);
        }
      };
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
    setFileList(info.fileList);
  };

  const steps = [
    "Step 1: Upload File",
    "Step 2: Enter Details",
    "Step 3: Confirm",
  ];

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleStep0 = (e) => {
    e.preventDefault();
    console.log("FileBlob:", fileBlob);
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

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-black">Stepper</h2>
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
              <br />

              <Form.Item align="center" valuePropName="fileList">
                <div className="rounded-xl bg-gradient-to-r from-blue-900 via-violet-500 to-blue-800 p-1">
                  <div className="items-center rounded-xl p-3 justify-center bg-slate-100 back">
                    <Dragger {...props} listType="picture">
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to this area to upload
                      </p>
                      <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit
                        from uploading company data or other band files
                      </p>
                    </Dragger>
                  </div>
                </div>
              </Form.Item>

              {/* <Form.Item style={{ display: "flex", justifyContent: "center" }}>
                <br />
                <button
  className="bg-primary text-black rounded-lg px-4 py-2 text-lg"
//   onClick={handleSubmit}
>
  Submit
</button>

              </Form.Item> */}
            </Form>
          </div>
        )}

        {activeStep === 1 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">{steps[1]}</h3>
            {/* Step 2 content */}
          </div>
        )}

        {activeStep === 2 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">{steps[2]}</h3>
            {/* Step 3 content */}
          </div>
        )}
      </div>

      <div className="mt-8">
            {activeStep == 0 & (
                <button
                onClick={handleStep0}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mr-2"
              >
                Next
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
