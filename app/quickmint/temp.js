import React, { useState } from "react";
import classNames from "classnames";

export default function Stepper() {
  const [activeStep, setActiveStep] = useState(0);

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

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Stepper</h2>
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
            <h3 className="text-lg font-semibold mb-4">{steps[0]}</h3>
            {/* Step 1 content */}
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
        {activeStep > 0 && (
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
        )}
      </div>
    </div>
  );
}
