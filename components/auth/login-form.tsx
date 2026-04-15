"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register";

type AuthResponse = {
  success: boolean;
  message?: string;
};

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: string;
  visible: boolean;
  onToggleVisible: () => void;
};

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  visible,
  onToggleVisible,
}: PasswordFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 pr-12 text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/60 focus:bg-white/10"
        />
        <button
          type="button"
          onClick={onToggleVisible}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute inset-y-0 right-3 flex items-center text-slate-300 transition hover:text-white"
        >
          {visible ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
              <path
                d="M3 3l18 18"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M10.58 10.58A2 2 0 1 0 13.42 13.42"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M9.88 5.08A10.43 10.43 0 0 1 12 4.8c5.5 0 9.67 4.37 10.92 6.07a1.45 1.45 0 0 1 0 1.66 19.7 19.7 0 0 1-3.36 3.61"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M6.11 6.11A19.67 19.67 0 0 0 1.08 11a1.45 1.45 0 0 0 0 1.66C2.33 14.36 6.5 18.8 12 18.8c1.41 0 2.72-.24 3.89-.64"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
              <path
                d="M2.5 12s3.75-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.75 6.5-9.5 6.5S2.5 12 2.5 12Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          )}
        </button>
      </div>
    </label>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isRegister = mode === "register";

  const clearMessages = () => {
    setError("");
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    clearMessages();
    setName("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const validateForm = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return "Email is required.";
    }

    if (!password) {
      return "Password is required.";
    }

    if (isRegister) {
      if (!name.trim()) {
        return "Name is required.";
      }

      if (password.length < 8) {
        return "Password must be at least 8 characters.";
      }

      if (password !== confirmPassword) {
        return "Passwords do not match.";
      }
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const validationError = validateForm();
      if (validationError) {
        throw new Error(validationError);
      }

      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isRegister ? { name: name.trim(), email: email.trim(), password } : { email: email.trim(), password }
        ),
      });

      const body = (await response.json()) as AuthResponse;

      if (!response.ok || !body.success) {
        throw new Error(body.message || `Unable to ${mode}.`);
      }

      router.refresh();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : `Unable to ${mode}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.16),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#081121_45%,_#0f172a_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_100px_rgba(2,6,23,0.6)] backdrop-blur-xl sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/80">
              Todo Atlas
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {isRegister ? "Create your account." : "Sign in to manage your tasks."}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              {isRegister
                ? "Register once, then use the same session cookie to access the protected todo dashboard."
                : "Your session is stored in an httpOnly cookie, and once you’re authenticated the todo dashboard becomes available immediately."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Security</div>
                <div className="mt-2 text-lg font-semibold text-white">JWT + cookies</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-violet-200/70">Access</div>
                <div className="mt-2 text-lg font-semibold text-white">Protected routes</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-emerald-200/70">Flow</div>
                <div className="mt-2 text-lg font-semibold text-white">Register + Login</div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,11,24,0.96),rgba(14,20,39,0.92))] p-8 shadow-[0_30px_100px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/80">
                  Authentication
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  {isRegister ? "Create account" : "Welcome back"}
                </h2>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    !isRegister ? "bg-white text-slate-950" : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    isRegister ? "bg-white text-slate-950" : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  Sign up
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {isRegister ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">Name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    placeholder="Jane Doe"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/60 focus:bg-white/10"
                  />
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/60 focus:bg-white/10"
                />
                </label>

              <PasswordField
                label="Password"
                value={password}
                onChange={setPassword}
                autoComplete={isRegister ? "new-password" : "current-password"}
                placeholder={isRegister ? "At least 8 characters" : "Your password"}
                visible={showPassword}
                onToggleVisible={() => setShowPassword((current) => !current)}
              />

              {isRegister ? (
                <PasswordField
                  label="Confirm password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  visible={showConfirmPassword}
                  onToggleVisible={() => setShowConfirmPassword((current) => !current)}
                />
              ) : null}

              {error ? (
                <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 px-5 py-4 text-sm font-semibold text-slate-950 shadow-[0_20px_50px_rgba(56,189,248,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Please wait..." : isRegister ? "Sign up" : "Sign in"}
              </button>
            </form>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Current mode
              </div>
              <div className="mt-3 text-sm text-slate-200">
                {isRegister
                  ? "Create an account and you’ll be signed in automatically."
                  : "Sign in with your account to open the todo dashboard."}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
