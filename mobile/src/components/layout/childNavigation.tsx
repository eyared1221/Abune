import { useNavigate } from "react-router-dom";

type ChildRoute = "home" | "appointments" | "messages" | "spiritual";

type ChildNavigationProps = {
  active: ChildRoute;
  onSignOut: () => Promise<void> | void;
};

const items: Array<{
  key: ChildRoute;
  label: string;
  path: string;
  icon: string;
}> = [
  { key: "home", label: "Home", path: "/child", icon: "⌂" },
  { key: "appointments", label: "Appointments", path: "/child/appointments", icon: "◷" },
  { key: "messages", label: "Messages", path: "/child/messages", icon: "✉" },
  { key: "spiritual", label: "Spiritual", path: "/child/spiritual-dates", icon: "✟" },
];

/**
 * Mobile-only navigation. Authentication stays outside this component so the
 * caller can revoke the bearer session and remove its secure device token.
 */
export function ChildNavigation({ active, onSignOut }: ChildNavigationProps) {
  const navigate = useNavigate();

  return (
    <nav aria-label="Child navigation" className="bottom-nav">
      {items.map((item) => (
        <button
          className={active === item.key ? "active" : ""}
          key={item.key}
          onClick={() => navigate(item.path)}
          type="button"
        >
          <span aria-hidden="true">{item.icon}</span>
          {item.label}
        </button>
      ))}
      <button onClick={() => void onSignOut()} type="button">
        <span aria-hidden="true">↪</span>
        Sign out
      </button>
    </nav>
  );
}
