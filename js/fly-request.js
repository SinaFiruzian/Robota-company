gsap.registerPlugin(Flip, ScrollTrigger);

    const flyBtn = document.getElementById("flyRequestBtn");

    const slots = {
      hero: document.querySelector("#heroRequestSlot .request-anchor"),
      nav: document.querySelector("#navRequestSlot .request-anchor"),
      footer: document.querySelector("#footerRequestSlot .request-anchor")
    };

    let currentSlot = null;
    let isAnimating = false;
    let queuedTarget = null;

    // دکمه را داخل اولین Slot قرار می‌دهیم
    slots.hero.appendChild(flyBtn);
    currentSlot = slots.hero;

    function moveButton(target) {

      if (target === currentSlot) return;

      if (isAnimating) {

        queuedTarget = target;
        return;

      }
      isAnimating = true;

      const state = Flip.getState(flyBtn, {
        props: "borderRadius,boxShadow,backgroundColor,color"
      });

      target.appendChild(flyBtn);

      Flip.from(state, {
        duration: .55,
        ease: "power2.out",
        absolute: true,
        nested: true,
        scale: false,

        onEnter: elements => {
          gsap.fromTo(
            elements,
            {
              opacity: 0.85,
              scale: 0.94
            },
            {
              opacity: 1,
              scale: 1,
              duration: 0.35,
              ease: "power3.out"
            }
          );
        },

        onComplete() {

          currentSlot = target;

          isAnimating = false;

          if (queuedTarget) {

            const next = queuedTarget;

            queuedTarget = null;

            moveButton(next);

          }

        }
      });

    }

    // ------------------------------
    // تشخیص اینکه دکمه باید کجا باشد
    // ------------------------------

    const hero = document.getElementById("hero");
    const footer = document.querySelector(".footer-cta");

    let activeArea = "hero";

    function changeArea(area) {

      if (area === activeArea) return;

      activeArea = area;

      switch (area) {

        case "hero":
          moveButton(slots.hero);
          break;

        case "nav":
          moveButton(slots.nav);
          break;

        case "footer":
          moveButton(slots.footer);
          break;

      }

    }

    // ------------------------------
    // Hero
    // ------------------------------

    ScrollTrigger.create({

      trigger: hero,

      start: "top top",

      end: "bottom 35%",

      onEnter() {
        changeArea("hero");
      },

      onEnterBack() {
        changeArea("hero");
      },

      onLeave() {
        changeArea("nav");
      }

    });

    // ------------------------------
    // Footer
    // ------------------------------

    ScrollTrigger.create({
      trigger: document.body,

      start: "bottom-=30 bottom",

      end: "bottom bottom",

      onEnter() {
        changeArea("footer");
      },

      onLeaveBack() {
        changeArea("nav");
      }
    });
    // ------------------------------
    // Resize
    // ------------------------------

    window.addEventListener("resize", () => {

      ScrollTrigger.refresh();

    });

    // ------------------------------
    // اولین وضعیت
    // ------------------------------

    let resizeTimer;

    window.addEventListener("resize", () => {

      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {

        ScrollTrigger.refresh();

      }, 150);

    });

    window.addEventListener("load", () => {

      ScrollTrigger.refresh();

    });