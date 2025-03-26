import React from 'react';

interface ProfileCompletionStepsProps {
  currentStep: number;
  totalSteps?: number;
}

const ProfileCompletionSteps: React.FC<ProfileCompletionStepsProps> = ({
  currentStep,
  totalSteps = 4,
}) => {
  // Calculate progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  // Step labels - can be customized as needed
  const stepLabels = ['Basic Info', 'Contact', 'Media', 'Categories'];

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Profile Completion</span>
        <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        {stepLabels.map((label, index) => (
          <span 
            key={index}
            className={currentStep > index ? 'font-medium text-blue-600' : ''}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProfileCompletionSteps;