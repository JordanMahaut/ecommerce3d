function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {address.label || "Adresse"}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {address.type === "SHIPPING"
              ? "Adresse de livraison"
              : "Adresse de facturation"}
          </p>
        </div>

        {address.isDefault && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            Par défaut
          </span>
        )}
      </div>

      <div className="mt-6 space-y-1 text-slate-700">
        <p className="font-semibold">
          {address.firstname} {address.lastname}
        </p>

        {address.company && (
          <p>{address.company}</p>
        )}

        <p>{address.street}</p>

        {address.street2 && (
          <p>{address.street2}</p>
        )}

        <p>
          {address.postalCode} {address.city}
        </p>

        <p>{address.country}</p>

        {address.phone && (
          <p className="pt-2 text-sm text-slate-500">
            📞 {address.phone}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => onEdit(address)}
          className="rounded-lg bg-indigo-50 px-4 py-2 font-semibold text-indigo-600 transition hover:bg-indigo-100"
        >
          Modifier
        </button>

        <button
          onClick={() => onDelete(address.id)}
          className="rounded-lg bg-red-50 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-100"
        >
          Supprimer
        </button>

        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address.id)}
            className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Définir par défaut
          </button>
        )}
      </div>
    </article>
  );
}

export default AddressCard;