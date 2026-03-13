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
      <main className="py-4">
        <p className="text-sm text-muted-foreground">Loading profile...</p>
      </main>
    )
  }

  return (
    <main className="py-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Profile</h1>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Update your name or password. Email cannot be changed.
          </p>

          <form
            className="mt-5 space-y-4"
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
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="mt-2 h-10 w-full rounded-xl border border-border bg-muted px-3 text-sm text-muted-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Name
              </label>
              <input
                type="text"
                {...register("name", {
                  setValueAs: (value) =>
                    typeof value === "string" ? value.trim() : value,
                })}
                className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
              />
              {errors.name?.message && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">
                New password
              </label>
              <input
                type="password"
                {...register("password", {
                  setValueAs: (value) =>
                    typeof value === "string" ? value.trim() : value,
                })}
                className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
              />
              {errors.password?.message && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {errors.root?.message && (
              <p className="text-sm text-destructive">{errors.root.message}</p>
            )}

            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}

            {successMessage && (
              <p className="text-sm text-foreground">{successMessage}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="submit"
                className="h-10 rounded-xl border border-border px-4 text-sm font-medium transition hover:bg-muted"
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
