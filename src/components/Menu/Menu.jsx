import React, { useState } from "react";
import "./Menu.scss";
import { useNavigate } from "react-router-dom"; // added

const ITEMS = [
  { id: "home", label: "Ana Sayfa", icon: HomeIcon },
  { id: "design", label: "Tasarım", icon: PenIcon },
  { id: "brain", label: "Beyin Fırtınası", icon: BrainIcon },
];

export default function Menu({ active: initial = "home", onChange }) {
  const [active, setActive] = useState(initial);
  const navigate = useNavigate(); // added

  const PATHS = {
    design: "/design-work",
    // you can add others later
  };

  const handleClick = (id) => {
    setActive(id);
    onChange && onChange(id);
    if (PATHS[id]) navigate(PATHS[id]); // navigate for mapped ids
  };

  return (
    <nav className="menu-glass-dock" role="navigation" aria-label="Main navigation">
      <ul className="dock-list" style={{padding: "8px 8px"}}>
        {ITEMS.map(({ id, label, icon: Icon }) => (
          <li key={id} className="dock-item">
            <button
              type="button"
              className={`m-btn ${active === id ? "is-active" : ""}`}
              aria-pressed={active === id}
              onClick={() => handleClick(id)}
            >
              <span className="btn-ic" aria-hidden="true"><Icon /></span>
              <span className="btn-label">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* --- Minimal solid icons --- */
function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3.172 3 10v10a1 1 0 0 0 1 1h6v-6h4v6h6a1 1 0 0 0 1-1V10l-9-6.828Z"/>
    </svg>
  );
}
function PenIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm18.71-11.04a1.004 1.004 0 0 0 0-1.42l-2.5-2.5a1.004 1.004 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.99-1.66Z"/>
    </svg>
  );
}
function BrainIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 4a3 3 0 0 0-3 3v.5A3.5 3.5 0 0 0 2 11a3 3 0 0 0 3 3v1a4 4 0 0 0 4 4h1V5.5A1.5 1.5 0 0 0 8.5 4H8Zm8 0h-.5A1.5 1.5 0 0 0 14 5.5V19h1a4 4 0 0 0 4-4v-1a3 3 0 0 0 3-3 3.5 3.5 0 0 0-3-3.5V7a3 3 0 0 0-3-3Z"/>
    </svg>
  );
}