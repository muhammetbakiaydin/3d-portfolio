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

  // Persona dropdown state
  const [selectedPersona, setSelectedPersona] = React.useState({ icon: '👽', label: 'As an Alien' });

  React.useEffect(() => {
    // Handle clicks outside persona dropdowns to close them
    const handleClickOutside = (e) => {
      if (!e.target.closest('.persona-dropdown')) {
        document.querySelectorAll('.persona-dropdown.is-open').forEach(dropdown => {
          dropdown.classList.remove('is-open');
          const trigger = dropdown.querySelector('.persona-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      }
    };

    // Handle persona option selection
    const handlePersonaSelect = (e) => {
      const option = e.target.closest('.persona-option');
      if (option) {
        const dropdown = option.closest('.persona-dropdown');
        const trigger = dropdown.querySelector('.persona-trigger');
        const icon = option.querySelector('.persona-icon').textContent;
        const label = option.querySelector('.persona-label').textContent;
        
        // Update trigger
        trigger.querySelector('.persona-icon').textContent = icon;
        trigger.querySelector('.persona-label').textContent = label;
        
        // Update selected state and aria-selected
        dropdown.querySelectorAll('.persona-option').forEach(opt => {
          opt.classList.remove('is-selected');
          opt.setAttribute('aria-selected', 'false');
        });
        option.classList.add('is-selected');
        option.setAttribute('aria-selected', 'true');
        
        // Close dropdown
        dropdown.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        
        setSelectedPersona({ icon, label });
      }
    };

    // Keyboard navigation for persona dropdown
    const handleKeyDown = (e) => {
      const dropdown = e.target.closest('.persona-dropdown');
      if (!dropdown) return;

      const isOpen = dropdown.classList.contains('is-open');
      const trigger = dropdown.querySelector('.persona-trigger');
      const menu = dropdown.querySelector('.persona-menu');
      const options = Array.from(dropdown.querySelectorAll('.persona-option'));

      // Open/close dropdown with Enter or Space on trigger
      if (e.target === trigger && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        const willOpen = !isOpen;
        dropdown.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', willOpen.toString());
        if (willOpen && options.length > 0) {
          setTimeout(() => options[0].focus(), 50);
        }
      }

      // Close dropdown with Escape
      if (e.key === 'Escape' && isOpen) {
        dropdown.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }

      // Navigate options with arrow keys
      if (isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        const currentIndex = options.indexOf(document.activeElement);
        let nextIndex;

        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        }

        options[nextIndex].focus();
      }

      // Select option with Enter or Space
      if (e.target.classList.contains('persona-option') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        e.target.click();
      }
    };

    // Handle dropdown trigger clicks
    const handleTriggerClick = (e) => {
      const trigger = e.target.closest('.persona-trigger');
      if (trigger) {
        const dropdown = trigger.parentElement;
        const isOpen = dropdown.classList.contains('is-open');
        trigger.setAttribute('aria-expanded', (!isOpen).toString());
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('click', handlePersonaSelect);
    document.addEventListener('click', handleTriggerClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('click', handlePersonaSelect);
      document.removeEventListener('click', handleTriggerClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  React.useEffect(() => {
    // center window on first paint (match CSS width/height)
    const updatePosition = () => {
      const isMobile = window.innerWidth < 768;
      const W = isMobile ? window.innerWidth - 20 : 720;
      const H = isMobile ? window.innerHeight - 20 : 520;
      setPos({ x: (window.innerWidth - W) / 2, y: (window.innerHeight - H) / 2 });
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
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
    const isMobile = window.innerWidth < 768;
    const W = isMobile ? window.innerWidth - 20 : 960;
    const H = isMobile ? window.innerHeight - 20 : 640;
    const offset = isMobile ? 0 : portfolioWindows.length * 30;
    
    const newWindow = {
      id,
      title: "Portfolio",
      folder: folderName,
      pos: { 
        x: (window.innerWidth - W) / 2 + offset, 
        y: (window.innerHeight - H) / 2 + offset 
      },
      zIndex: topZIndex + 1
    };
    setPortfolioWindows(prev => [...prev, newWindow]);
    setTopZIndex(prev => prev + 1);
  };

  // Finder window handlers (for Archive and Contact)
  const openFinderWindow = (folderName, type) => {
    const id = Date.now();
    const isMobile = window.innerWidth < 768;
    const W = isMobile ? window.innerWidth - 20 : 720;
    const H = isMobile ? window.innerHeight - 20 : 520;
    const offset = isMobile ? 0 : finderWindows.length * 30;
    
    const newWindow = {
      id,
      title: folderName,
      type,
      pos: { 
        x: (window.innerWidth - W) / 2 + offset, 
        y: (window.innerHeight - H) / 2 + offset 
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
            @media (max-width: 767px) {
              .finder-overlay .finder-window {
                width: calc(100vw - 20px);
                height: calc(100vh - 20px);
                border-radius: 8px;
              }
            }
            @media (min-width: 768px) and (max-width: 1024px) {
              .finder-overlay .finder-window {
                width: calc(100vw - 40px);
                height: calc(100vh - 40px);
                max-width: 720px;
                max-height: 520px;
              }
            }
            .finder-overlay .fw-titlebar {
              display: grid; grid-template-columns: auto 1fr auto;
              align-items: center; gap: 8px;
              height: 44px; padding: 0 12px;
              background: linear-gradient(#ededf1, #e4e4e8);
              border-bottom: 1px solid #dadadd;
              cursor: move;
            }
            @media (max-width: 767px) {
              .finder-overlay .fw-titlebar {
                height: 40px;
                padding: 0 8px;
              }
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
            @media (max-width: 767px) {
              .finder-overlay .fw-body {
                grid-template-columns: 1fr;
                height: calc(100% - 40px - 40px);
              }
              .finder-overlay .fw-sidebar {
                display: none;
              }
              .finder-overlay .fw-toolbar {
                padding: 6px 8px;
              }
            }
            @media (min-width: 768px) and (max-width: 1024px) {
              .finder-overlay .fw-body {
                grid-template-columns: 180px 1fr;
              }
            }
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
            @media (max-width: 767px) {
              .finder-overlay .fw-content {
                padding: 12px;
              }
            }
            .finder-overlay .grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 40px 48px; align-content: start; }
            @media (max-width: 767px) {
              .finder-overlay .grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 24px 16px;
              }
            }
            @media (min-width: 768px) and (max-width: 1024px) {
              .finder-overlay .grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 32px 24px;
              }
            }
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
            @media (max-width: 767px) {
              .finder-overlay .folder-icon {
                width: 48px;
                height: 48px;
              }
              .finder-overlay .folder-icon::before {
                font-size: 36px !important;
              }
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
            @media (max-width: 767px) {
              .portfolio-window {
                width: calc(100vw - 20px);
                height: calc(100vh - 20px);
                border-radius: 8px;
              }
            }
            @media (min-width: 768px) and (max-width: 1024px) {
              .portfolio-window {
                width: calc(100vw - 40px);
                height: calc(100vh - 40px);
                max-width: 960px;
                max-height: 640px;
              }
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
            @media (max-width: 767px) {
              .pw-titlebar {
                height: 40px;
                padding: 0 8px;
              }
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
                <div className="contact-grid">
                  <div className="contact-form-column">
                    <div className="form-row">
                      <label htmlFor="to" className="form-label">To:</label>
                      <input 
                        type="text" 
                        id="to" 
                        name="to" 
                        className="form-input"
                        defaultValue="Baki Aydin"
                      />
                    </div>
                    
                    <div className="form-row">
                      <label htmlFor="from" className="form-label">From:</label>
                      <input 
                        type="email" 
                        id="from" 
                        name="from" 
                        className="form-input"
                        placeholder="Your email address"
                      />
                    </div>
                    
                    <div className="form-row">
                      <label htmlFor="subject" className="form-label">Subject:</label>
                      <div className="subject-input-wrapper">
                        <span className="subject-icon">💗</span>
                        <input 
                          type="text" 
                          id="subject" 
                          name="subject" 
                          className="form-input subject-input"
                          defaultValue="Personal Note"
                        />
                      </div>
                    </div>
                    
                    <div className="form-row form-row-textarea">
                      <label htmlFor="message" className="form-label">Message:</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        className="form-textarea"
                        rows="10"
                        placeholder="Write your message here…"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="contact-actions-column">
                    <button type="submit" className="send-button">
                      Send
                    </button>
                    
                    <div className="persona-dropdown">
                      <button 
                        type="button"
                        className="persona-trigger"
                        onClick={(e) => {
                          e.currentTarget.parentElement.classList.toggle('is-open');
                        }}
                        aria-haspopup="listbox"
                        aria-expanded="false"
                        aria-label="Select persona"
                      >
                        <span className="persona-icon">👽</span>
                        <span className="persona-label">As an Alien</span>
                        <svg className="persona-chevron" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      
                      <div className="persona-menu" role="listbox" aria-label="Persona options">
                        <button type="button" className="persona-option" data-value="yourself" role="option" aria-selected="false">
                          <span className="persona-icon" aria-hidden="true">👤</span>
                          <span className="persona-label">As Yourself</span>
                        </button>
                        <button type="button" className="persona-option is-selected" data-value="alien" role="option" aria-selected="true">
                          <span className="persona-icon" aria-hidden="true">👽</span>
                          <span className="persona-label">As an Alien</span>
                        </button>
                        <button type="button" className="persona-option" data-value="cowpoke" role="option" aria-selected="false">
                          <span className="persona-icon" aria-hidden="true">🤠</span>
                          <span className="persona-label">As a Cowpoke</span>
                        </button>
                        <button type="button" className="persona-option" data-value="fae" role="option" aria-selected="false">
                          <span className="persona-icon" aria-hidden="true">🧚</span>
                          <span className="persona-label">As a Fae</span>
                        </button>
                        <button type="button" className="persona-option" data-value="knight" role="option" aria-selected="false">
                          <span className="persona-icon" aria-hidden="true">🛡️</span>
                          <span className="persona-label">As a Knight</span>
                        </button>
                        <button type="button" className="persona-option" data-value="pirate" role="option" aria-selected="false">
                          <span className="persona-icon" aria-hidden="true">🏴‍☠️</span>
                          <span className="persona-label">As a Pirate</span>
                        </button>
                        <button type="button" className="persona-option" data-value="poaster" role="option" aria-selected="false">
                          <span className="persona-icon" aria-hidden="true">📰</span>
                          <span className="persona-label">As a Poaster</span>
                        </button>
                        <button type="button" className="persona-option" data-value="poet" role="option" aria-selected="false">
                          <span className="persona-icon" aria-hidden="true">📝</span>
                          <span className="persona-label">As a Poet</span>
                        </button>
                        <button type="button" className="persona-option" data-value="robot" role="option" aria-selected="false">
                          <span className="persona-icon" aria-hidden="true">🤖</span>
                          <span className="persona-label">As a Robot</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
            @media (max-width: 767px) {
              .secondary-finder-window {
                width: calc(100vw - 20px);
                height: calc(100vh - 20px);
                border-radius: 8px;
              }
            }
            @media (min-width: 768px) and (max-width: 1024px) {
              .secondary-finder-window {
                width: calc(100vw - 40px);
                height: calc(100vh - 40px);
                max-width: 720px;
                max-height: 520px;
              }
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
            @media (max-width: 767px) {
              .sfw-titlebar {
                height: 40px;
                padding: 0 8px;
              }
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
            @media (max-width: 767px) {
              .sfw-content {
                height: calc(100% - 40px - 40px);
                padding: 12px;
              }
              .sfw-toolbar {
                padding: 6px 8px !important;
              }
            }

            /* Archive Content */
            .archive-content .grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 40px 48px;
              align-content: start;
            }
            @media (max-width: 767px) {
              .archive-content .grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 24px 16px;
              }
            }
            @media (min-width: 768px) and (max-width: 1024px) {
              .archive-content .grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 32px 24px;
              }
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
            @media (max-width: 767px) {
              .archive-content .grid-item {
                padding: 8px;
                gap: 6px;
              }
              .archive-content .folder-icon {
                width: 48px !important;
                height: 48px !important;
              }
              .archive-content .folder-icon::before {
                font-size: 36px !important;
              }
              .archive-content .label {
                font-size: 11px !important;
              }
            }
            .archive-content .grid-item:hover {
              background: rgba(0,0,0,.03);
            }

            /* Contact Form */
            .contact-content {
              max-width: 100%;
              margin: 0;
              height: 100%;
            }
            @media (max-width: 767px) {
              .contact-content {
                max-width: 100%;
              }
            }
            
            .contact-grid {
              display: grid;
              grid-template-columns: 1fr 180px;
              gap: 24px;
              height: 100%;
            }
            @media (max-width: 767px) {
              .contact-grid {
                grid-template-columns: 1fr;
                gap: 16px;
              }
            }
            
            .contact-form-column {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            
            .contact-actions-column {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            @media (max-width: 767px) {
              .contact-actions-column {
                flex-direction: row;
                align-items: flex-start;
              }
            }
            
            .form-row {
              display: grid;
              grid-template-columns: 80px 1fr;
              gap: 12px;
              align-items: center;
            }
            @media (max-width: 767px) {
              .form-row {
                grid-template-columns: 70px 1fr;
                gap: 8px;
              }
            }
            
            .form-row-textarea {
              align-items: flex-start;
            }
            
            .form-label {
              font-size: 13px;
              font-weight: 500;
              color: #1d1d1f;
              text-align: right;
              padding-top: 2px;
            }
            @media (max-width: 767px) {
              .form-label {
                font-size: 12px;
              }
            }
            
            .form-input {
              padding: 8px 12px;
              border: 1px solid #d1d1d6;
              border-radius: 6px;
              font-size: 13px;
              font-family: inherit;
              background: rgba(255, 255, 255, 0.9);
              color: #1d1d1f;
              transition: all 0.2s ease;
              outline: none;
            }
            .form-input:focus {
              border-color: #007aff;
              background: #fff;
              box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
            }
            .form-input::placeholder {
              color: #8e8e93;
            }
            @media (max-width: 767px) {
              .form-input {
                padding: 7px 10px;
                font-size: 12px;
              }
            }
            
            .subject-input-wrapper {
              position: relative;
              display: flex;
              align-items: center;
            }
            
            .subject-icon {
              position: absolute;
              left: 10px;
              font-size: 16px;
              pointer-events: none;
              z-index: 1;
            }
            
            .subject-input {
              padding-left: 36px;
            }
            
            .form-textarea {
              padding: 10px 12px;
              border: 1px solid #d1d1d6;
              border-radius: 6px;
              font-size: 13px;
              font-family: inherit;
              background: rgba(255, 255, 255, 0.9);
              color: #1d1d1f;
              transition: all 0.2s ease;
              outline: none;
              resize: vertical;
              min-height: 120px;
            }
            .form-textarea:focus {
              border-color: #007aff;
              background: #fff;
              box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
            }
            .form-textarea::placeholder {
              color: #8e8e93;
            }
            @media (max-width: 767px) {
              .form-textarea {
                padding: 8px 10px;
                font-size: 12px;
                min-height: 100px;
              }
            }
            
            .send-button {
              width: 100%;
              padding: 10px 20px;
              background: linear-gradient(180deg, #007aff 0%, #0051d5 100%);
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
              box-shadow: 0 2px 8px rgba(0, 122, 255, 0.25);
              outline: none;
            }
            .send-button:hover {
              background: linear-gradient(180deg, #0051d5 0%, #004fc4 100%);
              box-shadow: 0 4px 12px rgba(0, 122, 255, 0.35);
              transform: translateY(-1px);
            }
            .send-button:active {
              transform: translateY(0);
              box-shadow: 0 1px 4px rgba(0, 122, 255, 0.3);
            }
            .send-button:focus-visible {
              box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.3);
            }
            @media (max-width: 767px) {
              .send-button {
                padding: 9px 16px;
                font-size: 13px;
                flex: 1;
              }
            }
            
            /* Persona Dropdown */
            .persona-dropdown {
              position: relative;
            }
            @media (max-width: 767px) {
              .persona-dropdown {
                flex: 1;
              }
            }
            
            .persona-trigger {
              width: 100%;
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 10px 12px;
              background: rgba(255, 255, 255, 0.9);
              border: 1px solid #d1d1d6;
              border-radius: 8px;
              font-size: 13px;
              font-weight: 500;
              color: #1d1d1f;
              cursor: pointer;
              transition: all 0.2s ease;
              outline: none;
            }
            .persona-trigger:hover {
              background: #fff;
              border-color: #b8b8bd;
            }
            .persona-trigger:focus-visible {
              border-color: #007aff;
              box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
            }
            @media (max-width: 767px) {
              .persona-trigger {
                padding: 9px 10px;
                font-size: 12px;
              }
            }
            
            .persona-icon {
              font-size: 18px;
              line-height: 1;
              flex-shrink: 0;
            }
            
            .persona-label {
              flex: 1;
              text-align: left;
            }
            
            .persona-chevron {
              flex-shrink: 0;
              color: #8e8e93;
              transition: transform 0.2s ease;
            }
            .persona-dropdown.is-open .persona-chevron {
              transform: rotate(180deg);
            }
            
            .persona-menu {
              position: absolute;
              top: calc(100% + 4px);
              left: 0;
              right: 0;
              background: rgba(255, 255, 255, 0.98);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid #d1d1d6;
              border-radius: 8px;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08);
              opacity: 0;
              visibility: hidden;
              transform: translateY(-8px);
              transition: all 0.2s ease;
              z-index: 1000;
              max-height: 320px;
              overflow-y: auto;
            }
            .persona-dropdown.is-open .persona-menu {
              opacity: 1;
              visibility: visible;
              transform: translateY(0);
            }
            @media (max-width: 767px) {
              .persona-menu {
                position: fixed;
                left: 10px;
                right: 10px;
                top: auto;
                bottom: 10px;
                max-height: 50vh;
              }
            }
            
            .persona-option {
              width: 100%;
              display: flex;
              align-items: center;
              gap: 10px;
              padding: 10px 12px;
              background: transparent;
              border: none;
              font-size: 13px;
              font-weight: 500;
              color: #1d1d1f;
              cursor: pointer;
              transition: background 0.15s ease;
              outline: none;
              text-align: left;
            }
            .persona-option:hover {
              background: rgba(0, 122, 255, 0.08);
            }
            .persona-option:focus-visible {
              background: rgba(0, 122, 255, 0.12);
            }
            .persona-option.is-selected {
              background: rgba(0, 122, 255, 0.1);
              color: #007aff;
              font-weight: 600;
            }
            .persona-option:first-child {
              border-radius: 7px 7px 0 0;
            }
            .persona-option:last-child {
              border-radius: 0 0 7px 7px;
            }
            @media (max-width: 767px) {
              .persona-option {
                padding: 12px;
                font-size: 14px;
              }
            }
          `}</style>
        </div>,
        document.body
      ))}
    </>
  );
};

export default DesignWorkPage;