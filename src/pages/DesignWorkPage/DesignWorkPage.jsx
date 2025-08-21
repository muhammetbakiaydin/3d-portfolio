import React from "react";
import { createPortal } from "react-dom";
import "./DesignWorkPage.scss";

const DesignWorkPage = () => {
  const folders = [
    "Accessibility", "Application Support", "Biome"
  ];
  const [selected, setSelected] = React.useState(folders[0]);

  // Library window state
  const [finderOpen, setFinderOpen] = React.useState(true);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const dragRef = React.useRef({
    startX: 0, startY: 0, baseX: 0, baseY: 0, dragging: false
  });

  // Portfolio windows state
  const [portfolioWindows, setPortfolioWindows] = React.useState([]);
  const [topZIndex, setTopZIndex] = React.useState(10000);
  const portfolioDragRef = React.useRef({});

  React.useEffect(() => {
    // center window on first paint (match CSS width/height)
    const W = 720, H = 520;
    setPos({ x: (window.innerWidth - W) / 2, y: (window.innerHeight - H) / 2 });
  }, []);

  // Library window drag handlers
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

  // Portfolio window handlers
  const openPortfolioWindow = (folderName) => {
    const id = Date.now();
    const newWindow = {
      id,
      title: "Portfolio",
      folder: folderName,
      pos: { 
        x: (window.innerWidth - 960) / 2 + portfolioWindows.length * 30, 
        y: (window.innerHeight - 640) / 2 + portfolioWindows.length * 30 
      },
      zIndex: topZIndex + 1
    };
    setPortfolioWindows(prev => [...prev, newWindow]);
    setTopZIndex(prev => prev + 1);
  };

  const closePortfolioWindow = (id) => {
    setPortfolioWindows(prev => prev.filter(w => w.id !== id));
  };

  const bringToFront = (id) => {
    const newZIndex = topZIndex + 1;
    setPortfolioWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: newZIndex } : w
    ));
    setTopZIndex(newZIndex);
  };

  const onPortfolioTitleDown = (e, id) => {
    const p = "touches" in e ? e.touches[0] : e;
    const window = portfolioWindows.find(w => w.id === id);
    if (!window) return;
    
    portfolioDragRef.current[id] = {
      startX: p.pageX,
      startY: p.pageY,
      baseX: window.pos.x,
      baseY: window.pos.y,
      dragging: true
    };
    document.body.classList.add("no-select");
    bringToFront(id);
  };

  React.useEffect(() => {
    const move = (e) => {
      const p = e.touches ? e.touches[0] : e;
      Object.keys(portfolioDragRef.current).forEach(id => {
        const drag = portfolioDragRef.current[id];
        if (!drag?.dragging) return;
        
        const x = drag.baseX + (p.pageX - drag.startX);
        const y = drag.baseY + (p.pageY - drag.startY);
        
        setPortfolioWindows(prev => prev.map(w =>
          w.id === parseInt(id) ? { ...w, pos: { x, y } } : w
        ));
      });
      if (Object.values(portfolioDragRef.current).some(d => d?.dragging)) {
        e.preventDefault?.();
      }
    };

    const up = () => {
      Object.keys(portfolioDragRef.current).forEach(id => {
        if (portfolioDragRef.current[id]) {
          portfolioDragRef.current[id].dragging = false;
        }
      });
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
  }, [portfolioWindows]);

  return (
    <>
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
                      onClick={() => {
                        setSelected(name);
                        openPortfolioWindow(name);
                      }}
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
              border-radius: 12px; overflow: hidden;
              background: linear-gradient(#f6f6f8, #ebebee);
              box-shadow: 0 24px 80px rgba(0,0,0,0.28), 0 6px 20px rgba(0,0,0,0.18);
              will-change: left, top;
              font-family: -apple-system, system-ui, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              -webkit-font-smoothing: antialiased;
              text-rendering: optimizeLegibility;
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
            .finder-overlay .fw-title { text-align: center; font-weight: 600; font-size: 14px; color: #2e2e33; }
            .finder-overlay .fw-close {
              appearance: none; border: 0; background: transparent;
              font-size: 20px; line-height: 1; width: 32px; height: 32px;
              border-radius: 8px; cursor: pointer; color: #333;
            }
            .finder-overlay .fw-close:hover { background: rgba(0,0,0,.06); }
            .finder-overlay .fw-toolbar { 
              padding: 8px 12px; 
              background: #f0f0f3; 
              border-bottom: 1px solid #e3e3e7; 
              display: flex; 
              align-items: center; 
            }
            .finder-overlay .fw-nav { display: flex; align-items: center; gap: 8px; }
            .finder-overlay .tool {
              appearance: none; border: 0; background: transparent;
              width: 28px; height: 28px; border-radius: 6px; cursor: pointer;
              display: flex; align-items: center; justify-content: center;
              color: #666;
            }
            .finder-overlay .tool:hover { background: rgba(0,0,0,.06); }
            .finder-overlay .segmented { display: flex; border-radius: 6px; overflow: hidden; margin-left: 12px; }
            .finder-overlay .seg {
              appearance: none; border: 0; background: #fff;
              width: 32px; height: 24px; cursor: pointer;
              display: flex; align-items: center; justify-content: center;
              color: #666; border-right: 1px solid #ddd;
            }
            .finder-overlay .seg:last-child { border-right: 0; }
            .finder-overlay .seg.on { background: #007aff; color: white; }
            .finder-overlay .fw-body { display: grid; grid-template-columns: 240px 1fr; height: calc(100% - 44px - 42px); }
            .finder-overlay .fw-sidebar { background:#f7f7fa; border-right:1px solid #ececf0; padding:16px 12px; overflow:auto; }
            .finder-overlay .sb-section { 
              font-size: 11px; font-weight: 600; color: #8e8e93; 
              text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; 
            }
            .finder-overlay .sb-list { list-style: none; margin: 0 0 20px 0; padding: 0; }
            .finder-overlay .sb-item { 
              display: flex; align-items: center; gap: 8px; 
              padding: 4px 8px; border-radius: 6px; cursor: pointer;
              font-size: 13px; font-weight: 500; color: #1d1d1f;
            }
            .finder-overlay .sb-item:hover { background: rgba(0,0,0,.04); }
            .finder-overlay .sb-item.is-active { background: #007aff; color: white; }
            .finder-overlay .sb-dot { width: 8px; height: 8px; border-radius: 50%; background: #888; }
            .finder-overlay .fw-content { padding: 20px 24px; overflow:auto; }
            .finder-overlay .grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 40px 48px; align-content: start; }
            .finder-overlay .grid-item { 
              background: transparent; border:0; text-align:center; cursor: pointer; 
              position: relative; padding: 12px; border-radius: 8px;
              display: flex; flex-direction: column; align-items: center; gap: 8px;
            }
            .finder-overlay .grid-item:hover { background: rgba(0,0,0,.03); }
            .finder-overlay .grid-item.is-selected { background: rgba(0,0,0,.06); }
            .finder-overlay .folder-icon {
              width: 64px; height: 64px; background: #4A90E2;
              border-radius: 8px; display: block;
              position: relative;
            }
            .finder-overlay .folder-icon::before {
              content: "📁"; font-size: 48px; 
              position: absolute; top: 50%; left: 50%;
              transform: translate(-50%, -50%);
            }
            .finder-overlay .label { 
              font-size: 12px; font-weight: 500; color: #1d1d1f;
              max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            }
          `}</style>
        </div>,
        document.body
      )}

      {/* Portfolio Windows */}
      {portfolioWindows.map(window => createPortal(
        <div
          key={window.id}
          className="portfolio-window"
          style={{ 
            left: window.pos.x, 
            top: window.pos.y,
            zIndex: window.zIndex
          }}
          onMouseDown={() => bringToFront(window.id)}
          onTouchStart={() => bringToFront(window.id)}
        >
          <div
            className="pw-titlebar"
            onMouseDown={(e) => onPortfolioTitleDown(e, window.id)}
            onTouchStart={(e) => onPortfolioTitleDown(e, window.id)}
          >
            <div className="traffic">
              <span className="tl tl-red" />
              <span className="tl tl-yellow" />
              <span className="tl tl-green" />
            </div>
            <div className="pw-title">{window.title}</div>
            <button 
              className="pw-close" 
              onClick={() => closePortfolioWindow(window.id)} 
              aria-label="Close"
            >×</button>
          </div>

          <div className="pw-content">
            <div className="iframe-wrapper">
              <iframe
                src="https://www.behance.net/embed/project/227112863?ilo0=1"
                allowFullScreen
                loading="lazy"
                frameBorder="0"
                allow="clipboard-write"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Behance Portfolio"
              />
            </div>
          </div>

          <style>{`
            .portfolio-window {
              position: fixed; 
              width: 960px; 
              height: 640px;
              border-radius: 12px; 
              overflow: hidden;
              background: #fff;
              box-shadow: 0 24px 80px rgba(0,0,0,0.28), 0 6px 20px rgba(0,0,0,0.18);
              font-family: -apple-system, system-ui, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              -webkit-font-smoothing: antialiased;
              text-rendering: optimizeLegibility;
            }
            .pw-titlebar {
              display: grid; 
              grid-template-columns: auto 1fr auto;
              align-items: center; 
              gap: 8px;
              height: 44px; 
              padding: 0 12px;
              background: linear-gradient(#ededf1, #e4e4e8);
              border-bottom: 1px solid #dadadd;
              cursor: move;
            }
            .pw-title { 
              text-align: center; 
              font-weight: 600; 
              font-size: 14px; 
              color: #2e2e33; 
            }
            .pw-close {
              appearance: none; 
              border: 0; 
              background: transparent;
              font-size: 20px; 
              line-height: 1; 
              width: 32px; 
              height: 32px;
              border-radius: 8px; 
              cursor: pointer; 
              color: #333;
            }
            .pw-close:hover { 
              background: rgba(0,0,0,.06); 
            }
            .pw-content {
              height: calc(100% - 44px);
              padding: 0;
            }
            .iframe-wrapper {
              position: relative;
              width: 100%;
              height: 100%;
            }
            .iframe-wrapper iframe {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border: 0;
            }
          `}</style>
        </div>,
        document.body
      ))}
    </>
  );
};

export default DesignWorkPage;