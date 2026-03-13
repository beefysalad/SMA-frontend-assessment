"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, type ProfileFormValues } from "@/lib/schemas/profile"
import { useUpdateProfileMutation, getAuthErrorMessage } from "@/hooks/useAuthMutations"
import { useAuthStore } from "@/store/authStore"

export default function ProfilePage() {
  const authStore = useAuthStore()
  const user = authStore.user
  const updateMutation = useUpdateProfileMutation()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      password: "",
    },
  })

  useEffect(() => {
    reset({ name: user?.name || "", password: "" })
  }, [user?.name, reset])

  if (!user) {
    return (
      <main className="py-8">
        <p className="text-sm text-muted-foreground">Loading profile...</p>
      </main>
    )
  }

  return (
    <main className="py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Account
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your name or password. Email cannot be changed.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <form
            className="space-y-5"
            onSubmit={handleSubmit((values) => {
              setSubmitError(null)
              setSuccessMessage(null)

              const payload = {
                name: values.name,
                password: values.password,
              }

              updateMutation.mutate(payload, {
                onSuccess: (data) => {
                  authStore.setUser(data.user)
                  setSuccessMessage("Profile updated.")
                  reset({ name: data.user.name || "", password: "" })
                },
                onError: (error) => {
                  setSubmitError(
                    getAuthErrorMessage(error, "Failed to update profile.")
                  )
                },
              })
            })}
          >
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <label className="text-xs font-medium text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-muted-foreground"
              />
            </div>

            <div className="rounded-xl border border-border/60 bg-background p-4">
              <label className="text-xs font-medium text-muted-foreground">
                Name
              </label>
              <input
                type="text"
                {...register("name", {
                  setValueAs: (value) =>
                    typeof value === "string" ? value.trim() : value,
                })}
                className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm transition outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
              />
              {errors.name?.message && (
                <p className="mt-2 text-sm text-foreground font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-border/60 bg-background p-4">
              <label className="text-xs font-medium text-muted-foreground">
                New password
              </label>
              <input
                type="password"
                {...register("password", {
                  setValueAs: (value) =>
                    typeof value === "string" ? value.trim() : value,
                })}
                className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm transition outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
              />
              {errors.password?.message && (
                <p className="mt-2 text-sm text-foreground font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {errors.root?.message && (
              <p className="text-sm text-foreground font-medium">
                {errors.root.message}
              </p>
            )}

            {submitError && (
              <p className="text-sm text-foreground font-medium">
                {submitError}
              </p>
            )}

            {successMessage && (
              <p className="text-sm text-foreground">{successMessage}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="submit"
                className="h-10 rounded-xl border border-foreground bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
