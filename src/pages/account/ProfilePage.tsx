import { useState, useEffect, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AccountLayout from "./AccountLayout";
import { useAuthStore } from "@/store/authStore";
import * as authApi from "@/api/auth.api";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit number").or(z.literal("")),
});

type ProfileValues = z.infer<typeof profileSchema>;

// ─── Reusable field ───────────────────────────────────────────────────────────

const Field: FC<{
  label: string;
  error?: string;
  children: React.ReactNode;
}> = ({ label, error, children }) => (
  <div style={{ marginBottom: 18 }}>
    <label className="acct-label">{label}</label>
    {children}
    {error && <p className="acct-error">{error}</p>}
  </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast: FC<{ message: string; type?: "success" | "error" }> = ({
  message,
  type = "success",
}) => (
  <div
    style={{
      padding: "10px 16px",
      borderRadius: 4,
      marginBottom: 20,
      background: type === "success" ? "#F0FAF4" : "#FDF0F0",
      border: `1px solid ${type === "success" ? "#C8E6D4" : "#E2C8C8"}`,
      fontFamily: "Jost",
      fontSize: 13,
      color: type === "success" ? "#5A8A6A" : "#A85050",
    }}
  >
    {message}
  </div>
);

// ─── ProfilePage ──────────────────────────────────────────────────────────────

const ProfilePage: FC = () => {
  const user = useAuthStore((s) => s.user);
  const fetchMe = useAuthStore((s) => s.fetchMe);

  const [profileMsg, setProfileMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const {
    register: regP,
    handleSubmit: handleP,
    reset: resetP,
    formState: { errors: errP, isSubmitting: submittingP },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", phone: user?.phone ?? "" },
  });

  useEffect(() => {
    if (user) resetP({ name: user.name, phone: user.phone ?? "" });
  }, [user, resetP]);

  if (!user) return null;

  const initials = user.name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // ── Profile save ───────────────────────────────────────────────────────────

  const saveProfile = async (data: ProfileValues) => {
    setProfileMsg(null);
    try {
      await authApi.updateMe({ ...data, phone: data.phone || undefined });
      await fetchMe();
      setProfileMsg({ text: "Profile updated successfully.", type: "success" });
    } catch (err: unknown) {
      setProfileMsg({
        text: err instanceof Error ? err.message : "Could not update profile.",
        type: "error",
      });
    }
  };

  return (
    <AccountLayout activeTab="profile">
      {/* Header */}
      <div className="acct-section-header">
        <p className="acct-eyebrow">✦ Profile</p>
        <h1 className="acct-page-title">Your Profile</h1>
      </div>

      <div style={{ maxWidth: 520 }}>
        {/* ── Avatar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#7B5EA7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              border: "3px solid #E2DAC8",
              flexShrink: 0,
              position: "relative",
            }}
          >
              <span
                aria-hidden="true"
                style={{
                  color: "#fff",
                  fontFamily: "Jost",
                  fontSize: 22,
                  fontWeight: 500,
                }}
              >
                {initials}
              </span>
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          <div>
            <p
              style={{
                fontFamily: "Jost",
                fontSize: 14,
                fontWeight: 500,
                color: "#1C1A17",
                margin: 0,
              }}
            >
              {user.name}
            </p>
            <p
              style={{
                fontFamily: "Jost",
                fontSize: 12,
                color: "#9A8F85",
                margin: "4px 0 0",
              }}
            >
              {user.phone ?? user.email}
            </p>
          </div>
        </div>

        {/* ── Profile form ── */}
        {profileMsg && (
          <Toast message={profileMsg.text} type={profileMsg.type} />
        )}

        <form onSubmit={handleP(saveProfile)}>
          <Field label="Full Name" error={errP.name?.message}>
            <input
              className="acct-input"
              type="text"
              autoComplete="name"
              {...regP("name")}
            />
          </Field>

          <Field label="Phone Number" error={errP.phone?.message}>
            <input
              className="acct-input"
              type="tel"
              maxLength={10}
              autoComplete="tel"
              {...regP("phone")}
            />
          </Field>

          <button
            type="submit"
            disabled={submittingP}
            className="acct-btn-gold"
          >
            {submittingP ? "Saving…" : "Save Changes"}
          </button>
        </form>

      </div>
    </AccountLayout>
  );
};

export default ProfilePage;
