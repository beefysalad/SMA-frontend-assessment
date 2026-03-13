import Link from "next/link"

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Join the workspace and start adding products.
            </p>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Alex Rivera"
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="button"
              className="h-11 w-full rounded-xl bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Create account
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
