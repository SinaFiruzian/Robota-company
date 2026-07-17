const batteryIcon = `<svg viewBox="0 0 25 12" width="22" height="11"><rect x="1" y="1" width="20" height="10" rx="2.5" stroke="white" stroke-opacity=".6" fill="none"/><rect x="2.5" y="2.5" width="17" height="7" rx="1.5" fill="white"/><rect x="22" y="4" width="2" height="4" rx="1" fill="white" fill-opacity=".6"/></svg>`;

    const signalIcon = `<svg viewBox="0 0 18 12" width="16" height="11"><rect x="0" y="7" width="3" height="5" rx="1" fill="white"/><rect x="5" y="5" width="3" height="7" rx="1" fill="white"/><rect x="10" y="3" width="3" height="9" rx="1" fill="white"/><rect x="15" y="0" width="3" height="12" rx="1" fill="white"/></svg>`;

    const starIcon = (filled) =>
      `<svg viewBox="0 0 20 20" fill="${filled ? "#ffb020" : "rgba(140,160,255,.2)"}"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 14.9l-5.2 2.9 1-5.9L1.5 7.7l5.9-.8L10 1.5z"/></svg>`;

    document.getElementById("statusIcons").innerHTML =
      signalIcon + batteryIcon;

    // ===================== COMMENTS =====================

    const comment = [
  {
    name: "علیرضا مرادی",
    time: "الان",
    message:
      "از مرحله مشاوره تا تحویل پروژه، همه چیز منظم و شفاف پیش رفت. نتیجه دقیقاً مطابق نیاز مجموعه ما بود.",
    stars: 5,
  },
  {
    name: "سارا حسینی",
    time: "۳ دقیقه پیش",
    message:
      "قبل از شروع پروژه تمام جزئیات فنی و زمان‌بندی را با حوصله توضیح دادند. ارتباط با تیم در تمام مراحل عالی بود.",
    stars: 5,
  },
  {
    name: "محمد کاظمی",
    time: "۷ دقیقه پیش",
    message:
      "پروژه سامانه داخلی شرکت در زمان مقرر تحویل داده شد و حتی بعد از اجرا هم پشتیبانی مناسبی دریافت کردیم.",
    stars: 5,
  },
  {
    name: "نگار احمدی",
    time: "۱۲ دقیقه پیش",
    message:
      "برای طراحی سیستم الکترونیکی با روبوتا همکاری کردیم. کیفیت اجرا و دقت تیم فنی کاملاً رضایت‌بخش بود.",
    stars: 5,
  },
];

    // ===================== ELEMENTS =====================

    const deck = document.getElementById("notifDeck");
    const quoteText = document.getElementById("quoteText");
    const quoteName = document.getElementById("quoteName");
    const quoteStars = document.getElementById("quoteStars");

    // داخل div#dots فقط یک span با id="progressFill" قرار بده
    const progressFill = document.getElementById("progressFill");

    let current = -1;
    let timer;

    // ===================== CARD =====================

    function makeCard(t) {
      const el = document.createElement("div");

      el.className = "notif-card";
      el.dataset.level = "enter";

      el.innerHTML = `
      <div class="app-icon"></div>

      <div class="notif-body">
          <div class="notif-top">
              <span class="app-name"></span>
              <span class="notif-time">${t.time}</span>
          </div>

          <div class="sender">${t.name}</div>
          <div class="msg">${t.message}</div>
      </div>
  `;

      return el;
    }

    // ===================== PROGRESS =====================

    function resetProgress() {
      progressFill.style.transition = "none";
      progressFill.style.width = "0%";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          progressFill.style.transition = "width 4.8s linear";
          progressFill.style.width = "100%";
        });
      });
    }

    // ===================== CHANGE COMMENT =====================

    function goTo(i) {
      const t = comment[i];

      const cards = [...deck.querySelectorAll(".notif-card")];

      cards.forEach((card) => {
        const lvl = card.dataset.level;

        if (lvl === "0") card.dataset.level = "1";
        else if (lvl === "1") card.dataset.level = "2";
        else if (lvl === "2") {
          card.dataset.level = "exit";
          setTimeout(() => card.remove(), 520);
        }
      });

      const fresh = makeCard(t);

      deck.appendChild(fresh);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fresh.dataset.level = "0";
        });
      });

      quoteText.style.opacity = 0;

      setTimeout(() => {
        // << >> حذف شد
        quoteText.textContent = t.message;

        quoteName.textContent = t.name;

        quoteStars.innerHTML = Array.from(
          { length: 5 },
          (_, k) => starIcon(k < t.stars)
        ).join("");

        quoteText.style.opacity = 1;
      }, 220);

      current = i;
    }

    // ===================== TIMER =====================

    function startTimer() {
      clearInterval(timer);

      resetProgress();

      timer = setInterval(() => {
        goTo((current + 1) % comment.length);
        resetProgress();
      }, 4800);
    }

    // ===================== START =====================

    goTo(0);
    startTimer();