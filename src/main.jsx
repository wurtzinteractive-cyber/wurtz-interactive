import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const NAV = [
  ["home", "Home"],
  ["games", "Games"],
  ["about", "About"],
  ["contact", "Contact"],
];

const VIDEO_HOPPITY_HOP = "/assets/Hoppity-Hop/Hoppity-Hop-Video.mp4";
const VIDEO_HANDMADE_FACES = "/assets/HandMade-Faces/Handmade-Faces-Video.mp4";
const VIDEO_ELDER_LEAF = "/assets/Elder-Leaf/Elder-Leaf-Video.mp4";

/* Each game carries its own reel. The Handmade Faces files have spaces and
   brackets in their names, so the spaces are percent-encoded here. */
const SHOTS_HOPPITY_HOP = [
  "/assets/Hoppity-Hop/Hoppity-Hop-SS-1.jpeg",
  "/assets/Hoppity-Hop/Hoppity-Hop-SS-2.jpeg",
  "/assets/Hoppity-Hop/Hoppity-Hop-SS-3.jpeg",
  "/assets/Hoppity-Hop/Hoppity-Hop-SS-4.jpeg",
];

const SHOTS_HANDMADE_FACES = [
  "/assets/HandMade-Faces/Handmade-Faces-SS-1.jpeg",
  "/assets/HandMade-Faces/Handmade-Faces-SS-2.jpeg",
  "/assets/HandMade-Faces/Handmade-Faces-SS-3.jpeg",
  "/assets/HandMade-Faces/Handmade-Faces-SS-4.jpeg",
];

/* No Elder Leaf captures in the folder yet — falling back to its key art so
   the section isn't empty. Drop the real files in and replace this. */
const SHOTS_ELDER_LEAF = [
  "/assets/Elder-Leaf/Elder-Leaf-SS-1.jpeg",
  "/assets/Elder-Leaf/Elder-Leaf-SS-2.jpeg",
  "/assets/Elder-Leaf/Elder-Leaf-SS-3.jpeg",
  "/assets/Elder-Leaf/Elder-Leaf-SS-4.jpeg",

];

const GAMES = [
  {
    number: "01",
    slug: "hoppity-hop",
    title: "Hoppity Hop",
    image: "/assets/OurGames/hoppity-hop.png",
    video: VIDEO_HOPPITY_HOP,
    screenshots: SHOTS_HOPPITY_HOP,
    description:
      "Hoppity-Hop is a vibrant 3D platformer where players leap and battle their way through a whimsical wasteland. Explore the colorful world of Palladium, uncover a quirky story, and take on challenging enemies in an adventure full of charm and chaos.",
    team: [
      {
        name: "Raghav Lakhanpal",
        roles: [
          "Game Direction",
          "Cutscenes & Dialogue Writing",
          "UI/UX",
          "3D Character Design & Modelling",
        ],
      },
      {
        name: "Heer Lalwani",
        roles: [
          "3D Asset Design",
          "Concept Art",
          "UI/UX",
          "Character Modelling",
        ],
      },
      {
        name: "Rimee Jain",
        roles: [
          "Level Art",
          "Concept Art",
          "3D Asset Design",
          "Environment Design",
        ],
      },
      {
        name: "Aryan Sachan",
        roles: [
          "Level Design",
          "Level Art",
          "3D Asset Design",
          "Environment Design",
        ],
      },
      {
        name: "Mridul Sharma",
        roles: [
          "Systems & Gameplay Development",
          "Polishing and QA",
          "Cinematics",
        ],
      },
      {
        name: "Tanmay Neema",
        roles: [
          "Systems & Gameplay Development",
          "Polishing and QA",
          "Cinematics",
        ],
      },
    ],
  },
  {
    number: "02",
    slug: "handmade-faces",
    title: "Handmade Faces",
    image: "/assets/OurGames/handmade-faces.png",
    video: VIDEO_HANDMADE_FACES,
    screenshots: SHOTS_HANDMADE_FACES,
    description:
      "Handmade Faces is a quirky, fast-paced game where you pack, sort, and organize boxes while navigating a world full of handmade charm. A fun little game jam experience focused on creativity, chaos, and satisfying box-packing gameplay. ",
     team: [
      {
        name: "Raghav Lakhanpal",
        roles: [
          "Game Direction",
          "Cutscenes & Dialogue Writing",
          "General Artist"
        ],
      },
      {
        name: "Heer Lalwani",
        roles: [
          "General Artist",
          "UI/UX"
        ],
      },
      {
        name: "Rimee Jain",
        roles: [
          "General Artist",
          "UI/UX"
        ],
      },
      {
        name: "Aryan Sachan",
        roles: [
          "General Artist",
          "UI/UX"
        ],
      },
      {
        name: "Mridul Sharma",
        roles: [
          "Game Dev",
          "Polishing and QA"
        ],
      }
    ],
  },
  {
    number: "03",
    slug: "elder-leaf",
    title: "Elder Leaf",
    image: "/assets/OurGames/elder-leaf.png",
    video: VIDEO_ELDER_LEAF,
    screenshots: SHOTS_ELDER_LEAF,
    description:
      "Elder-Leaf is a charming pixel-art adventure that blends exploration, mystery, and storytelling. Step into a beautifully crafted world, uncover its secrets, and experience a heartfelt journey brought to life through retro-inspired visuals.",
    team: [
      {
        name: "Raghav Lakhanpal",
        roles: [
          "Game Direction",
          "Cutscenes & Dialogue Writing",
          "Game Dev",
          "General Artist"
        ],
      },
      {
        name: "Heer Lalwani",
        roles: [
          "Pixel Artist",
          "Animator",
          "UI/UX",
          "Character Art"
        ],
      },
      {
        name: "Rimee Jain",
        roles: [
          "Pixel Artist",
          "Animator",
          "UI/UX",
          "Environment Art"
        ],
      },
      {
        name: "Aryan Sachan",
        roles: [
         "Pixel Artist",
          "Animator",
          "Level Design",
          "Environment Art"
        ],
      },
      {
        name: "Aaditya Kadam",
        roles: [
          "Game Dev",
          "Polishing and QA"
        ],
      }
    ],
  },
];

/* ---------------------------------------------------------------
   Tiny hash router — real URLs and a working back button without
   pulling in a routing dependency.
--------------------------------------------------------------- */

const readRoute = () => window.location.hash.replace(/^#/, "") || "/";

function navigate(path) {
  if (readRoute() === path) return;
  window.location.hash = path;
}

function useHashRoute() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

function App() {
  const rootRef = useRef(null);
  const lenisRef = useRef(null);
  const [introDone, setIntroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const route = useHashRoute();
  const gameSlug = route.startsWith("/game/")
    ? route.slice("/game/".length)
    : null;
  const activeGame = gameSlug
    ? GAMES.find((game) => game.slug === gameSlug)
    : null;

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* Reset scroll synchronously (before paint) so the new page never flashes
     at the old position. useLayoutEffect fires after DOM mutations but before
     the browser has committed pixels, so this is always clean. */
  useLayoutEffect(() => {
    /* Kill Lenis momentum first so it doesn't fight us */
    lenisRef.current?.stop();
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    lenisRef.current?.start();
    ScrollTrigger.refresh();
  }, [route]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray("[data-reveal]");
      sections.forEach((section) => {
        const parts = section.querySelectorAll("[data-word]");
        gsap.fromTo(
          parts,
          { yPercent: 120, rotate: 2, opacity: 0 },
          {
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.out",
            stagger: 0.025,
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              once: true,
            },
          },
        );
      });

      /* #home only exists on the landing route */
      if (document.querySelector("#home"))
        gsap.to(".home-orb", {
          y: -100,
          rotate: 25,
          ease: "none",
          scrollTrigger: {
            trigger: "#home",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

      gsap.utils.toArray(".game-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 80, rotate: index % 2 ? 1.5 : -1.5, opacity: 0 },
          {
            y: 0,
            rotate: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          },
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [introDone, route]);

  return (
    <div ref={rootRef} className="site">
      <Intro onComplete={() => setIntroDone(true)} />
      <CursorGlow />
      <SocialBar />

      {introDone && <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />}

      <main>
        {gameSlug ? (
          <GamePage game={activeGame} />
        ) : (
          <>
            <Home />
            <Games />
            <About />
          </>
        )}
      </main>

      <PageFooter />
    </div>
  );
}

const SOCIALS = [
  {
    href: "https://www.instagram.com/wurtzinteractive/",
    label: "Instagram",
    icon: "/assets/Logos/Instagram.png",
  },
  {
    href: "https://wurtz-interactive.itch.io/",
    label: "Itch.io",
    icon: "/assets/Logos/Itch.png",
  },
  {
    href: "mailto:wurtzinteractive@gmail.com",
    label: "Email",
    icon: "/assets/Logos/Mail.png",
  },
];

function SocialBar() {
  return (
    <aside className="social-bar" aria-label="Social links">
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          className="social-link"
          aria-label={s.label}
          target={s.href.startsWith("mailto") ? undefined : "_blank"}
          rel="noopener noreferrer"
        >
          <img
            src="/assets/CircleHighlight.png"
            className="social-highlight"
            alt=""
            aria-hidden="true"
          />
          <img src={s.icon} alt="" className="social-icon" aria-hidden="true" />
        </a>
      ))}
    </aside>
  );
}

function PageFooter() {
  return (
    <footer id="contact" className="page-footer">
      <div className="page-footer-inner">
        <div className="page-footer-left">
          <img src="/assets/wurtz-logo.png" alt="Wurtz' Interactive" className="page-footer-logo" />
          <a href="mailto:wurtzinteractive@gmail.com" className="page-footer-email">
            wurtzinteractive@gmail.com
          </a>
        </div>

      
      </div>
    </footer>
  );
}

function Intro({ onComplete }) {
  const [show, setShow] = useState(true);
  const introRef = useRef(null);
  const logoRef = useRef(null);
  const lineRef = useRef(null);

  useLayoutEffect(() => {
    const intro = introRef.current;
    const logo = logoRef.current;
    const line = lineRef.current;

    const tl = gsap.timeline({
      defaults: { ease: "power4.inOut" },
      onComplete: () => {
        setShow(false);
        onComplete();
      },
    });

    tl.set(intro, { autoAlpha: 1 })
      .fromTo(
        logo,
        { scale: 0.72, opacity: 0, rotate: -2 },
        { scale: 1, opacity: 1, rotate: 0, duration: 1.15, ease: "expo.out" },
      )
      .fromTo(
        line,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, transformOrigin: "left center" },
        "-=0.55",
      )
      .to(
        logo,
        {
          scale: 1.08,
          duration: 0.42,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        },
        "+=0.25",
      )
      .to(
        logo,
        { scale: 2.8, opacity: 0, duration: 0.9, ease: "power4.in" },
        "+=0.05",
      )
      .to(
        line,
        { scaleX: 0, duration: 0.45, transformOrigin: "right center" },
        "<",
      )
      .to(
        intro,
        { clipPath: "inset(0 0 100% 0)", duration: 1.05, ease: "power4.inOut" },
        "-=0.12",
      );

    return () => tl.kill();
  }, [onComplete]);

  if (!show) return null;

  return (
    <div
      ref={introRef}
      className="intro"
      aria-label="Wurtz' Interactive loading"
    >
      <div className="intro-inner">
        <div ref={logoRef} className="intro-logo" aria-hidden="true">
          <img src="/assets/wurtz-logo.png" alt="Wurtz' Interactive" />
        </div>
        
      </div>
    </div>
  );
}

/* Hamburger accordion group — click the label to both navigate and toggle
   the sub-items, or click a sub-item directly. */
function HamburgerGroup({ label, onLabelClick, items }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`nav-group ${open ? "nav-group--open" : ""}`}>
      <button
        className="nav-main nav-main--has-sub"
        onClick={() => {
          setOpen((o) => !o);
          onLabelClick();
        }}
      >
        {label}
        <span className="nav-chevron" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>

      {/* The outer div is the single grid child — grid-template-rows: 0fr
          collapses ONE row to zero. If there are multiple children (li),
          each becomes its own row and 0fr only hides the first.
          The ul inside has min-height:0 so the 0fr row can actually reach 0. */}
      <div className="nav-sub-wrap">
        <ul className="nav-sub">
          {items.map((item) => (
            <li key={item.label}>
              <button className="nav-sub-item" onClick={item.onClick}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const move = (e) => {
      gsap.to(el, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.75,
        ease: "power3.out",
      });
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}

function Header({ menuOpen, setMenuOpen }) {
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  /* closeMenu=true  → behaves like a regular nav link (closes the drawer)
     closeMenu=false → accordion label: scrolls but keeps the drawer open   */
  const handleNav = (id, closeMenu = true) => {
    if (closeMenu) setMenuOpen(false);

    const scrollToSection = () =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    if (readRoute() !== "/") {
      navigate("/");
      requestAnimationFrame(() => requestAnimationFrame(scrollToSection));
      return;
    }

    scrollToSection();
  };

  /* Scroll to a specific member card by name. Always closes the drawer. */
  const handleMemberNav = (name) => {
    setMenuOpen(false);
    const id = `member-${name.toLowerCase().replace(/\s+/g, "-")}`;
    const scrollToCard = () =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });

    if (readRoute() !== "/") {
      navigate("/");
      requestAnimationFrame(() => requestAnimationFrame(scrollToCard));
      return;
    }

    scrollToCard();
  };

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event) => {
      const clickedInsideMenu = menuRef.current?.contains(event.target);
      const clickedMenuButton = menuButtonRef.current?.contains(event.target);

      if (!clickedInsideMenu && !clickedMenuButton) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [menuOpen, setMenuOpen]);

  return (
    <>
      {/* Hamburger in its own fixed element with mix-blend-mode so it blends
          against page content. Separate from header so other nav items are unaffected. */}
      <div className="hamburger-wrapper">
        <button
          ref={menuButtonRef}
          className={`menu-button ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <header className="header">
        <nav className="top-nav">
          {NAV.map(([id, label]) => (
            <button key={id} onClick={() => handleNav(id)}>
              {label}
            </button>
          ))}
        </nav>

        <button
          className="wordmark"
          onClick={() => handleNav("home")}
          aria-label="Go home"
        >
          <img src="/assets/wurtz-logo.png" alt="Wurtz' Interactive" />
        </button>
      </header>

      {/* SIDE MENU */}
      {menuOpen && (
        <div
          className="nav-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div ref={menuRef} className={`nav-menu ${menuOpen ? "open" : ""}`}>
        <nav>
          {/* Home & Contact — plain links, no subsections */}
          <button className="nav-main" onClick={() => handleNav("home")}>Home</button>

          {/* Games — with one sub-item per game */}
          <HamburgerGroup
            label="Games"
            onLabelClick={() => handleNav("games", false)}
            items={GAMES.map((g) => ({
              label: g.title,
              onClick: () => {
                setMenuOpen(false);
                navigate(`/game/${g.slug}`);
              },
            }))}
          />

          {/* About Us — with one sub-item per team member */}
          <HamburgerGroup
            label="About Us"
            onLabelClick={() => handleNav("about", false)}
            items={GAMES[0].team.map((member) => ({
              label: member.name,
              onClick: () => handleMemberNav(member.name),
            }))}
          />

          <button className="nav-main" onClick={() => handleNav("contact")}>Contact</button>
        </nav>
      </div>
    </>
  );
}

function Home() {
  return (
    <section id="home" className="section home-section">
      <video
        className="home-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/assets/home-video.mp4" type="video/mp4" />
      </video>

      <div className="home-video-overlay" />

      <div className="noise" />
      <div className="home-grid" />
      <div className="home-copy" data-reveal>
        <div className="home-bottom" data-word>
          <span>Scroll to explore</span>
          <span className="scroll-arrow">↓</span>
        </div>
      </div>
    </section>
  );
}

function About() {
  const ABOUT_ITEMS = [
    {
      title: "Raghav Lakhanpal",
      designation: "Creative Lead / Concept Artist & 3D Artist",
      text: "A 3D and concept artist focused on character modelling, environments, animation, and bringing stylized game worlds to life.",
      image: "/assets/AboutUs/Raghav.jpeg",
    },
    {
      title: "Heer Lalwani",
      designation: "3D Asset Designer & 2D Concept Artist",
      text: "A 3D asset designer and 2D concept artist who helps shape the visual identity of our games, from early concepts to detailed game-ready assets.",
      image: "/assets/AboutUs/Heer.jpeg",
    },
    {
      title: "Rimee Jain",
      designation: "3D Asset Designer/Concept Artist & Environment Artist",
      text: "A 3D asset designer and 2D concept artist with a focus on level art, combining visual storytelling and environment design to create engaging game spaces.",
      image: "/assets/AboutUs/Rimi.jpeg",
    },
    {
      title: "Aryan Sachan",
      designation: "Level Designer & 3D Environment Artist",
      text: "Our level designer and 3D artist, responsible for shaping playable environments and bringing them to life through level art and 3D assets.",
      image: "/assets/AboutUs/Aryan.jpeg",
    },
    {
      title: "Mridul Sharma",
      designation: "Game Developer",
      text: "A game developer focused on building gameplay systems and turning creative ideas into functional, interactive experiences.",
      image: "/assets/AboutUs/Mridul.jpeg",
    },
    {
      title: "Tanmay Neema",
      designation: "Game Developer",
      text: "A game developer working behind the scenes to build systems, mechanics, and the technical foundation that brings our games to life.",
      image: "/assets/AboutUs/Tanmay.jpeg",
    },
  ];

  return (
    <section id="about" className="section about-section">
      <div className="about-header">
        <h2>ABOUT US</h2>
      </div>

      <div className="about-cards">
        {ABOUT_ITEMS.map((item, index) => (
          <article
            id={`member-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
            className={`about-card ${
              index % 2 === 0 ? "about-card-left" : "about-card-right"
            }`}
            key={item.title}
          >
            <div className="about-card-image">
              <img src={item.image} alt={item.title} />
            </div>

            <div className="about-card-info">
              <span className="about-card-number">{item.number}</span>

              <h3>{item.title}</h3>
              <span className="about-card-designation">{item.designation}</span>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Games() {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const dragState = useRef({
    dragging: false,
    startX: 0,
    currentX: 0,
    startTranslate: 0,
  });

  const getStep = () => {
    const track = trackRef.current;
    if (!track) return 0;

    const card = track.querySelector(".game-slide");
    if (!card) return 0;

    return card.getBoundingClientRect().width + 40;
  };

  const getTranslate = (index) => {
    const step = getStep();
    const viewport = window.innerWidth;

    const cardWidth = step - 40;

    return -(index * step) + (viewport / 2 - cardWidth / 2);
  };

  const goToSlide = (index, animate = true) => {
    const nextIndex = Math.max(0, Math.min(GAMES.length - 1, index));

    setActiveIndex(nextIndex);

    if (!trackRef.current) return;

    gsap.to(trackRef.current, {
      x: getTranslate(nextIndex),
      duration: animate ? 0.75 : 0,
      ease: "power4.out",
      overwrite: true,
    });
  };

  useEffect(() => {
    const handleResize = () => {
      goToSlide(activeIndex, false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeIndex]);

  const handlePointerDown = (event) => {
    if (!trackRef.current) return;

    /* Read the slide here, while event.target is still the real element —
       setPointerCapture below retargets every later pointer event (and the
       compatibility click) to the track itself. */
    const slide = event.target.closest?.(".game-slide");

    dragState.current = {
      dragging: true,
      startX: event.clientX,
      currentX: event.clientX,
      startTranslate: gsap.getProperty(trackRef.current, "x"),
      slideIndex: slide ? Number(slide.dataset.index) : -1,
    };

    trackRef.current.setPointerCapture?.(event.pointerId);
    trackRef.current.classList.add("dragging");
  };

  const handlePointerMove = (event) => {
    if (!dragState.current.dragging || !trackRef.current) return;

    const delta = event.clientX - dragState.current.startX;
    dragState.current.currentX = event.clientX;

    const newX = dragState.current.startTranslate + delta;

    gsap.set(trackRef.current, {
      x: newX,
    });
  };

  const handlePointerUp = (event) => {
    if (!dragState.current.dragging || !trackRef.current) return;

    dragState.current.dragging = false;

    trackRef.current.releasePointerCapture?.(event.pointerId);
    trackRef.current.classList.remove("dragging");

    const delta = dragState.current.currentX - dragState.current.startX;
    const { slideIndex } = dragState.current;

    const threshold = 80;

    if (Math.abs(delta) > threshold) {
      goToSlide(activeIndex + (delta < 0 ? 1 : -1));
      return;
    }

    /* Barely moved — treat it as a click. Because pointer capture swallows the
       real click event, opening the game has to happen here. An off-centre
       slide gets centred first rather than opening straight away. */
    const isClick = Math.abs(delta) <= 8 && slideIndex >= 0;

    if (isClick && slideIndex !== activeIndex) {
      goToSlide(slideIndex);
      return;
    }

    goToSlide(activeIndex);

    if (isClick) navigate(`/game/${GAMES[slideIndex].slug}`);
  };

  return (
    <section id="games" className="section games-section">
      <div className="section-intro games-title" data-reveal>
        <h2>
          <span data-word>OUR GAMES</span>
        </h2>
      </div>

      <div className="games-slider">
        <div
          ref={trackRef}
          className="games-track"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={(event) => {
            if (dragState.current.dragging) {
              handlePointerUp(event);
            }
          }}
        >
          {GAMES.map((game, index) => (
            <article
              className={`game-slide ${index === activeIndex ? "active" : ""}`}
              key={game.number}
              data-index={index}
              role="link"
              tabIndex={0}
              aria-label={`Open ${game.title}`}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(`/game/${game.slug}`);
                }
              }}
            >
              <div className="game-image-wrap">
                <img
                  src={game.image}
                  alt={game.title}
                  className="game-image"
                  draggable="false"
                />

                <span className="game-open-hint">View game</span>
              </div>

              <div className="game-caption">
                <span className="game-number">{game.number}</span>

                <h3>{game.title}</h3>
              </div>
            </article>
          ))}
        </div>

        <div className="games-progress">
          <span className="progress-current">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${((activeIndex + 1) / GAMES.length) * 100}%`,
              }}
            />
          </div>

          <span className="progress-total">
            {String(GAMES.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

/* Horizontally draggable strip. Backed by a real overflow container so touch,
   trackpad and keyboard scrolling all work for free; the pointer handlers only
   add click-and-drag for mouse users. */
function DragCarousel({ items, label }) {
  const trackRef = useRef(null);
  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,   // px/ms — tracked for momentum on release
  });

  const onPointerDown = (event) => {
    const track = trackRef.current;
    if (!track) return;

    /* Kill any running momentum tween so a new drag starts clean */
    gsap.killTweensOf(track, "scrollLeft");

    drag.current = {
      active: true,
      startX: event.clientX,
      startScroll: track.scrollLeft,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
    };

    track.setPointerCapture?.(event.pointerId);
    track.classList.add("dragging");
  };

  const onPointerMove = (event) => {
    const track = trackRef.current;
    if (!track || !drag.current.active) return;

    const now = performance.now();
    const dt = now - drag.current.lastTime;
    if (dt > 0) {
      /* Exponential smoothing keeps velocity stable without lag */
      const raw = (drag.current.lastX - event.clientX) / dt;
      drag.current.velocity = drag.current.velocity * 0.6 + raw * 0.4;
    }
    drag.current.lastX = event.clientX;
    drag.current.lastTime = now;

    track.scrollLeft =
      drag.current.startScroll - (event.clientX - drag.current.startX);
  };

  const onPointerUp = (event) => {
    const track = trackRef.current;
    if (!track || !drag.current.active) return;

    drag.current.active = false;
    track.releasePointerCapture?.(event.pointerId);
    track.classList.remove("dragging");

    const { velocity } = drag.current;

    /* Only coast if the user was actually moving — tiny releases snap back */
    if (Math.abs(velocity) > 0.05) {
      const momentum = velocity * 420; /* tune: higher = longer coast */
      const target = Math.max(
        0,
        Math.min(track.scrollLeft + momentum, track.scrollWidth - track.clientWidth),
      );

      gsap.to(track, {
        scrollLeft: target,
        duration: 0.85,
        ease: "power3.out",
        overwrite: true,
      });
    }
  };

  return (
    <div
      ref={trackRef}
      className="shot-track"
      role="region"
      aria-label={label}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {items.map((src, index) => (
        <figure className="shot" key={`${src}-${index}`}>
          <img
            src={src}
            alt={`${label} ${index + 1}`}
            draggable="false"
            loading="lazy"
          />
        </figure>
      ))}
    </div>
  );
}

function GamePage({ game }) {
  if (!game) {
    return (
      <section className="section game-missing">
        <h2>Game not found</h2>
        <button className="game-back" onClick={() => {
          navigate("/");
          requestAnimationFrame(() => requestAnimationFrame(() =>
            document.getElementById("games")?.scrollIntoView({ behavior: "smooth" })
          ));
        }}>
          ← Return to Our Games
        </button>
      </section>
    );
  }

  return (
    <article className="game-page">
      {/* Full-bleed landscape hero */}
      <div className="game-hero">
        {/* key=game.video forces React to unmount/remount the element when
            the src changes — without this the browser reuses the same <video>
            node and ignores the new <source>, so the wrong video keeps playing. */}
        <video
          key={game.video}
          className="game-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={game.image}
          aria-hidden="true"
        >
          <source src={game.video} type="video/mp4" />
        </video>

        <div className="game-hero-fade" />
      </div>

      <div className="game-page-inner">
        <button className="game-back" onClick={() => {
          navigate("/");
          requestAnimationFrame(() => requestAnimationFrame(() =>
            document.getElementById("games")?.scrollIntoView({ behavior: "smooth" })
          ));
        }}>
          ← Return to Our Games
        </button>

        {/* Name + description */}
        <header className="game-intro">
          <span className="game-page-number">{game.number}</span>
          <h1 className="game-page-title">{game.title}</h1>
          <p className="game-page-description">{game.description}</p>
        </header>
      </div>

      {/* Screenshots */}
      {game.screenshots.length > 0 && (
        <section className="game-block game-shots">
          <div className="game-block-head">
            <h2>Screenshots</h2>

            {game.screenshots.length > 1 && (
              <span className="game-block-hint">Drag to explore →</span>
            )}
          </div>

          <DragCarousel
            items={game.screenshots}
            label={`${game.title} screenshot`}
          />
        </section>
      )}

      {/* Team */}
      <section className="game-block game-team">
        <div className="game-block-head">
          <h2>Meet the Team</h2>
        </div>

        <ul className="team-list">
          {game.team.map((member) => (
            <li className="team-row" key={member.name}>
              <span className="team-name">{member.name}</span>

              <span className="team-roles">
                {member.roles.map((role) => (
                  <span className="team-role" key={role}>
                    {role}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}


createRoot(document.getElementById("root")).render(<App />);
