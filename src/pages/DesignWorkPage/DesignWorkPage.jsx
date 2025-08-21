import React from "react";
import Page from "../Page";
import "./DesignWorkPage.scss";

const DesignWorkPage = () => {
  const folders = [
    "Accessibility","Accounts","AppleMediaServices","Application Scripts","Application Support",
    "Assistant","Assistants","Audio","Autosave Information","Biome","Caches","Calendars",
    "CallServices","CloudStorage","ColorPickers","Colors"
  ];
  const [selected, setSelected] = React.useState(folders[0]);

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
    </>
  );
};

export default DesignWorkPage;
