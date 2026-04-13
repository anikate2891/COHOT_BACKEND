import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 174;

function getFramePath(index) {
  const num = String(index + 1).padStart(4, "0");
  return `/frames/male${num}.png`;
}

// ─── APNI VALUES YAHAN DAALO ─────────────────────────────────────────────────
const RESUME_PATH = "/resume.pdf";

const CERTIFICATE_LINKS = {
  DELOITTE:         "https://drive.google.com/file/d/1JCz2vYcgqst0iydkJ3tqqgaDPTC5VrUK/view",
  COURSERA:         "https://drive.google.com/file/d/1Qm4jtYPr4iameM_780wjcYuZ1He4eQaf/view",
  "GREAT LEARNING": "https://drive.google.com/file/d/1LDzgqHvo0v6fJRlf8JumNXss9hN7cT3w/view",
};

const PROJECT_LINKS = {
  "AI BATTLE ARENA":    "https://your-ai-battle-arena-link.com",
  NEXCHAT:              "https://your-nexchat-link.com",
  "SBI BANKING SYSTEM": "https://your-sbi-banking-link.com",
  "ORBITAL — 3D WEB":   "https://your-orbital-link.com",
};

const PROJECT_TAGS = {
  "AI BATTLE ARENA":    "GENERATIVE AI / WEB APP",
  NEXCHAT:              "AI CHATBOT / FULL STACK",
  "SBI BANKING SYSTEM": "FULL STACK / MERN",
  "ORBITAL — 3D WEB":   "THREE.JS / FRONTEND",
};

const CONTACT = {
  email:    "anikate955@gmail.com",
  phone:    "+91 7439241450",
  linkedin: "https://linkedin.com/in/anikatekanoo",
  github:   "https://github.com/yourusername",
};
// ─────────────────────────────────────────────────────────────────────────────

export default function Hero() {
  const mainRef = useRef(null);
  const canvasRef = useRef(null);


  useEffect(() => {
    const main = mainRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const locoScroll = new LocomotiveScroll({ el: main, smooth: true });
    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(main, {
      scrollTop(value) {
        return arguments.length
          ? locoScroll.scrollTo(value, 0, 0)
          : locoScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: "transform", // Locomotive Scroll ke saath hamesha transform use karo, fixed nahi
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();

    // ── Canvas frames ───────────────────────────────────────────────────────
    const images = [];
    const imageSeq = { frame: 0 };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      images.push(img);
    }

    function scaleImage(img, ctx) {
      const c = ctx.canvas;
      const hRatio = c.width / img.width;
      const vRatio = c.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const cx = (c.width - img.width * ratio) / 2;
      const cy = (c.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
    }

    function render() {
      if (images[imageSeq.frame]) scaleImage(images[imageSeq.frame], context);
    }

    images[0].onload = render;

    gsap.to(imageSeq, {
      frame: FRAME_COUNT - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        scrub: 0.15,
        trigger: "#page canvas",
        start: "top top",
        end: "1200% top",
        scroller: main,
      },
      onUpdate: render,
    });

    ScrollTrigger.create({
      trigger: "#page canvas",
      pin: true,
      scroller: main,
      start: "top top",
      end: "1200% top",
    });

    // ── Pin pages ───────────────────────────────────────────────────────────
    ["#page1", "#page2", "#page3", "#page4", "#page5"].forEach((sel) => {
      gsap.to(sel, {
        scrollTrigger: {
          trigger: sel,
          start: "top top",
          end: "bottom top",
          pin: true,
          scroller: main,
        },
      });
    });

    // ── PAGE 1 animations ───────────────────────────────────────────────────
    gsap.fromTo("#page1 .skill-left .anim-item",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: "#page1", start: "top 80%", scroller: main, toggleActions: "play none none reverse" } }
    );
    gsap.fromTo("#page1 .skill-right .anim-item",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, delay: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: "#page1", start: "top 80%", scroller: main, toggleActions: "play none none reverse" } }
    );
    gsap.fromTo("#page1 .bottom-label",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: "#page1", start: "top 80%", scroller: main, toggleActions: "play none none reverse" } }
    );

    // ── PAGE 2 animations ───────────────────────────────────────────────────
    gsap.fromTo("#page2 .skill-left .anim-item",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: "#page2", start: "top 80%", scroller: main, toggleActions: "play none none reverse" } }
    );
    gsap.fromTo("#page2 .skill-right .anim-item",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, delay: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: "#page2", start: "top 80%", scroller: main, toggleActions: "play none none reverse" } }
    );
    gsap.fromTo("#page2 .bottom-label",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: "#page2", start: "top 80%", scroller: main, toggleActions: "play none none reverse" } }
    );

    // ── PAGE 3 animations ───────────────────────────────────────────────────
    gsap.fromTo("#page3 .skill-left .anim-item",
      { x: -80, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.75, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: "#page3", start: "top 80%", scroller: main, toggleActions: "play none none reverse" } }
    );
    gsap.fromTo("#page3 .skill-right .anim-item",
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.75, stagger: 0.15, delay: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: "#page3", start: "top 80%", scroller: main, toggleActions: "play none none reverse" } }
    );

    // ── PAGE 4 animations ───────────────────────────────────────────────────
    gsap.fromTo("#page4 .project-title",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: "#page4", start: "top 80%", scroller: main, toggleActions: "play none none reverse" } }
    );
    gsap.fromTo("#page4 .project-row",
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.65, stagger: 0.15, delay: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: "#page4", start: "top 80%", scroller: main, toggleActions: "play none none reverse" } }
    );

    // ── PAGE 5 animations ───────────────────────────────────────────────────
    gsap.fromTo("#page5 .contact-label",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: "#page5", start: "top 80%", scroller: main, toggleActions: "play none none reverse" } }
    );
    gsap.fromTo("#page5 .contact-heading",
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.75, delay: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: "#page5", start: "top 80%", scroller: main, toggleActions: "play none none reverse" } }
    );
    gsap.fromTo("#page5 .contact-details",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, delay: 0.4, ease: "power2.out",
        scrollTrigger: { trigger: "#page5", start: "top 80%", scroller: main, toggleActions: "play none none reverse" } }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      locoScroll.destroy();
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        * {
          box-sizing: border-box;
          font-family: 'Bebas Neue', 'Arial Narrow', sans-serif;
        }

        #loop > h1 {
          font-weight: 400;
          animation: anim 15s linear infinite;
        }
        #loop > h1 > span {
          -webkit-text-stroke: 1.2px #c084fc;
          color: transparent;
          font-weight: 500;
        }
        @keyframes anim {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }

        .cert-link {
          display: block;
          cursor: pointer;
          transition: color 0.25s ease, letter-spacing 0.25s ease;
        }
        .cert-link:hover { color: #c084fc; letter-spacing: 2px; }

        .project-row {
          cursor: pointer;
          transition: background 0.25s ease, padding-left 0.25s ease;
          border-radius: 4px;
        }
        .project-row:hover { background: rgba(124,58,237,0.08); padding-left: 12px; }
        .project-row:hover .project-name { color: #c084fc; }

        .contact-link {
          display: block;
          text-decoration: none;
          color: #9ca3af;
          transition: color 0.2s ease;
          cursor: pointer;
        }
        .contact-link:hover { color: #c084fc; }
      `}</style>

      {/* ── NAV ── */}
      <div className="flex items-center justify-between h-[7%] w-full fixed z-[99] px-[30px]">
        <h3 className="text-[22px] tracking-[1px] text-white">Anikate's PortFolio</h3>
        <a
          href={RESUME_PATH}
          download="Anikate_Resume.pdf"
          className="px-[20px] py-[10px] rounded-full bg-[#c084fc] text-black text-[14px] tracking-[1px] no-underline"
        >
          Resume Here
        </a>
      </div>

      {/* ── MAIN — overflow-hidden NAHI hai yahan, yahi asli fix hai ── */}
      <div id="main" ref={mainRef} className="relative">

        {/* ── PAGE 0 — Hero ── */}
        <div id="page" className="relative h-screen w-screen bg-[#0d0d0d] bg-[radial-gradient(ellipse_at_top_left,_#2e1065_0%,_#110a1a_40%,_#0d0d0d_100%)]">
          <div id="loop" className="flex absolute top-[30%] h-[25%] w-full text-[100px] whitespace-nowrap overflow-hidden text-white">
            <h1><b>FULL STACK</b> MERN <b><i>DEVELOPER</i></b> BUILDING <span>SCALABLE</span> WEB <span><i>APPLICATIONS.</i></span></h1>
            <h1><b>FULL STACK</b> MERN <b><i>DEVELOPER</i></b> BUILDING <span>SCALABLE</span> WEB <span><i>APPLICATIONS.</i></span></h1>
            <h1><b>FULL STACK</b> MERN <b><i>DEVELOPER</i></b> BUILDING <span>SCALABLE</span> WEB <span><i>APPLICATIONS.</i></span></h1>
          </div>
          <h3 className="absolute top-[55%] left-[5%] text-[14px] text-[#6b7280] tracking-[1px]">
            FULL STACK MERN DEVELOPER BUILDING SCALABLE AND RESPONSIVE WEB
            APPLICATIONS <br /> USING MODERN TECHNOLOGIES LIKE REACT, NODE, AND
            MONGODB WITH CLEAN AND EFFICIENT CODE.
          </h3>
          <h4 className="absolute top-[62%] left-[25%] text-[14px] text-[#9ca3af]">
            ...SCROLL TO READ
          </h4>
          <canvas ref={canvasRef} className="relative z-[9] max-w-full max-h-full" />
        </div>

        {/* ── PAGE 1 — Frontend + Backend ── */}
        <div id="page1" className="relative h-screen w-screen bg-[radial-gradient(ellipse_at_bottom_right,_#2e1065_0%,_#110a1a_50%,_#0d0d0d_100%)]">
          <div className="skill-left absolute top-[25%] left-[5%]">
            <h3 className="anim-item text-[#7c3aed] text-[12px] tracking-[2px] mb-3">FRONTEND</h3>
            {["HTML","CSS","REACT","TAILWIND","TYPESCRIPT"].map(t => (
              <h1 key={t} className="anim-item text-[38px] leading-[1.8] text-white">{t}</h1>
            ))}
          </div>
          <div className="skill-right absolute top-[25%] right-[5%] text-right">
            <h3 className="anim-item text-[#7c3aed] text-[12px] tracking-[2px] mb-3">BACKEND</h3>
            {["NODE","EXPRESS","MONGODB","DOCKER","AWS"].map(t => (
              <h1 key={t} className="anim-item text-[38px] leading-[1.8] text-white">{t}</h1>
            ))}
          </div>
          <div className="bottom-label absolute bottom-[8%] left-[50%] -translate-x-1/2 text-center">
            <h3 className="text-[#6d28d9] text-[12px] tracking-[3px]">FULL STACK MERN DEVELOPER</h3>
          </div>
        </div>

        {/* ── PAGE 2 — DevOps + Tools ── */}
        <div id="page2" className="relative h-screen w-screen bg-[radial-gradient(ellipse_at_top_right,_#2e1065_0%,_#110a1a_50%,_#0d0d0d_100%)]">
          <div className="skill-left absolute top-[25%] left-[5%]">
            <h3 className="anim-item text-[#7c3aed] text-[12px] tracking-[2px] mb-3">DEVOPS</h3>
            {["DOCKER","AWS","CI/CD"].map(t => (
              <h1 key={t} className="anim-item text-[38px] leading-[1.8] text-white">{t}</h1>
            ))}
          </div>
          <div className="skill-right absolute top-[25%] right-[5%] text-right">
            <h3 className="anim-item text-[#7c3aed] text-[12px] tracking-[2px] mb-3">TOOLS</h3>
            {["GIT","GITHUB","SYSTEM DESIGN"].map(t => (
              <h1 key={t} className="anim-item text-[38px] leading-[1.8] text-white">{t}</h1>
            ))}
          </div>
          <div className="bottom-label absolute bottom-[8%] left-[50%] -translate-x-1/2 text-center">
            <h3 className="text-[#6d28d9] text-[12px] tracking-[3px]">SHIPPING TO PRODUCTION</h3>
          </div>
        </div>

        {/* ── PAGE 3 — Certifications ── */}
        <div id="page3" className="relative h-screen w-screen bg-[radial-gradient(ellipse_at_bottom_left,_#2e1065_0%,_#110a1a_50%,_#0d0d0d_100%)]">
          <div className="skill-left absolute top-[25%] left-[5%]">
            <h3 className="anim-item text-[#7c3aed] text-[12px] tracking-[2px] mb-3">CERTIFIED BY</h3>
            {Object.entries(CERTIFICATE_LINKS).map(([name, url]) => (
            <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="anim-item cert-link text-[38px] leading-[1.8] text-white"
                >
                {name}
            </a>
            ))}
          </div>
          <div className="skill-right absolute top-[25%] right-[5%] text-right">
            <h3 className="anim-item text-[#7c3aed] text-[12px] tracking-[2px] mb-3">I HAVE BUILT</h3>
            {["REST APIs","FULL STACK APPS","DATA STRUCTURES","RESPONSIVE UI"].map(t => (
              <h1 key={t} className="anim-item text-[38px] leading-[1.8] text-white">{t}</h1>
            ))}
          </div>
          <div className="absolute bottom-[8%] left-[50%] -translate-x-1/2 text-center">
            <h3 className="text-[#6d28d9] text-[12px] tracking-[3px]">BUILDING WITH INTENT</h3>
          </div>
        </div>

        {/* ── PAGE 4 — Projects ── */}
        <div id="page4" className="relative h-screen w-screen bg-[radial-gradient(ellipse_at_top_left,_#2e1065_0%,_#110a1a_50%,_#0d0d0d_100%)]">
          <div className="absolute top-[15%] left-[10%]">
            <h3 className="project-title text-[#7c3aed] text-[14px] tracking-[1px]">SELECTED WORKS</h3>
            <h1 className="project-title text-[60px] leading-[1.3] text-white">PROJECTS</h1>
          </div>
          <div className="absolute top-[35%] left-[10%] right-[10%]">
            {Object.entries(PROJECT_LINKS).map(([name, url], i) => (
            <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`project-row flex justify-between items-center border-t ${
                    i === Object.keys(PROJECT_LINKS).length - 1 ? "border-b" : ""
                } border-[#2e1065] py-5`}
                >
                <h1 className="project-name text-[40px] text-white transition-colors duration-300">{name}</h1>
                <h3 className="text-[#7c3aed] text-[14px] tracking-[1px]">{PROJECT_TAGS[name]}</h3>
            </a>
            ))}
          </div>
        </div>

        {/* ── PAGE 5 — Contact ── */}
        <div id="page5" className="relative h-screen w-screen bg-[radial-gradient(ellipse_at_center,_#2e1065_0%,_#110a1a_50%,_#0d0d0d_100%)]">
          <div className="absolute top-[40%] right-[10%] text-right">
            <h3 className="contact-label text-[#7c3aed] text-[14px] tracking-[1px]">CONTACT</h3>
            <h1 className="contact-heading text-[70px] leading-[1.4] text-white">
              LET'S WORK<br />TOGETHER
            </h1>
            <p className="contact-details text-[14px] leading-[2] mt-4">
              <a href={`mailto:${CONTACT.email}`} className="contact-link">
                Email: {CONTACT.email}
              </a>
              <span className="text-[#9ca3af]">Phone: {CONTACT.phone}</span>
            </p>
            <p className="contact-details text-[14px] leading-[2] mt-4">
              <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="contact-link">
                LinkedIn: linkedin.com/in/anikatekanoo
              </a>
              <a href={CONTACT.github} target="_blank" rel="noreferrer" className="contact-link">
                GitHub: github.com/yourusername
              </a>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
