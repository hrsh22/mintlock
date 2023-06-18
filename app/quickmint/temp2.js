"use client"
import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Form } from "antd";
import { NFTStorage, File, Blob } from "nft.storage";

// import LoadingAnimation from "../../utils/LoadingAnimation";

export default function QuickMintForm() {
  const [fileBlob, setFileBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
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

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Mint</h2>
        <div className="flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <div className="flex-none bg-gray-100 px-4 py-2 rounded-full">
            {activeStep + 1} / 3
          </div>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
      </div>

      {activeStep === 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Step 1: Upload File</h3>
          <Upload.Dragger
            name="file"
            multiple={false}
            action="/"
            onChange={handleFileUpload}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Upload.Dragger>
          {fileList.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Uploaded Files:</h4>
              <ul className="list-disc ml-6">
                {fileList.map((file) => (
                  <li key={file.uid}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeStep === 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Step 2: Enter Details</h3>
          <Form>
            <Form.Item label="Name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
            </Form.Item>
            <Form.Item label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
            </Form.Item>
          </Form>
        </div>
      )}

      {activeStep === 2 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Step 3: Confirm</h3>
          {/* Display confirmation details here */}
        </div>
      )}

      <div className="mt-8">
        {activeStep > 0 && (
          <button
            onClick={handlePreviousStep}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mr-2"
          >
            Previous
          </button>
        )}
        {activeStep < 2 && (
          <button
            onClick={handleNextStep}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        )}
        {activeStep === 2 && (
          <button
            onClick={handleNextStep}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Mint
          </button>
        )}
      </div>

      {loading && "loading..."}
    </div>
  );
}
