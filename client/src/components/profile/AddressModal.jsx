import { useEffect } from "react";

import AddressForm from "./AddressForm";

function AddressModal({
  open,
  address,
  onClose,
}) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {address
                ? "Modifier une adresse"
                : "Ajouter une adresse"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Renseignez les informations de votre adresse.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-slate-500 transition hover:bg-slate-100"
          >
            ×
          </button>
        </div>

        {/* BODY */}

        <div className="p-6">
          <AddressForm
            address={address}
            onSuccess={onClose}
            onCancel={onClose}
          />
        </div>

      </div>
    </div>
  );
}

export default AddressModal;