const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)").matches;

(() => {
  const loader = document.querySelector(".loader");
  const body = document.body;
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    body.classList.remove("is-loading");
    body.classList.add("is-loaded");
    loader?.classList.add("is-gone");
  };

  if (!loader || reduceMotion) {
    finish();
    return;
  }

  window.setTimeout(finish, Math.max(0, 950 - performance.now()));
  window.addEventListener("load", () => window.setTimeout(finish, 160), { once: true });
})();

(() => {
  const toggle = document.querySelector(".menu-btn");
  const nav = document.querySelector("#nav");
  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.matchMedia("(min-width: 901px)").addEventListener?.("change", (event) => {
    if (event.matches) closeMenu();
  });
})();

(() => {
  const bar = document.querySelector("#progressBar");
  if (!bar) return;
  let queued = false;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    queued = false;
  };

  const requestUpdate = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
})();

(() => {
  const links = [...document.querySelectorAll(".nav a[href^='#']")];
  const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if (!links.length || !sections.length) return;

  let current = "";
  const setCurrent = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-current", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  const update = () => {
    const marker = window.innerHeight * 0.38;
    let active = "";

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= marker) active = section.id;
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      active = sections[sections.length - 1].id;
    }

    if (active !== current) {
      current = active;
      setCurrent(active);
    }
  };

  let queued = false;
  const requestUpdate = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      update();
    });
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
})();

(() => {
  const targets = [...document.querySelectorAll(".reveal")];
  if (!targets.length) return;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-in"));
    return;
  }

  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      instance.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  targets.forEach((target) => observer.observe(target));
})();

(() => {
  const headings = [...document.querySelectorAll("[data-split]")];
  if (!headings.length) return;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    headings.forEach((heading) => heading.classList.add("is-in"));
    return;
  }

  headings.forEach((heading) => {
    let wordIndex = 0;
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement?.closest(".split-word")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
          return;
        }
        const word = document.createElement("span");
        const inner = document.createElement("span");
        word.className = "split-word";
        inner.textContent = part;
        inner.style.setProperty("--i", wordIndex++);
        word.appendChild(inner);
        fragment.appendChild(word);
      });
      node.parentNode.replaceChild(fragment, node);
    });
  });

  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      instance.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  headings.forEach((heading) => observer.observe(heading));
})();

(() => {
  const chapters = [...document.querySelectorAll(".story__chapter")];
  const visual = document.querySelector(".story__visual");
  const photo = document.querySelector("#storyImage");
  const caption = document.querySelector("#storyCaption");
  const index = document.querySelector("#storyIndex");
  if (!chapters.length || !visual || !photo) return;

  const mobile = window.matchMedia("(max-width: 900px)");
  let activeChapter = null;
  let pendingSrc = "";

  const setActive = (chapter) => {
    if (!chapter || chapter === activeChapter) return;
    activeChapter = chapter;

    chapters.forEach((item) => item.classList.toggle("is-active", item === chapter));
    if (caption) caption.textContent = chapter.dataset.caption || "";
    if (index) index.textContent = chapter.dataset.index || "";

    const alt = chapter.dataset.caption ? `${chapter.dataset.caption} — Sandeep` : "Sandeep";
    const src = chapter.dataset.image;

    if (!src || photo.getAttribute("src") === src) {
      pendingSrc = "";
      photo.classList.remove("is-changing");
      photo.alt = alt;
      return;
    }

    pendingSrc = src;
    photo.classList.add("is-changing");
    const preload = new Image();

    preload.onload = () => {
      if (pendingSrc !== src) return;
      photo.src = src;
      photo.alt = alt;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => photo.classList.remove("is-changing"));
      });
    };

    preload.onerror = () => {
      if (pendingSrc === src) photo.classList.remove("is-changing");
    };

    preload.src = src;
  };

  const update = () => {
    const viewport = window.innerHeight;
    const anchor = mobile.matches
      ? Math.min(viewport - 80, Math.max(140, visual.getBoundingClientRect().bottom + 24))
      : viewport * 0.46;

    let chosen = null;

    for (const chapter of chapters) {
      const rect = chapter.getBoundingClientRect();
      if (rect.bottom > anchor && rect.top < viewport - 40) {
        chosen = chapter;
        break;
      }
    }

    if (!chosen) {
      const firstRect = chapters[0].getBoundingClientRect();
      const lastRect = chapters[chapters.length - 1].getBoundingClientRect();
      if (lastRect.bottom < anchor) chosen = chapters[chapters.length - 1];
      else if (firstRect.top > viewport - 40) chosen = chapters[0];
    }

    if (chosen) setActive(chosen);
  };

  let queued = false;
  const requestUpdate = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      update();
    });
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("load", requestUpdate);
  document.fonts?.ready.then(requestUpdate);
  update();
})();

(() => {
  const dialog = document.querySelector("#lightbox");
  const image = document.querySelector("#lightboxImage");
  const caption = document.querySelector("#lightboxCaption");
  const shots = [...document.querySelectorAll(".shot")];
  if (!dialog || !image || !shots.length || typeof dialog.showModal !== "function") return;

  let activeIndex = 0;

  const showPhoto = (nextIndex) => {
    activeIndex = (nextIndex + shots.length) % shots.length;
    const shot = shots[activeIndex];
    const shotImage = shot.querySelector("img");
    const cap = shot.querySelector(".shot__cap");
    const number = cap?.querySelector("i")?.textContent.trim() || "";
    const text = cap ? cap.cloneNode(true) : null;
    text?.querySelector("i")?.remove();
    const label = text?.textContent.trim() || "";

    image.src = shot.dataset.full || shot.getAttribute("href");
    image.alt = shotImage?.alt || "Sandeep photo";
    if (caption) caption.textContent = [number, label].filter(Boolean).join(" — ");

    if (!dialog.open) {
      dialog.showModal();
      document.body.classList.add("lightbox-open");
    }
  };

  shots.forEach((shot, index) => {
    shot.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      showPhoto(index);
    });
  });

  dialog.querySelector(".lightbox__close")?.addEventListener("click", () => dialog.close());
  dialog.querySelector(".lightbox__prev")?.addEventListener("click", () => showPhoto(activeIndex - 1));
  dialog.querySelector(".lightbox__next")?.addEventListener("click", () => showPhoto(activeIndex + 1));

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
  });

  window.addEventListener("keydown", (event) => {
    if (!dialog.open) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(activeIndex + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPhoto(activeIndex - 1);
    }
  });
})();

(() => {
  if (!finePointer || reduceMotion) return;

  const cursor = document.querySelector(".cursor");
  const dot = document.querySelector(".cursor__dot");
  const ring = document.querySelector(".cursor__ring");
  const label = document.querySelector(".cursor__label");
  if (!cursor || !dot || !ring) return;

  cursor.classList.add("is-hidden");
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let ringX = x;
  let ringY = y;
  let seen = false;

  const move = (event) => {
    if (event.pointerType === "touch") return;
    x = event.clientX;
    y = event.clientY;

    if (!seen) {
      seen = true;
      ringX = x;
      ringY = y;
      cursor.classList.remove("is-hidden");
      cursor.classList.add("is-ready");
    }

    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;

    const target = event.target instanceof Element
      ? event.target.closest("a, button, .shot, .interest")
      : null;

    cursor.classList.toggle("is-active", Boolean(target));

    if (label) {
      if (target?.classList.contains("shot")) label.textContent = "VIEW";
      else if (target?.closest(".interest")) label.textContent = "LOOK";
      else if (target) label.textContent = "GO";
      else label.textContent = "VIEW";
    }
  };

  const follow = () => {
    ringX += (x - ringX) * 0.16;
    ringY += (y - ringY) * 0.16;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    window.requestAnimationFrame(follow);
  };

  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("scroll", () => cursor.classList.remove("is-active"), { passive: true });
  document.documentElement.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
  document.documentElement.addEventListener("mouseenter", () => {
    if (seen) cursor.classList.remove("is-hidden");
  });
  window.addEventListener("blur", () => cursor.classList.add("is-hidden"));
  window.addEventListener("focus", () => {
    if (seen) cursor.classList.remove("is-hidden");
  });

  window.requestAnimationFrame(follow);
})();
