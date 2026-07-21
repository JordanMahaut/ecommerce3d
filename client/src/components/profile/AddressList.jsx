import { useEffect, useState } from "react";

import AddressCard from "./AddressCard";
import AddressModal from "./AddressModal";

import {
  getAddresses,
  deleteAddress,
  setDefaultAddress,
} from "../../services/address.service";

function AddressList() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  async function loadAddresses() {
    try {
      setLoading(true);

      const data = await getAddresses();

      setAddresses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Supprimer cette adresse ?")) return;

    try {
      await deleteAddress(id);

      loadAddresses();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDefault(id) {
    try {
      await setDefaultAddress(id);

      loadAddresses();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEdit(address) {
    setSelectedAddress(address);
    setIsModalOpen(true);
  }

  function handleCreate() {
    setSelectedAddress(null);
    setIsModalOpen(true);
  }

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-indigo-600">
              Mes coordonnées
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Mes adresses
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Gérez vos adresses de livraison et de facturation.
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            + Ajouter
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-slate-500">
            Chargement...
          </div>
        ) : addresses.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 py-14 text-center">
            <div className="text-5xl">📍</div>

            <h3 className="mt-4 text-xl font-bold">
              Aucune adresse enregistrée
            </h3>

            <p className="mt-2 text-slate-500">
              Ajoutez votre première adresse de livraison.
            </p>

            <button
              onClick={handleCreate}
              className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Ajouter une adresse
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetDefault={handleDefault}
              />
            ))}
          </div>
        )}
      </section>

      <AddressModal
        open={isModalOpen}
        address={selectedAddress}
        onClose={() => {
          setIsModalOpen(false);
          loadAddresses();
        }}
      />
    </>
  );
}

export default AddressList;