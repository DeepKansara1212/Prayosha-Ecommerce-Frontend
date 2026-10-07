import { useEffect, useRef, useState, type FC } from "react";

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => Promise<void>;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, string | number>,
          ) => void;
        };
      };
    };
  }
}

const GOOGLE_SCRIPT_ID = "google-identity-services";

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ onCredential }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  // Held in a ref so the render effect below doesn't depend on the callback's
  // identity — callers pass an inline arrow, which would otherwise tear down and
  // re-render the Google button on every parent re-render.
  const onCredentialRef = useRef(onCredential);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(!!window.google);
  // A build-time constant, not something that changes at runtime — checked
  // during render rather than stored in state.
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    // ready already reflects window.google via the lazy useState initializer
    // above — nothing can set window.google between that initializer and this
    // effect running, so there is nothing to update here if it's already set.
    if (window.google) return;

    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    const script =
      existing instanceof HTMLScriptElement
        ? existing
        : document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setReady(true);
    script.onerror = () => setError("Google sign-in is unavailable right now.");
    if (!existing) document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!ready || !window.google || !buttonRef.current || !clientId) return;

    buttonRef.current.replaceChildren();
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        setError("");
        void onCredentialRef
          .current(response.credential)
          .catch((err: unknown) => {
            setError(
              err instanceof Error
                ? err.message
                : "Google sign-in failed. Please try again.",
            );
          });
      },
    });
    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      width: 320,
      text: "signin_with",
    });
  }, [ready, clientId]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div ref={buttonRef} />
      {!clientId && (
        <p
          role="alert"
          style={{
            fontFamily: "Jost, system-ui, sans-serif",
            fontSize: 12,
            color: "#A85050",
            margin: 0,
            textAlign: "center",
          }}
        >
          Google sign-in is not configured.
        </p>
      )}
      {error && (
        <p
          role="alert"
          style={{
            fontFamily: "Jost, system-ui, sans-serif",
            fontSize: 12,
            color: "#A85050",
            margin: 0,
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default GoogleSignInButton;
