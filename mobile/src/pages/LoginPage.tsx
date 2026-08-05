import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authClient } from "../services";
import "../login.css";

export type MobileSession = { user?: { name?: string; email?: string; role?: string } } | null;

export function LoginPage({ configured, onSignedIn }: { configured: boolean; onSignedIn: (session: MobileSession) => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await authClient.signIn.email({ email: email.trim(), password, rememberMe });
      if (result.error) throw new Error(result.error.message || "Invalid email or password.");
      const session = (await authClient.getSession()).data as MobileSession;
      if (session?.user?.role !== "SPIRITUAL_CHILD") {
        await authClient.signOut();
        throw new Error("This mobile app is for Spiritual Child accounts.");
      }
      onSignedIn(session);
      navigate("/child", { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="web-login"><section className="web-login-card"><div className="web-login-orbit web-login-orbit-top" /><div className="web-login-orbit web-login-orbit-bottom" /><div className="web-login-content"><img alt="Abune" className="web-login-logo" src="/images/logo.png" /><h1>Welcome Back</h1><p className="web-login-subtitle">Sign in to your Abune account</p><form onSubmit={submit}>{!configured ? <p className="error">This app has not been configured with its Vercel API URL. Add VITE_API_BASE_URL, rebuild, and reinstall.</p> : null}<label className="web-login-input"><span aria-hidden="true">✉</span><input autoComplete="username" disabled={!configured} onChange={(event) => setEmail(event.target.value)} placeholder="Email or Username" required type="text" value={email} /></label><label className="web-login-input"><span aria-hidden="true">♙</span><input autoComplete="current-password" disabled={!configured} minLength={10} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required type={showPassword ? "text" : "password"} value={password} /><button aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((current) => !current)} type="button">{showPassword ? "◉" : "◌"}</button></label><div className="web-login-options"><label><input checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} type="checkbox" /> Remember me</label><button type="button">Forgot password?</button></div>{error ? <p className="error">{error}</p> : null}<button className="web-login-submit" disabled={busy || !configured} type="submit">{busy ? "Signing in…" : "Sign In"} <span>→</span></button></form><p className="web-login-register">Don't have an account? <button type="button">Register now</button></p><div className="web-login-divider"><span>✣</span></div><p className="web-login-copyright">© 2026 Abune. All rights reserved.</p></div></section></main>;
}
