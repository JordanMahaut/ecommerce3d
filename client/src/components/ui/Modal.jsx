function Modal({
  open,
  title,
  children,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
      <div className="flex min-h-full items-start justify-center p-4 sm:items-center">
        <div className="my-6 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-xl font-bold">
              {title}
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-1 text-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Fermer la fenêtre"
            >
              ×
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;