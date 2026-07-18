import React from "react";
import { Lock } from "lucide-react";

const ApprovalPending = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Account Pending Approval
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Your account is awaiting admin approval. Once approved, you'll get
          full access to all features.
        </p>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact support at{" "}
            <span className="text-red-500 font-medium">
              support@sahaaya.com
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPending;
