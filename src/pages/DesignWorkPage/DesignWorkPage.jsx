import React from "react";
import { createPortal } from "react-dom";
import Page from "../Page";
import "./DesignWorkPage.scss";

const DesignWorkPage = () => {
  const folders = [
    "Accessibility","Accounts","AppleMediaServices","Application Scripts","Application Support",
    "Assistant","Assistants","Audio","Autosave Information","Biome","Caches","Calendars",
    "CallServices","CloudStorage","ColorPickers","Colors"
  ];
  const [selected, setSelected] = React.useState(folders[0]);

  // NEW: overlay open + drag state
  const [finderOpen, setFinderOpen] = React.useState(true);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const dragRef = React.useRef({
    startX: 0, startY: 0, baseX: 0, baseY: 0, dragging: false
  });

  React.useEffect(() => {
    // center window on first paint (match CSS width/height)
    const W = 720, H = 520;
    setPos({ x: (window.innerWidth - W) / 2, y: (window.innerHeight - H) / 2 });
  }, []);

  const onTitleDown = (e) => {
    const p = "touches" in e ? e.touches[0] : e;
    dragRef.current = {
      ...dragRef.current,
      startX: p.pageX,
      startY: p.pageY,
      baseX: pos.x,
      baseY: pos.y,
      dragging: true
    };
    document.body.classList.add("no-select");
  };

  React.useEffect(() => {
    const move = (e) => {
      if (!dragRef.current.dragging) return;
      const p = e.touches ? e.touches[0] : e;
      const x = dragRef.current.baseX + (p.pageX - dragRef.current.startX);
      const y = dragRef.current.baseY + (p.pageY - dragRef.current.startY);
      setPos({ x, y });
      e.preventDefault?.();
    };
    const up = () => {
      if (!dragRef.current.dragging) return;
      dragRef.current.dragging = false;
      document.body.classList.remove("no-select");
    };
    window.addEventListener("mousemove", move, { passive: false });
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, []);

  return (
    <>
      <Page
        requireDarkRoom={false}
        panelContent={{
          title: "Design Work",
          quote: "The best design is more than beautiful, it's meaningful.",
          content: [
            "At Daniels, design is more than just an aesthetic pursuit—it’s an experiential dialogue between form and feeling. Our ethos revolves around the interplay of light, materiality, and negative space, curating environments that breathe, evolve, and evoke emotion. With a refined design language rooted in simplicity and precision, we specialize in architectural renderings, interactive visualizations, and immersive digital experiences that allow architects to explore their designs before they are built. We approach every project with the belief that space is not just occupied but experienced and that even the subtlest design elements can shape how one feels within a structure.",
            "By leveraging the latest in 3D modeling, real-time rendering, and computational design, we craft digital narratives that articulate architectural intent with clarity. Our work spans high-fidelity concept visualizations, virtual walkthroughs, and parametric design solutions—helping architects refine their visions with both efficiency and artistry. For us, technology should serve design, not overshadow it. By carefully integrating material textures, natural lighting simulations, and spatial acoustics, we create immersive environments that resonate with the human senses.",
            "Our signature aesthetic blends modernist restraint with poetic sensitivity, balancing stark minimalism with warmth and tactility. Whether working on a monolithic concrete retreat or an airy glass pavilion, we ensure that each visualization honors the integrity of the space—allowing architects to refine not just how their buildings will look, but how they will feel. This commitment to spatial awareness, emotion-driven design, and digital craftsmanship has made us an invaluable partner in the world of contemporary architecture.",
            "At our core, we believe great architecture is not just about structures—it’s about the moments they create. Through a symphony of design principles, digital precision, and artistic intuition, we continue to push the boundaries of architectural storytelling, helping architects not just imagine spaces—but experience them before they exist.",
          ],
        }}
        imageSrc={"/images/design.webp"}
      />

      {/* Finder mock (Light Mode, straight-on, no tilt) */}
      <section className="finder-demo" aria-label="Finder mock">
        <div className="finder-window" role="dialog" aria-label="Finder — Library">
          <div className="fw-titlebar" aria-hidden="true">
            <div className="traffic">
              <span className="tl tl-red" />
              <span className="tl tl-yellow" />
              <span className="tl tl-green" />
            </div>
            <div className="fw-title">Library</div>
            <div className="fw-spacer" />
          </div>

          <div className="fw-toolbar" role="toolbar" aria-label="Window tools">
            <div className="fw-nav">
              <button className="tool" aria-label="Back">
                <svg width="14" height="14" viewBox="0 0 24 24"><path d="M15 18 9 12l6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="tool" aria-label="Forward">
                <svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div className="segmented" role="group" aria-label="View">
                <button className="seg on" aria-pressed="true">
                  <svg width="14" height="14" viewBox="0 0 24 24"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="currentColor"/></svg>
                </button>
                <button className="seg" aria-pressed="false">
                  <svg width="14" height="14" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
              </div>
            </div>
            <div className="fw-search">
              <input type="search" placeholder="Search" aria-label="Search" />
            </div>
          </div>

          <div className="fw-body">
            <aside className="fw-sidebar" aria-label="Sidebar">
              <div className="sb-section">Favorites</div>
              <ul className="sb-list">
                {["AirDrop","Recents","Applications","Downloads","Shared"].map(i=>(
                  <li key={i} className={`sb-item${i==="Downloads" ? " is-active":""}`} tabIndex={0}>
                    <span className="sb-dot" aria-hidden="true" />
                    {i}
                  </li>
                ))}
              </ul>
              <div className="sb-section">iCloud</div>
              <ul className="sb-list">
                {["iCloud Drive","Documents","Desktop"].map(i=>(
                  <li key={i} className="sb-item" tabIndex={0}>
                    <span className="sb-dot" aria-hidden="true" />
                    {i}
                  </li>
                ))}
              </ul>
            </aside>

            <main className="fw-content" aria-label="Library folders">
              <div className="grid">
                {folders.map(name=>(
                  <button
                    key={name}
                    type="button"
                    className={`grid-item${selected===name ? " is-selected":""}`}
                    onClick={()=>setSelected(name)}
                    aria-pressed={selected===name}
                    title={name}
                  >
                    <span className="folder-icon" aria-hidden="true" />
                    <span className="label">{name}</span>
                  </button>
                ))}
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* NEW: Portal overlay with frosted backdrop and draggable window */}
      {finderOpen && createPortal(
        <div
          className="finder-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Finder — Library"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setFinderOpen(false); }}
          onTouchStart={(e) => { if (e.target === e.currentTarget) setFinderOpen(false); }}
        >
          <div
            className="finder-window"
            style={{ left: pos.x, top: pos.y }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div
              className="fw-titlebar"
              onMouseDown={onTitleDown}
              onTouchStart={onTitleDown}
              aria-hidden="true"
            >
              <div className="traffic">
                <span className="tl tl-red" />
                <span className="tl tl-yellow" />
                <span className="tl tl-green" />
              </div>
              <div className="fw-title">Library</div>
              <button className="fw-close" onClick={() => setFinderOpen(false)} aria-label="Close">×</button>
            </div>

            <div className="fw-toolbar" role="toolbar" aria-label="Window tools">
              <div className="fw-nav">
                <button className="tool" aria-label="Back">
                  <svg width="14" height="14" viewBox="0 0 24 24"><path d="M15 18 9 12l6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button className="tool" aria-label="Forward">
                  <svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <div className="segmented" role="group" aria-label="View">
                  <button className="seg on" aria-pressed="true">
                    <svg width="14" height="14" viewBox="0 0 24 24"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="currentColor"/></svg>
                  </button>
                  <button className="seg" aria-pressed="false">
                    <svg width="14" height="14" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                </div>
              </div>
              <div className="fw-search">
                <input type="search" placeholder="Search" aria-label="Search" />
              </div>
            </div>

            <div className="fw-body">
              <aside className="fw-sidebar" aria-label="Sidebar">
                <div className="sb-section">Favorites</div>
                <ul className="sb-list">
                  {["AirDrop","Recents","Applications","Downloads","Shared"].map(i=>(
                    <li key={i} className={`sb-item${i==="Downloads" ? " is-active":""}`} tabIndex={0}>
                      <span className="sb-dot" aria-hidden="true" />
                      {i}
                    </li>
                  ))}
                </ul>
                <div className="sb-section">iCloud</div>
                <ul className="sb-list">
                  {["iCloud Drive","Documents","Desktop"].map(i=>(
                    <li key={i} className="sb-item" tabIndex={0}>
                      <span className="sb-dot" aria-hidden="true" />
                      {i}
                    </li>
                  ))}
                </ul>
              </aside>

              <main className="fw-content" aria-label="Library folders">
                <div className="grid">
                  {folders.map(name=>(
                    <button
                      key={name}
                      type="button"
                      className={`grid-item${selected===name ? " is-selected":""}`}
                      onClick={()=>setSelected(name)}
                      aria-pressed={selected===name}
                      title={name}
                    >
                      <span className="folder-icon" aria-hidden="true" />
                      <span className="label">{name}</span>
                    </button>
                  ))}
                </div>
              </main>
            </div>
          </div>

          {/* Minimal CSS injected here so we don't touch SCSS in this change */}
          <style>{`
            .no-select, .no-select * { user-select: none !important; }
            .finder-overlay {
              position: fixed; inset: 0; z-index: 9999;
              background: rgba(15,15,20,0.25);
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
            }
            .finder-overlay .finder-window {
              position: fixed; width: 720px; height: 520px;
              border-radius: 14px; overflow: hidden;
              background: linear-gradient(#f6f6f8, #ebebee);
              box-shadow: 0 24px 80px rgba(0,0,0,0.28), 0 6px 20px rgba(0,0,0,0.18);
              will-change: left, top;
            }
            .finder-overlay .fw-titlebar {
              display: grid; grid-template-columns: auto 1fr auto;
              align-items: center; gap: 8px;
              height: 44px; padding: 0 12px;
              background: linear-gradient(#ededf1, #e4e4e8);
              border-bottom: 1px solid #dadadd;
              cursor: move;
            }
            .finder-overlay .traffic { display: flex; gap: 8px; }
            .finder-overlay .tl { width: 12px; height: 12px; border-radius: 50%; display: inline-block; box-shadow: inset 0 1px 2px rgba(0,0,0,.15); }
            .finder-overlay .tl-red { background:#ff5f57; }
            .finder-overlay .tl-yellow { background:#febc2e; }
            .finder-overlay .tl-green { background:#28c840; }
            .finder-overlay .fw-title { text-align: center; font-weight: 600; color: #2e2e33; }
            .finder-overlay .fw-close {
              appearance: none; border: 0; background: transparent;
              font-size: 20px; line-height: 1; width: 32px; height: 32px;
              border-radius: 8px; cursor: pointer; color: #333;
            }
            .finder-overlay .fw-close:hover { background: rgba(0,0,0,.06); }
            .finder-overlay .fw-toolbar { padding: 8px 12px; background: #f0f0f3; border-bottom: 1px solid #e3e3e7; }
            .finder-overlay .fw-body { display: grid; grid-template-columns: 240px 1fr; height: calc(100% - 44px - 42px); }
            .finder-overlay .fw-sidebar { background:#f7f7fa; border-right:1px solid #ececf0; padding:16px 12px; overflow:auto; }
            .finder-overlay .fw-content { padding: 20px 24px; overflow:auto; }
            .finder-overlay .grid { display:grid; grid-template-columns: repeat(4, minmax(130px, 1fr)); gap: 40px 48px; align-content: start; }
            .finder-overlay .grid-item { background: transparent; border:0; text-align:center; cursor: pointer; position: relative; }
            .finder-overlay .grid-item.is-selected::before {
              content:""; position:absolute; inset:-12px -10px; border-radius:12px; background:rgba(0,0,0,.06);
            }
          `}</style>
        </div>,
        document.body
      )}
    </>
  );
};

export default DesignWorkPage;
