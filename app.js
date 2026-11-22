
(() => {
  const cfg = window.INVITATION_CONFIG || {};

  // Countdown
  const target = new Date("2026-12-13T19:00:00+03:00").getTime();
  const ids = ["days", "hours", "minutes", "seconds"];

  function tick() {
    const ms = Math.max(0, target - Date.now());

    const values = [
      Math.floor(ms / 86400000),
      Math.floor((ms % 86400000) / 3600000),
      Math.floor((ms % 3600000) / 60000),
      Math.floor((ms % 60000) / 1000)
    ];

    ids.forEach((id, i) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = String(values[i]).padStart(2, "0");
      }
    });
  }

  tick();
  setInterval(tick, 1000);

  // Google Maps
  const map = document.getElementById("mapLink");

  if (map) {
    if (cfg.mapsUrl) {
      map.href = cfg.mapsUrl;
    } else {
      map.addEventListener("click", (e) => {
        e.preventDefault();
        alert("سنضيف رابط الصالة قبل النشر.");
      });
    }
  }

  // YouTube Music
  const playButton = document.getElementById("playMusic");
  const player = document.getElementById("youtubePlayer");
  const record = document.getElementById("record");

  if (playButton && player) {
    playButton.addEventListener("click", () => {
      const url = cfg.youtubeUrl || "";

      const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
      );

      if (!match) {
        alert("رابط الأغنية غير صحيح. تأكدي من ملف config.js.");
        return;
      }

      const videoId = match[1];

      player.hidden = false;

player.innerHTML = `
  <iframe
    src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&rel=0"
    title="أغنية أنس وفاطمة"
    allow="autoplay; encrypted-media"
    referrerpolicy="strict-origin-when-cross-origin">
  </iframe>
`;

record.classList.add("playing");
playButton.textContent = "Ⅱ";

      if (record) {
        record.classList.add("playing");
      }

      playButton.textContent = "Ⅱ";
    });
  }

  // RSVP Form
  const form = document.getElementById("rsvpForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const status = document.getElementById("formStatus");
      const data = Object.fromEntries(
        new FormData(form).entries()
      );

      if (!cfg.rsvpEndpoint) {
        status.textContent =
          "النموذج جاهز، لكن يلزم ربط Google Sheets لاستقبال الردود فعلياً.";
        return;
      }

      try {
        await fetch(cfg.rsvpEndpoint, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        status.textContent = "شكراً لك، تم إرسال تأكيدك.";
        form.reset();

      } catch (error) {
        status.textContent =
          "تعذر الإرسال، يرجى المحاولة مجدداً.";
      }
    });
  }

/* =================================
   SCROLL REVEAL TRANSITIONS
================================= */

document.body.classList.add("js-transitions");

const revealItems = document.querySelectorAll(`
  .artwork,
  .invitation-image,
  .music-section,
  .countdown-section,
  .rsvp-section,
  .venue-section,
  footer
`);

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: "0px 0px -35px 0px"
});

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

})();
