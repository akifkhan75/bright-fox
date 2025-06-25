
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import { UserRole } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ShieldCheckIcon, DocumentArrowUpIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

const TeacherVerificationScreen: React.FC = () => {
  const context = useContext(AppContext);
  
  const [idFile, setIdFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!context || !context.teacherProfile || context.appState.currentUserRole !== UserRole.Teacher) {
    return <div className="p-4 text-center">Access Denied. Please log in as a teacher.</div>;
  }
  const { teacherProfile, submitTeacherVerification } = context;

  const currentStatus = teacherProfile.verificationStatus || 'NotSubmitted';
  const canSubmit = currentStatus === 'NotSubmitted' || currentStatus === 'Rejected';

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
        alert("You have already submitted documents or are verified.");
        return;
    }
    // Basic validation (in real app, more robust)
    if (!idFile && !portfolioLink) { // Example: ID or portfolio link required
        alert("Please upload an ID document or provide a portfolio link.");
        return;
    }

    setIsSubmitting(true);
    // Mocking document data to pass
    const documentsData = {
        idFileName: idFile?.name,
        certificateFileName: certificateFile?.name,
        portfolioLink: portfolioLink,
    };
    
    const success = await submitTeacherVerification(teacherProfile.id, documentsData);
    setIsSubmitting(false);
    if(success) {
        // AppContext should update teacherProfile, this screen will re-render
    } else {
        alert("Submission failed. Please try again.");
    }
  };

  const statusMessages = {
    NotSubmitted: "Please submit your documents for verification to start offering paid courses.",
    Pending: "Your documents are under review. This usually takes 3-5 business days. We'll notify you via email.",
    Verified: "Congratulations! You are a verified teacher. You can now publish paid courses.",
    Rejected: "There was an issue with your previous submission. Please review any feedback and resubmit corrected documents.",
  };
   const statusColors = {
    NotSubmitted: "bg-gray-100 text-gray-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Verified: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };


  return (
    <div className="p-4 md:p-6 bg-slate-100 min-h-full">
      <Card className="max-w-lg mx-auto">
        <div className="flex items-center text-orange-600 mb-4">
            <ShieldCheckIcon className="h-8 w-8 mr-2"/>
            <h1 className="text-2xl font-bold font-display">Teacher Verification Center</h1>
        </div>

        <Card className={`!p-3 mb-6 ${statusColors[currentStatus]}`}>
            <p className="text-sm font-semibold">Current Status: {currentStatus.replace(/([A-Z])/g, ' $1').trim()}</p>
            <p className="text-xs mt-1">{statusMessages[currentStatus]}</p>
        </Card>

        {canSubmit && (
            <form onSubmit={handleSubmitVerification} className="space-y-5">
                <p className="text-sm text-gray-600">
                    To ensure a safe and high-quality learning environment, we require teachers to verify their identity and qualifications.
                </p>
                <div>
                    <label htmlFor="idFile" className="block text-sm font-medium text-gray-700">Government-Issued ID (e.g., Driver's License, Passport)</label>
                    <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <DocumentArrowUpIcon className="mx-auto h-10 w-10 text-gray-400"/>
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="idFile" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>Upload a file</span>
                                    <input id="idFile" name="idFile" type="file" className="sr-only" onChange={e => setIdFile(e.target.files ? e.target.files[0] : null)} accept="image/*,.pdf"/>
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB. {idFile && `Selected: ${idFile.name}`}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="certificateFile" className="block text-sm font-medium text-gray-700">Teaching Certificates / Diplomas (Optional)</label>
                     <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        {/* Similar upload UI as above */}
                         <div className="space-y-1 text-center">
                            <DocumentArrowUpIcon className="mx-auto h-10 w-10 text-gray-400"/>
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="certificateFile" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                    <span>Upload files</span>
                                    <input id="certificateFile" name="certificateFile" type="file" className="sr-only" onChange={e => setCertificateFile(e.target.files ? e.target.files[0] : null)} accept="image/*,.pdf" multiple/>
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, PDF. {certificateFile && `Selected: ${certificateFile.name}`}</p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <label htmlFor="portfolioLink" className="block text-sm font-medium text-gray-700">Portfolio Link (Optional - e.g., LinkedIn, Personal Website)</label>
                    <input type="url" id="portfolioLink" value={portfolioLink} onChange={e => setPortfolioLink(e.target.value)} placeholder="https://..." className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                </div>

                <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-700">
                    <InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0"/>
                    <p>All submitted documents are handled securely and confidentially, used solely for verification purposes. Please ensure your uploads are clear and legible.</p>
                </div>

                <Button type="submit" fullWidth size="lg" disabled={isSubmitting} className="!bg-orange-500 hover:!bg-orange-600">
                    {isSubmitting ? <LoadingSpinner size="sm"/> : "Submit Documents for Verification"}
                </Button>
            </form>
        )}
        
        {currentStatus === 'Verified' && (
            <div className="text-center mt-6">
                <ShieldCheckIcon className="h-12 w-12 text-green-500 mx-auto mb-2"/>
                <p className="font-semibold text-green-700">You're all set and verified!</p>
            </div>
        )}
      </Card>
    </div>
  );
};

export default TeacherVerificationScreen;
