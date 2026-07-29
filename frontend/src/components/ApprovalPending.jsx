import React from "react";
import { Lock, AlertCircle } from "lucide-react";

const ApprovalPending = () => {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="flow-panel max-w-md w-full text-center p-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto" style={{ background: "rgba(var(--urgent-rgb),.1)", color: "var(--color-urgent)" }}>
          <Lock className="w-8 h-8" />
        </div>
        <div className="mb-3">
          <AlertCircle className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--color-urgent)" }} />
          <h2 className="font-display text-2xl font-bold text-ink mb-3">Account Pending Approval</h2>
          <p className="text-mute mb-6 leading-relaxed">
            Your account is awaiting admin approval. Once approved, you'll get full access to all features.
          </p>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}>
          <p className="text-sm text-mute">
            If you believe this is an error, please contact support at{" "}
            <span className="font-medium" style={{ color: "var(--color-urgent)" }}>
              support@sahaaya.com
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPending;