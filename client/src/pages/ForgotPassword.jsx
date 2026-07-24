import { useState } from "react";
import { Link } from "react-router-dom";
import * as authService from "../services/auth.service";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await authService.forgotPassword(
        email.trim().toLowerCase(),
      );

      setSuccess(
        response.message ||
          "Si un compte existe avec cette adresse e-mail, un lien de réinitialisation a été envoyé.",
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible d'envoyer le lien de réinitialisation.",
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
            🔑
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Mot de passe oublié
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Saisissez votre adresse e-mail pour recevoir un lien de
            réinitialisation.
          </p>
        </div>

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
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700"
            >
              {success}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Adresse e-mail
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="vous@exemple.com"
              autoComplete="email"
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
              ? "Envoi en cours..."
              : "Envoyer le lien de réinitialisation"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-600">
          Vous vous souvenez de votre mot de passe ?

          <Link
            to="/login"
            className="ml-2 font-semibold text-black hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </section>
  );
}

export default ForgotPassword;