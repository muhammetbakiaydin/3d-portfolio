import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Menu.scss"; // glass dock styles

const BUTTONS = [
  { id: "home", label: "Ana Sayfa", icon: HomeIcon },
  { id: "design", label: "Tasarım", icon: PenIcon },
  { id: "brainstorm", label: "Beyin Fırtınası", icon: BrainIcon },
];

function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M4 11.4 12 4l8 7.4v8.6a.6.6 0 0 1-.6.6H14a.6.6 0 0 1-.6-.6v-5.4H10.6V20a.6.6 0 0 1-.6.6H4.6a.6.6 0 0 1-.6-.6v-8.6Z"
        fill="currentColor"
      />
    </svg>
  );
}
function PenIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M4 17.5 15.9 5.6a2 2 0 0 1 2.8 0l1.7 1.7a2 2 0 0 1 0 2.8L8.5 22H4v-4.5Z"
        fill="currentColor"
      />
      <path d="M13.5 7.9 16.1 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function BrainIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M9.2 3A3.2 3.2 0 0 0 6 6.2v11A3.2 3.2 0 0 0 9.2 20h.3A3.5 3.5 0 0 0 16 20a3.5 3.5 0 0 0 4-3.4V9.8A3.8 3.8 0 0 0 16.2 6 3.2 3.2 0 0 0 13 3h-3.8Z"
        fill="currentColor"
      />
      <path
        d="M9 7.5v3M12 6v3.2M15 8v3M12 13v2.8M9 13.5v2M15 13.2v2.3"
        stroke="#000"
        strokeLinecap="round"
        strokeWidth="1.2"
        style={{ mixBlendMode: "overlay" }}
      />
    </svg>
  );
}

const HOLDER_EXTRA = 8; // extra width (4px padding each side for holder wrap)

const Menu = ({ active, onChange }) => {
  const [internalActive, setInternalActive] = useState(active || "home");
  const dockRef = useRef(null);
  const btnRefs = useRef({});
  const holderRef = useRef(null);

  // Sync external active prop
  useEffect(() => {
    if (active && active !== internalActive) {
      setInternalActive(active);
    }
  }, [active, internalActive]);

  // Update holder capsule position
  const updateHolder = useCallback(() => {
    const id = active || internalActive;
    const el = btnRefs.current[id];
    const holder = holderRef.current;
    if (!el || !holder || !dockRef.current) return;
    const dockRect = dockRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const left = r.left - dockRect.left - HOLDER_EXTRA / 2;
    const width = r.width + HOLDER_EXTRA;
    holder.style.setProperty("--holder-left", `${left}px`);
    holder.style.setProperty("--holder-width", `${width}px`);
  }, [active, internalActive]);

  useLayoutEffect(() => {
    updateHolder();
    window.addEventListener("resize", updateHolder);
    return () => window.removeEventListener("resize", updateHolder);
  }, [updateHolder, internalActive, active]);

  // Removed previous wobble effect; replace with holder arrival animation
  useEffect(() => {
    updateHolder();
  }, [internalActive, updateHolder]);

  // Ripple effect (duration adjusted to ~450ms spec)
  const handlePress = (e, id) => {
    setInternalActive(id);
    onChange && onChange(id);
    const btn = e.currentTarget;
    const ripple = document.createElement("span");
    ripple.className = "m-ripple";
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    requestAnimationFrame(() => ripple.classList.add("run"));
    setTimeout(() => ripple.remove(), 500);
  };

  // Pointer move tilt
  const handlePointerMove = (e) => {
    const target = e.target.closest(".m-btn");
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    target.style.setProperty("--tilt-x", `${y * 4}deg`);
    target.style.setProperty("--tilt-y", `${x * 4}deg`);
  };
  const resetTilt = (e) => {
    const target = e.target.closest(".m-btn");
    if (target) {
      target.style.setProperty("--tilt-x", `0deg`);
      target.style.setProperty("--tilt-y", `0deg`);
    }
  };

  return (
    <nav
      ref={dockRef}
      className="menu-glass-dock"
      aria-label="Main navigation"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className="dock-bg" />
      <ul className="dock-list">
        <div ref={holderRef} className="active-holder" aria-hidden="true" />
        {BUTTONS.map(({ id, label, icon: Icon }) => {
          const isActive = (active || internalActive) === id;
            return (
              <li key={id} className="dock-item">
                <button
                  ref={(r) => (btnRefs.current[id] = r)}
                  type="button"
                  className={`m-btn${isActive ? " is-active" : ""}`}
                  aria-pressed={isActive}
                  data-id={id}
                  onClick={(e) => handlePress(e, id)}
                  title={label}
                >
                  <span className="btn-inner">
                    <Icon className="btn-ic" />
                    <span className="btn-label">{label}</span>
                  </span>
                </button>
              </li>
            );
        })}
      </ul>
    </nav>
  );
};

export default Menu;
      </ul>
    </nav>
  );
};

export default Menu;
