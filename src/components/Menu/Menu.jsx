import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Menu.scss";

// Icons (unchanged originals adapted to standalone components)
function HomeIcon(props){return (<svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M4 11.4 12 4l8 7.4v8.6a.6.6 0 0 1-.6.6H14a.6.6 0 0 1-.6-.6v-5.4H10.6V20a.6.6 0 0 1-.6.6H4.6a.6.6 0 0 1-.6-.6v-8.6Z" fill="currentColor"/></svg>);}
function PenIcon(props){return (<svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M4 17.5 15.9 5.6a2 2 0 0 1 2.8 0l1.7 1.7a2 2 0 0 1 0 2.8L8.5 22H4v-4.5Z" fill="currentColor"/><path d="M13.5 7.9 16.1 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>);}
function BrainIcon(props){return (<svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M9.2 3A3.2 3.2 0 0 0 6 6.2v11A3.2 3.2 0 0 0 9.2 20h.3A3.5 3.5 0 0 0 16 20a3.5 3.5 0 0 0 4-3.4V9.8A3.8 3.8 0 0 0 16.2 6 3.2 3.2 0 0 0 13 3h-3.8Z" fill="currentColor"/><path d="M9 7.5v3M12 6v3.2M15 8v3M12 13v2.8M9 13.5v2M15 13.2v2.3" stroke="#000" strokeLinecap="round" strokeWidth="1.2" style={{mixBlendMode:"overlay"}}/></svg>);}

const APPS = [
  { id: "home", label: "Ana Sayfa", icon: HomeIcon },
  { id: "design", label: "Tasarım", icon: PenIcon },
  { id: "brain", label: "Beyin Fırtınası", icon: BrainIcon }
];

const lerp = (a,b,t)=>a+(b-a)*t;
const COS_PI_2 = Math.PI/2;

export default function Menu({
  active: controlledActive,
  onChange,
  openApps = ["home","design"],   // ids that show running indicator
  autoHide = false
}) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [uncontrolledActive,setUncontrolledActive] = useState(controlledActive || "home");
  const active = controlledActive ?? uncontrolledActive;

  const dockRef = useRef(null);
  const btnRefs = useRef({});
  const scalesRef = useRef([]);
  const targetsRef = useRef([]);
  const rafRef = useRef();
  const pointerXRef = useRef(null);
  const baseSizeRef = useRef(64); // will read from CSS computed
  const effectWidthRef = useRef(300);
  const maxScaleRef = useRef(1.8);

  // Responsive parameters
  const recalcParams = useCallback(()=>{
    const w = window.innerWidth;
    if (w <= 480){
      baseSizeRef.current = 48;
      effectWidthRef.current = 200;
      maxScaleRef.current = 1.5;
    } else if (w <= 900){
      baseSizeRef.current = 56;
      effectWidthRef.current = 260;
      maxScaleRef.current = 1.6;
    } else {
      baseSizeRef.current = 72;
      effectWidthRef.current = 300;
      maxScaleRef.current = 1.8;
    }
  },[]);
  useEffect(()=>{
    recalcParams();
    window.addEventListener("resize", recalcParams);
    return ()=>window.removeEventListener("resize", recalcParams);
  },[recalcParams]);

  // Initialize scale arrays
  useEffect(()=>{
    scalesRef.current = APPS.map(()=>1);
    targetsRef.current = APPS.map(()=>1);
  },[]);

  // Pointer handlers
  const handlePointerMove = e=>{
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    pointerXRef.current = e.clientX - rect.left;
  };
  const handlePointerLeave = ()=>{
    pointerXRef.current = null;
  };

  // Magnification loop
  useEffect(()=>{
    if (prefersReducedMotion) return; // disable magnification
    const loop = ()=>{
      const px = pointerXRef.current;
      const base = baseSizeRef.current;
      const effect = effectWidthRef.current;
      const maxScale = maxScaleRef.current;
      let totalWidth = 0;
      // compute target scales
      APPS.forEach((app, i)=>{
        let target = 1;
        if (px != null && btnRefs.current[app.id]){
          const btn = btnRefs.current[app.id];
            // center X based on current layout (we will reposition soon)
          const cx = btn._dockCenterX ?? (btn.getBoundingClientRect().width/2 + totalWidth);
          const dist = Math.abs(px - cx);
          const norm = Math.min(dist / (effect/2), 1);
          target = 1 + (maxScale - 1) * Math.cos(norm * COS_PI_2);
        }
        targetsRef.current[i] = target;
      });
      // ease scales
      const speed = 0.18;
      scalesRef.current = scalesRef.current.map((s,i)=>lerp(s, targetsRef.current[i], speed));
      // layout pass: compute widths then assign left positions
      let x = 0;
      APPS.forEach((app,i)=>{
        const scale = scalesRef.current[i];
        const width = base * scale;
        const gap = 8; // dynamic spacing baseline
        const btn = btnRefs.current[app.id];
        if (btn){
          btn.style.transform = `translateZ(0) translateY(0) scale(${scale})`;
          btn.style.left = `${x}px`;
          btn.style.width = `${width}px`;
          btn.style.height = `${width}px`;
          btn._dockCenterX = x + width/2;
          // shadow intensity with scale
          const shadowFactor = (scale-1)/(maxScale-1 || 1);
          const shadowY = 2 + shadowFactor*4;
            btn.style.filter = `drop-shadow(0 ${shadowY}px ${6 + shadowFactor*10}px rgba(0,0,0,${0.35 + shadowFactor*0.15}))`;
        }
        x += width + gap;
      });
      if (dockRef.current){
        dockRef.current.style.setProperty("--dock-inner-width", `${x - 8}px`);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(rafRef.current);
  },[prefersReducedMotion]);

  // Active change
  const handleActivate = (id)=>{
    if (id !== active){
      setUncontrolledActive(id);
      onChange && onChange(id);
    }
        // (removed incomplete 'if' statement)
      }
    
      return (
        <nav
          className="menu-dock"
          ref={dockRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{ position: "relative" }}
        >
          <div className="menu-dock-inner" style={{ width: "var(--dock-inner-width)" }}>
            {APPS.map((app, i) => {
              const Icon = app.icon;
              const isActive = active === app.id;
              const isOpen = openApps.includes(app.id);
              return (
                <button
                  key={app.id}
                  ref={el => (btnRefs.current[app.id] = el)}
                  className={`menu-dock-btn${isActive ? " active" : ""}${isOpen ? " open" : ""}`}
                  aria-label={app.label}
                  onClick={() => handleActivate(app.id)}
                  tabIndex={0}
                  type="button"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: baseSizeRef.current,
                    height: baseSizeRef.current,
                    background: "none",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    transition: prefersReducedMotion ? "none" : "box-shadow 0.2s"
                  }}
                >
                  <Icon
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "block"
                    }}
                  />
                  <span className="menu-dock-label">{app.label}</span>
                  {isOpen && <span className="menu-dock-indicator" />}
                </button>
              );
            })}
          </div>
        </nav>
      );
    }
