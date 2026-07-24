import { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import * as authService from "../services/auth.service";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError(
        "Le lien de réinitialisation est invalide ou incomplet.",
      );
      return;
    }

    if (formData.password.length < 8) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères.",
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.resetPassword({
        token,
        password: formData.password,
      });

      setSuccess(
        response.message ||
          "Votre mot de passe a été réinitialisé avec succès.",
      );

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            message:
              "Mot de passe réinitialisé. Vous pouvez maintenant vous connecter.",
          },
        });
      }, 1800);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de réinitialiser le mot de passe.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative flex min-h-[calc(100vh-140px)] items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 shadow-2xl sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl text-white">
            🔒
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Nouveau mot de passe
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Choisissez un nouveau mot de passe sécurisé pour votre
            compte.
          </p>
        </div>

        {!token ? (
          <div className="space-y-5">
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              Le lien de réinitialisation est invalide ou incomplet.
            </div>

            <Link
              to="/forgot-password"
              className="block w-full rounded-xl bg-black px-4 py-3 text-center font-semibold text-white transition hover:bg-slate-800"
            >
              Demander un nouveau lien
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              >
                {success}
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Nouveau mot de passe
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="8 caractères minimum"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  disabled={loading || Boolean(success)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-2 focus:ring-black/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  className="absolute inset-y-0 right-4 text-sm font-medium text-slate-500 hover:text-black"
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Confirmer le mot de passe
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Répétez votre nouveau mot de passe"
                autoComplete="new-password"
                minLength={8}
                required
                disabled={loading || Boolean(success)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-2 focus:ring-black/10 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading || Boolean(success)}
              className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Réinitialisation..."
                : "Réinitialiser mon mot de passe"}
            </button>
          </form>
        )}

        <p className="mt-7 text-center text-sm text-slate-600">
          <Link
            to="/login"
            className="font-semibold text-black hover:underline"
          >
            Retour à la connexion
          </Link>
        </p>
      </div>
    </section>
  );
}

export default ResetPassword;