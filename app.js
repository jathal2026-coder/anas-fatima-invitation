
(() => {
  const cfg = window.INVITATION_CONFIG || {};

  // =================================
  // COUNTDOWN
  // =================================

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


  // =================================
  // GOOGLE MAPS
  // =================================

  const map = document.getElementById("mapLink");

  if (map && cfg.mapsUrl) {
    map.href = cfg.mapsUrl;
  }


  // =================================
  // LOCAL MUSIC PLAYER
  // =================================

  const playButton = document.getElementById("playMusic");
  const audio = document.getElementById("weddingAudio");
  const record = document.getElementById("record");

  if (playButton && audio) {

    function updatePlayingState(playing) {
      if (record) {
        record.classList.toggle("playing", playing);
      }

      playButton.textContent = playing ? "Ⅱ" : "▶";

      playButton.setAttribute(
        "aria-label",
        playing ? "إيقاف الأغنية مؤقتاً" : "تشغيل الأغنية"
      );
    }

    playButton.addEventListener("click", async () => {

      if (!audio.paused) {
        audio.pause();
        return;
      }

      try {
        await audio.play();
      } catch (error) {
        console.error("Music playback error:", error);
        updatePlayingState(false);
        alert("تعذر تشغيل الأغنية. تأكدي من اتصال الإنترنت وملف الموسيقى.");
      }

    });

    audio.addEventListener("play", () => {
      updatePlayingState(true);
    });

    audio.addEventListener("pause", () => {
      updatePlayingState(false);
    });

    audio.addEventListener("ended", () => {
      updatePlayingState(false);
    });

    audio.addEventListener("error", () => {
      updatePlayingState(false);
      console.error("تعذر تحميل ملف wedding-song.m4a");
    });
  }


  // =================================
  // RSVP FORM
  // =================================

  const form = document.getElementById("rsvpForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const status = document.getElementById("formStatus");

      const data = Object.fromEntries(
        new FormData(form).entries()
      );

      if (!cfg.rsvpEndpoint) {
        if (status) {
          status.textContent =
            "النموذج جاهز، لكن يلزم ربط Google Sheets لاستقبال الردود فعلياً.";
        }

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

        if (status) {
          status.textContent = "شكراً لك، تم إرسال تأكيدك.";
        }

        form.reset();

      } catch (error) {
        if (status) {
          status.textContent =
            "تعذر الإرسال، يرجى المحاولة مجدداً.";
        }
      }
    });
  }


  // =================================
  // SCROLL REVEAL TRANSITIONS
  // =================================

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

  if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });

  } else {

    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });

  }

})();
