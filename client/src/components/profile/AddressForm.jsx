import { useState } from "react";

import {
  createAddress,
  updateAddress,
} from "../../services/address.service";

const defaultForm = {
  label: "",
  type: "SHIPPING",
  firstname: "",
  lastname: "",
  company: "",
  street: "",
  street2: "",
  postalCode: "",
  city: "",
  country: "France",
  phone: "",
  isDefault: false,
};

function AddressForm({
  address,
  onSuccess,
  onCancel,
}) {
  const [form, setForm] = useState(
    address || defaultForm
  );

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      if (address) {
        await updateAddress(address.id, form);
      } else {
        await createAddress(form);
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid gap-5 md:grid-cols-2">

        <div>
          <label className="mb-2 block font-medium">
            Nom de l'adresse
          </label>

          <input
            name="label"
            value={form.label}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            placeholder="Maison"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Type
          </label>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          >
            <option value="SHIPPING">
              Livraison
            </option>

            <option value="BILLING">
              Facturation
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Prénom
          </label>

          <input
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Nom
          </label>

          <input
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">
            Entreprise
          </label>

          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">
            Adresse
          </label>

          <input
            name="street"
            value={form.street}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">
            Complément
          </label>

          <input
            name="street2"
            value={form.street2}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Code postal
          </label>

          <input
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Ville
          </label>

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Pays
          </label>

          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Téléphone
          </label>

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isDefault"
          checked={form.isDefault}
          onChange={handleChange}
        />

        Définir comme adresse principale
      </label>

      <div className="flex justify-end gap-4">

        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border px-5 py-3"
        >
          Annuler
        </button>

        <button
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading
            ? "Enregistrement..."
            : address
            ? "Modifier"
            : "Ajouter"}
        </button>

      </div>
    </form>
  );
}

export default AddressForm;