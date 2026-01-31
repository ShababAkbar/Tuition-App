import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (coverLetter: string) => void;
  tuitionDetails: {
    code: string;
    subject: string;
    grade: string;
    fee: string;
  };
}

export default function ApplicationModal({ isOpen, onClose, onSubmit, tuitionDetails }: ApplicationModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToFeeCollection, setAgreedToFeeCollection] = useState(false);
  const [agreedToDirectPayment, setAgreedToDirectPayment] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!coverLetter.trim()) {
      alert('Please describe why you are the ideal candidate');
      return;
    }
    if (!agreedToTerms || !agreedToFeeCollection || !agreedToDirectPayment) {
      alert('Please agree to all terms and conditions');
      return;
    }
    onSubmit(coverLetter);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Applicant Proposal</h2>
            <p className="text-sm text-gray-600">
              {tuitionDetails.code} - Grade {tuitionDetails.grade} {tuitionDetails.subject}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Fee Negotiation Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Parents/students can negotiate the fee further during the interview stage or after the demo.
            </p>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Please briefly describe why you are the ideal candidate for this tutoring position *
            </label>
            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Include your relevant experience, available slots, skills and qualifications, and any additional information that distinguishes you as a tutor."
              className="min-h-[150px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {coverLetter.length}/500 characters
            </p>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900">
              Agency charges 50% (first month only) *
            </h3>

            {/* Term 1 */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox
                checked={agreedToTerms}
                onCheckedChange={(checked: boolean) => setAgreedToTerms(checked)}
                className="mt-1"
              />
              <label className="text-sm text-gray-700 cursor-pointer flex-1">
                I agree to the terms and conditions
              </label>
            </div>

            {/* Term 2 */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox
                checked={agreedToFeeCollection}
                onCheckedChange={(checked: boolean) => setAgreedToFeeCollection(checked)}
                className="mt-1"
              />
              <label className="text-sm text-gray-700 cursor-pointer flex-1">
                <strong>Apna Tuition</strong> will collect the first month fees and will transfer your share{' '}
                <strong className="text-blue-600">after 15 days</strong> of tuition start date. *
              </label>
            </div>

            {/* Term 3 */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox
                checked={agreedToDirectPayment}
                onCheckedChange={(checked: boolean) => setAgreedToDirectPayment(checked)}
                className="mt-1"
              />
              <label className="text-sm text-gray-700 cursor-pointer flex-1">
                You can collect the full fee from the client directly from next month. *
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            Submit Application
          </Button>
        </div>
      </div>
    </div>
  );
}
