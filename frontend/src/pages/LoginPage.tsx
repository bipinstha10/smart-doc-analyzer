import { useState } from "react";
import { Link } from "react-router";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto mt-24 max-w-xl rounded-base bg-surfaceContainer p-10">
        <h1 className="text-5xl font-semibold text-onBackground">
          Log in to DocCat+
        </h1>
        <p className="mt-2 font-accent text-[11px] uppercase tracking-[0.22em] text-secondary">
          Editorial Content Management
        </p>
        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            alert(`Login submitted for ${email || "unknown user"}`);
          }}
        >
          <label className="block">
            <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-secondary">
              Work Email
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="mt-2 w-full rounded-base border border-outlineVariant/20 bg-surfaceContainer px-4 py-3"
            />
          </label>
          <label className="block">
            <div className="flex items-center justify-between">
              <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-secondary">
                Password
              </p>
              <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-secondary">
                Forgot?
              </span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-base border border-outlineVariant/20 bg-surfaceContainer px-4 py-3"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-base bg-primary py-3 font-accent text-xs uppercase tracking-[0.18em] text-[#e2e2e2]"
          >
            Log In
          </button>
        </form>
        <div className="mt-10 text-center">
          <p className="text-sm text-secondary">New to the platform?</p>
          <Link
            to="/signup"
            className="mt-2 inline-block font-accent text-xs uppercase tracking-[0.2em] text-onBackground"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
