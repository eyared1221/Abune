"use client";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <button
      className={className}
      onClick={() => {
        window.localStorage.removeItem("spiritual-father-session");
        window.localStorage.removeItem(
          "spiritual-father-persistent-session",
        );
        window.sessionStorage.removeItem("spiritual-father-session");
        window.location.assign("/login");
      }}
      type="button"
    >
      Logout
    </button>
  );
}
