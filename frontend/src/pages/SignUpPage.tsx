import { useState } from "react";
import { Link } from "react-router";

const SignUpPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-14 text-center">
        <p className="text-5xl font-semibold text-onBackground">DocCat+</p>
        <p className="mt-2 font-accent text-[11px] uppercase tracking-[0.22em] text-secondary">
          Editorial Minimalism
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-xl rounded-base bg-surfaceContainer p-10">
        <h1 className="text-5xl font-semibold text-onBackground">
          Create your account
        </h1>
        <p className="mt-2 text-base text-secondary">
          Join our curated workspace environment.
        </p>
        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            alert(`Account created for ${form.name || "new user"}`);
          }}
        >
          <label className="block">
            <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-secondary">
              Full Name
            </p>
            <input
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Jan van Eyck"
              className="mt-2 w-full rounded-base border border-outlineVariant/20 bg-surfaceContainer px-4 py-3"
            />
          </label>
          <label className="block">
            <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-secondary">
              Email Address
            </p>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="name@example.com"
              className="mt-2 w-full rounded-base border border-outlineVariant/20 bg-surfaceContainer px-4 py-3"
            />
          </label>
          <label className="block">
            <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-secondary">
              Password
            </p>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              className="mt-2 w-full rounded-base border border-outlineVariant/20 bg-surfaceContainer px-4 py-3"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-base bg-primary py-3 font-semibold text-[#e2e2e2]"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-10 text-center">
          <p className="text-sm text-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-accent text-xs uppercase tracking-[0.2em] text-onBackground"
            >
              Log in instead
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-8 text-center font-accent text-[10px] uppercase tracking-[0.18em] text-secondary">
        By clicking sign up, you agree to our digital gallery&apos;s terms of
        service.
      </p>

      <footer className="mt-24 flex items-center justify-between px-8 pb-8 font-accent text-[10px] uppercase tracking-[0.18em] text-secondary">
        <p>© 2024 DocCat+, Editorial Minimalism.</p>
        <p>Privacy Terms Support</p>
      </footer>
    </div>
  );
};

export default SignUpPage;
