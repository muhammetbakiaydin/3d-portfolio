import React from "react";
import { createPortal } from "react-dom";
import "./DesignWorkPage.scss";

const DesignWorkPage = () => {
  const folders = [
    "Behance Portfolyo", "Arşiv", "İletişim"
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

  // Finder windows state (for Archive and Contact)
  const [finderWindows, setFinderWindows] = React.useState([]);
  const finderDragRef = React.useRef({});

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

  // Handle folder clicks
  const handleFolderClick = (folderName) => {
    setSelected(folderName);
    
    if (folderName === "Behance Portfolyo") {
      openPortfolioWindow(folderName);
    } else if (folderName === "Arşiv") {
      openFinderWindow(folderName, "archive");
    } else if (folderName === "İletişim") {
      openFinderWindow(folderName, "contact");
    }
  };

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

  // Finder window handlers (for Archive and Contact)
  const openFinderWindow = (folderName, type) => {
    const id = Date.now();
    const newWindow = {
      id,
      title: folderName,
      type,
      pos: { 
        x: (window.innerWidth - 720) / 2 + finderWindows.length * 30, 
        y: (window.innerHeight - 520) / 2 + finderWindows.length * 30 
      },
      zIndex: topZIndex + 1
    };
    setFinderWindows(prev => [...prev, newWindow]);
    setTopZIndex(prev => prev + 1);
  };

  const closeFinderWindow = (id) => {
    setFinderWindows(prev => prev.filter(w => w.id !== id));
  };

  const bringFinderToFront = (id) => {
    const newZIndex = topZIndex + 1;
    setFinderWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: newZIndex } : w
    ));
    setTopZIndex(newZIndex);
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

  const onFinderTitleDown = (e, id) => {
    const p = "touches" in e ? e.touches[0] : e;
    const window = finderWindows.find(w => w.id === id);
    if (!window) return;
    
    finderDragRef.current[id] = {
      startX: p.pageX,
      startY: p.pageY,
      baseX: window.pos.x,
      baseY: window.pos.y,
      dragging: true
    };
    document.body.classList.add("no-select");
    bringFinderToFront(id);
  };

  React.useEffect(() => {
    const move = (e) => {
      const p = e.touches ? e.touches[0] : e;
      
      // Handle portfolio window dragging
      Object.keys(portfolioDragRef.current).forEach(id => {
        const drag = portfolioDragRef.current[id];
        if (!drag?.dragging) return;
        
        const x = drag.baseX + (p.pageX - drag.startX);
        const y = drag.baseY + (p.pageY - drag.startY);
        
        setPortfolioWindows(prev => prev.map(w =>
          w.id === parseInt(id) ? { ...w, pos: { x, y } } : w
        ));
      });

      // Handle finder window dragging
      Object.keys(finderDragRef.current).forEach(id => {
        const drag = finderDragRef.current[id];
        if (!drag?.dragging) return;
        
        const x = drag.baseX + (p.pageX - drag.startX);
        const y = drag.baseY + (p.pageY - drag.startY);
        
        setFinderWindows(prev => prev.map(w =>
          w.id === parseInt(id) ? { ...w, pos: { x, y } } : w
        ));
      });

      const anyDragging = [
        ...Object.values(portfolioDragRef.current),
        ...Object.values(finderDragRef.current)
      ].some(d => d?.dragging);
      
      if (anyDragging) {
        e.preventDefault?.();
      }
    };

    const up = () => {
      Object.keys(portfolioDragRef.current).forEach(id => {
        if (portfolioDragRef.current[id]) {
          portfolioDragRef.current[id].dragging = false;
        }
      });
      Object.keys(finderDragRef.current).forEach(id => {
        if (finderDragRef.current[id]) {
          finderDragRef.current[id].dragging = false;
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
  }, [portfolioWindows, finderWindows]);

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
              <div className="fw-title">Baki Aydin - Klasörü</div>
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
                    <li 
                      key={i} 
                      className={`sb-item${i==="Downloads" ? " is-active":""}`} 
                      tabIndex={0}
                      onClick={() => {/* Add functionality if needed */}}
                    >
                      <span className="sb-dot" aria-hidden="true" />
                      {i}
                    </li>
                  ))}
                </ul>
                <div className="sb-section">iCloud</div>
                <ul className="sb-list">
                  {["iCloud Drive","Documents","Desktop"].map(i=>(
                    <li 
                      key={i} 
                      className="sb-item" 
                      tabIndex={0}
                      onClick={() => {/* Add functionality if needed */}}
                    >
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
                      onClick={() => handleFolderClick(name)}
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

      {/* Archive and Contact Finder Windows */}
      {finderWindows.map(window => createPortal(
        <div
          key={window.id}
          className="secondary-finder-window"
          style={{ 
            left: window.pos.x, 
            top: window.pos.y,
            zIndex: window.zIndex
          }}
          onMouseDown={() => bringFinderToFront(window.id)}
          onTouchStart={() => bringFinderToFront(window.id)}
        >
          <div
            className="sfw-titlebar"
            onMouseDown={(e) => onFinderTitleDown(e, window.id)}
            onTouchStart={(e) => onFinderTitleDown(e, window.id)}
          >
            <div className="traffic">
              <span className="tl tl-red" />
              <span className="tl tl-yellow" />
              <span className="tl tl-green" />
            </div>
            <div className="sfw-title">{window.title}</div>
            <button 
              className="sfw-close" 
              onClick={() => closeFinderWindow(window.id)} 
              aria-label="Close"
            >×</button>
          </div>

          <div className="sfw-toolbar">
            <div className="sfw-nav">
              <button className="tool" aria-label="Back">
                <svg width="14" height="14" viewBox="0 0 24 24"><path d="M15 18 9 12l6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="tool" aria-label="Forward">
                <svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>

          <div className="sfw-content">
            {window.type === "archive" && (
              <div className="archive-content">
                <div className="grid">
                  {["Proje 1", "Proje 2", "Proje 3", "Proje 4", "Proje 5", "Proje 6"].map(name => (
                    <div key={name} className="grid-item">
                      <span className="folder-icon" aria-hidden="true" />
                      <span className="label">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {window.type === "contact" && (
              <div className="contact-content">
                <h2>İletişim</h2>
                <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group">
                    <label htmlFor="name">İsim</label>
                    <input type="text" id="name" name="name" placeholder="Adınız" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">E-posta</label>
                    <input type="email" id="email" name="email" placeholder="ornek@email.com" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Konu</label>
                    <input type="text" id="subject" name="subject" placeholder="Mesaj konusu" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Mesaj</label>
                    <textarea id="message" name="message" rows="6" placeholder="Mesajınızı buraya yazın..."></textarea>
                  </div>
                  <button type="submit" className="submit-btn">Gönder</button>
                </form>
              </div>
            )}
          </div>

          <style>{`
            .secondary-finder-window {
              position: fixed; 
              width: 720px; 
              height: 520px;
              border-radius: 12px; 
              overflow: hidden;
              background: linear-gradient(#f6f6f8, #ebebee);
              box-shadow: 0 24px 80px rgba(0,0,0,0.28), 0 6px 20px rgba(0,0,0,0.18);
              font-family: -apple-system, system-ui, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              -webkit-font-smoothing: antialiased;
              text-rendering: optimizeLegibility;
            }
            .sfw-titlebar {
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
            .sfw-title { 
              text-align: center; 
              font-weight: 600; 
              font-size: 14px; 
              color: #2e2e33; 
            }
            .sfw-close {
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
            .sfw-close:hover { 
              background: rgba(0,0,0,.06); 
            }
            .sfw-toolbar { 
              padding: 8px 12px; 
              background: #f0f0f3; 
              border-bottom: 1px solid #e3e3e7; 
              display: flex; 
              align-items: center; 
            }
            .sfw-nav { 
              display: flex; 
              align-items: center; 
              gap: 8px; 
            }
            .sfw-content {
              height: calc(100% - 44px - 42px);
              overflow: auto;
              padding: 20px 24px;
            }

            /* Archive Content */
            .archive-content .grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 40px 48px;
              align-content: start;
            }
            .archive-content .grid-item {
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
              cursor: pointer;
              padding: 12px;
              border-radius: 8px;
            }
            .archive-content .grid-item:hover {
              background: rgba(0,0,0,.03);
            }

            /* Contact Form */
            .contact-content {
              max-width: 500px;
              margin: 0 auto;
            }
            .contact-content h2 {
              font-size: 24px;
              font-weight: 600;
              color: #1d1d1f;
              margin-bottom: 24px;
              text-align: center;
            }
            .contact-form {
              display: flex;
              flex-direction: column;
              gap: 16px;
            }
            .form-group {
              display: flex;
              flex-direction: column;
              gap: 6px;
            }
            .form-group label {
              font-size: 13px;
              font-weight: 500;
              color: #1d1d1f;
            }
            .form-group input,
            .form-group textarea {
              padding: 10px 12px;
              border: 1px solid #d1d1d6;
              border-radius: 6px;
              font-size: 14px;
              font-family: inherit;
              background: #fff;
              color: #1d1d1f;
              transition: border-color 0.2s;
            }
            .form-group input:focus,
            .form-group textarea:focus {
              outline: none;
              border-color: #007aff;
            }
            .form-group textarea {
              resize: vertical;
              min-height: 100px;
            }
            .submit-btn {
              padding: 12px 24px;
              background: #007aff;
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.2s;
              margin-top: 8px;
            }
            .submit-btn:hover {
              background: #0051d5;
            }
            .submit-btn:active {
              background: #004fc4;
            }
          `}</style>
        </div>,
        document.body
      ))}
    </>
  );
};

export default DesignWorkPage;