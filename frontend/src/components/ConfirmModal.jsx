import React, { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

/**
 * Shared confirmation modal.
 * Matches the RedeemPoints modal styling + Flow tokens (--color-urgent).
 * Closes on backdrop click or Escape (disabled while loading).
 */
const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  icon,
  loading = false,
}) => {
  const Icon = icon || AlertTriangle;
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !loading) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => !loading && onClose?.()}
    >
      <div
        className="bg-surface rounded-[var(--r-xl)] shadow-2xl max-w-md w-full p-6 relative text-center"
        style={{ border: "1px solid var(--color-line)", animation: "d4slidein .22s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => !loading && onClose?.()}
          className="absolute top-4 right-4 text-mute hover:text-ink cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 rounded-2xl mb-3" style={{ background: "rgba(var(--urgent-rgb),.1)" }}>
          <Icon className="w-8 h-8" style={{ color: "var(--color-urgent)" }} />
        </div>
        <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
        {description ? <p className="text-mute mt-1">{description}</p> : null}

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => !loading && onClose?.()}
            disabled={loading}
            className="fbtn fbtn-g flex-1"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="fbtn flex-1"
            style={{ background: "var(--color-urgent)", color: "#fff", borderColor: "var(--color-urgent)" }}
          >
            {loading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
