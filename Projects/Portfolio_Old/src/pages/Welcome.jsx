import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function Welcome() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const btnRef = useRef(null);
  const canvasRef = useRef(null);
  const lineRef = useRef(null);

  // ── Particle background ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const COLORS = ["#7c3aed", "#a855f7", "#c084fc", "#6d28d9", "#4c1d95"];
    const PARTICLE_COUNT = 80;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.2,
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // ── GSAP entrance animations ─────────────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Line grows from center
    tl.fromTo(lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, transformOrigin: "center" }
    )
    // "WELCOME TO MY" fades up
    .fromTo(".welcome-top",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      "-=0.3"
    )
    // "PORTFOLIO" big reveal
    .fromTo(".welcome-main",
      { y: 60, opacity: 0, letterSpacing: "30px" },
      { y: 0, opacity: 1, letterSpacing: "6px", duration: 0.9 },
      "-=0.3"
    )
    // Subtitle
    .fromTo(subRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      "-=0.2"
    )
    // Button bounces in
    .fromTo(btnRef.current,
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.1"
    );

    // Floating animation on button
    gsap.to(btnRef.current, {
      y: -8,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.5,
    });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          overflow: hidden;
          background: #0d0d0d;
          font-family: 'Bebas Neue', 'Arial Narrow', sans-serif;
        }

        .enter-btn {
          position: relative;
          cursor: pointer;
          background: transparent;
          border: 1.5px solid #7c3aed;
          color: #c084fc;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 4px;
          padding: 16px 52px;
          border-radius: 999px;
          overflow: hidden;
          transition: color 0.35s ease;
          outline: none;
        }

        .enter-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #7c3aed;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
          border-radius: 999px;
          z-index: 0;
        }

        .enter-btn:hover::before { transform: scaleX(1); }
        .enter-btn:hover { color: #fff; }

        .enter-btn span {
          position: relative;
          z-index: 1;
        }

        /* Glow ring around button */
        .btn-glow {
          position: absolute;
          inset: -6px;
          border-radius: 999px;
          border: 1px solid rgba(192, 132, 252, 0.25);
          animation: pulseRing 2.5s ease-out infinite;
        }

        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.25); opacity: 0;   }
        }

        /* Radial glow behind text */
        .center-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
      `}</style>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
      />

      {/* Center glow */}
      <div className="center-glow" />

      {/* Main content */}
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0px",
        }}
      >
        {/* Top label */}
        <p
          className="welcome-top"
          style={{
            fontSize: "14px",
            letterSpacing: "6px",
            color: "#7c3aed",
            marginBottom: "12px",
          }}
        >
          WELCOME TO MY
        </p>

        {/* Divider line */}
        <div
          ref={lineRef}
          style={{
            width: "60px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, #c084fc, transparent)",
            marginBottom: "20px",
          }}
        />

        {/* Main heading */}
        <h1
          ref={titleRef}
          className="welcome-main"
          style={{
            fontSize: "clamp(60px, 12vw, 130px)",
            letterSpacing: "6px",
            lineHeight: 1,
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          PORT
          <span style={{ WebkitTextStroke: "1.5px #c084fc", color: "transparent" }}>
            FOLIO
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subRef}
          style={{
            fontSize: "13px",
            letterSpacing: "3px",
            color: "#6b7280",
            marginTop: "20px",
            marginBottom: "52px",
            textAlign: "center",
          }}
        >
          FULL STACK MERN DEVELOPER · ANIKATE
        </p>

        {/* CTA Button */}
        <div style={{ position: "relative" }} ref={btnRef}>
          <div className="btn-glow" />
          <button
            className="enter-btn"
            onClick={() => navigate("/hero")}
          >
            <span>ENTER PORTFOLIO</span>
          </button>
        </div>
      </div>
    </>
  );
}
