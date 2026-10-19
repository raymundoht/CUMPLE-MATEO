(function () {
  "use strict";
  const cfg = window.INVITACION, core = window.InvitacionCore;
  if (!cfg || !core) return;
  const $ = id => document.getElementById(id);
  const demo = cfg.demo !== false;
  let currentMessage = "", toastTimer, activeVoice = null, voiceToken = 0, activeAudio = null;
  const showFull = cfg.nombreCompleto && cfg.nombreCompleto !== cfg.nombre;
  if (!showFull) cfg.nombreCompleto = cfg.nombre;
  const fields = ["nombre", "nombreCompleto", "edad", "titulo", "mensaje", "lugar", "direccion", "indicacion", "vestimenta", "fechaLimite"];
  fields.forEach(key => document.querySelectorAll('[data-field="' + key + '"]').forEach(el => { el.textContent = cfg[key]; }));
  document.querySelectorAll(".hero-fullname").forEach(el => { el.hidden = !showFull; });
  if (/\s/.test(cfg.nombre.trim()) || cfg.nombre.length > 8) $("hero-name").classList.add("is-long");
  document.title = cfg.nombre + " · El partido del año";
  Object.entries(cfg.colores || {}).forEach(([key, value]) => {
    const cssName = { acento: "--accent", fondo: "--dark", dorado: "--gold", papel: "--paper" }[key];
    if (cssName && /^#[a-fA-F\d]{6}$/.test(value)) document.documentElement.style.setProperty(cssName, value);
  });
  document.querySelectorAll("[data-demo]").forEach(el => { el.hidden = !demo; });
  const start = new Date(cfg.fecha), end = new Date(cfg.fechaFin);
  const dateValid = Number.isFinite(start.getTime()) && Number.isFinite(end.getTime());
  const fmt = (date, options) => new Intl.DateTimeFormat("es-MX", { timeZone: cfg.zonaHoraria, ...options }).format(date);
  const upperFirst = text => text.charAt(0).toUpperCase() + text.slice(1);
  if (dateValid) {
    $("poster-date").textContent = (fmt(start, { day: "numeric" }) + " " + fmt(start, { month: "long" })).toUpperCase();
    const compactHour = date => fmt(date, { hour: "numeric", minute: "2-digit" }).replace(/\s*a\.?\s*m\.?/i, " AM").replace(/\s*p\.?\s*m\.?/i, " PM");
    $("poster-time").textContent = compactHour(start) + " — " + compactHour(end);
    $("header-date-text").textContent = fmt(start, { day: "numeric", month: "short", year: "numeric" }).toUpperCase();
    $("hero-date-text").textContent = upperFirst(fmt(start, { weekday: "long", day: "numeric", month: "long" })) + " · " + fmt(start, { hour: "numeric", minute: "2-digit" });
    $("event-weekday").textContent = fmt(start, { weekday: "long" }).toUpperCase();
    $("event-day").textContent = fmt(start, { day: "numeric" });
    $("event-month").textContent = fmt(start, { month: "long" }).toUpperCase() + " · " + fmt(start, { year: "numeric" });
    $("event-time").textContent = fmt(start, { hour: "numeric", minute: "2-digit" }) + " a " + fmt(end, { hour: "numeric", minute: "2-digit" });
  } else {
    $("hero-date-text").textContent = "Fecha por confirmar";
    $("event-weekday").textContent = "PRÓXIMAMENTE";
    $("event-day").textContent = "—";
    $("event-month").textContent = "FECHA POR CONFIRMAR";
    $("event-time").textContent = "Horario por confirmar";
    $("calendar-button").disabled = true;
  }
  const mapUrl = new URL(cfg.ubicacionMaps || "https://www.google.com/maps/");
  if (mapUrl.protocol === "https:") $("map-link").href = mapUrl.href;
  const tick = () => {
    const cd = core.countdown(cfg.fecha);
    if (!cd) { $("countdown-title").textContent = "Pronto tendremos fecha."; return; }
    ["days", "hours", "minutes", "seconds"].forEach(key => {
      const value = core.pad(cd[key]), el = $("cd-" + key);
      if (el.textContent !== value) {
        el.textContent = value;
        if (document.documentElement.classList.contains("motion-ready") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && el.animate) {
          el.animate([{ opacity: 0.3, transform: "translateY(-6px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 260, easing: "cubic-bezier(.16,1,.3,1)" });
        }
      }
    });
    if (cd.finished) $("countdown-title").textContent = Date.now() < end.getTime() ? "¡YA COMENZÓ EL PARTIDO!" : "¡GRACIAS POR CELEBRAR!";
  };
  tick();
  let countdownTimer = setInterval(tick, 1000);
  function toast(text) { clearTimeout(toastTimer); $("toast").textContent = text; $("toast").hidden = false; toastTimer = setTimeout(() => { $("toast").hidden = true; }, 3600); }
  $("calendar-button").addEventListener("click", () => {
    const data = core.calendar(cfg);
    if (!data) { toast("Revisa la fecha y el horario de la invitación."); return; }
    const url = URL.createObjectURL(new Blob([data], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "cumple-" + cfg.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "-") + ".ics";
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Abre el archivo descargado para agregar la fiesta a tu calendario.");
  });
  function setSpeaking(id, speaking) {
    const el = $(id); if (!el) return;
    el.classList.toggle("speaking", speaking); el.setAttribute("aria-pressed", String(speaking));
    el.setAttribute("aria-label", (speaking ? "Detener a " : "Escuchar a ") + cfg.personajes[id].nombre);
    el.querySelector(".tap-label").textContent = speaking ? "Hablando…" : "Escuchar";
    $("stop-voice").hidden = !speaking;
  }
  function stopVoice() {
    voiceToken++;
    if (activeAudio) { activeAudio.pause(); activeAudio.currentTime = 0; activeAudio = null; }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (activeVoice) setSpeaking(activeVoice, false);
    activeVoice = null; $("stop-voice").hidden = true;
  }
  function speakOnDevice(id, token) {
    const character = cfg.personajes[id];
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setSpeaking(id, false); activeVoice = null;
      toast("Este navegador no permite voz. Puedes leer la narración junto a las fotos.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(character.frase);
    const voices = speechSynthesis.getVoices();
    const spanish = voices.filter(voice => /^es(?:-|_)/i.test(voice.lang) || voice.lang.toLowerCase() === "es");
    const regional = spanish.filter(voice => /es[-_](mx|419)/i.test(voice.lang));
    const candidates = regional.length ? regional : spanish;
    if (candidates.length) utterance.voice = candidates[id === "ronaldo" && candidates.length > 1 ? 1 : 0];
    utterance.lang = "es-MX"; utterance.rate = character.velocidad || 1; utterance.pitch = character.tono || 1; utterance.volume = 1;
    utterance.onstart = () => { if (token === voiceToken) setSpeaking(id, true); };
    utterance.onend = () => { if (token === voiceToken) { setSpeaking(id, false); activeVoice = null; } };
    utterance.onerror = event => {
      if (token !== voiceToken) return;
      setSpeaking(id, false); activeVoice = null;
      if (!/cancel|interrupt/.test(event.error || "")) toast("La voz no está disponible ahora. La frase también aparece en pantalla.");
    };
    // Keep a reference: some browsers stop utterances that are garbage-collected.
    window.invitacionUtterance = utterance;
    speechSynthesis.speak(utterance);
  }
  Object.entries(cfg.personajes).forEach(([id, character]) => {
    character.frase = character.frase.replaceAll("{nombre}", cfg.nombre);
    const el = $(id); if (!el) return;
    document.querySelector('[data-character-name="' + id + '"]').textContent = character.nombre;
    el.setAttribute("aria-label", "Escuchar a " + character.nombre);
    el.addEventListener("click", () => {
      const same = activeVoice === id;
      stopVoice(); if (same) return;
      activeVoice = id; const token = voiceToken;
      $("voice-caption-text").textContent = "Narración: «" + character.frase + "»";
      $("stop-voice").hidden = false;
      if (character.audio) {
        const audio = new Audio(character.audio); activeAudio = audio;
        audio.onplay = () => { if (token === voiceToken) setSpeaking(id, true); };
        audio.onended = () => { if (token === voiceToken) { setSpeaking(id, false); activeVoice = null; activeAudio = null; } };
        audio.play().catch(() => { if (token === voiceToken) { activeAudio = null; speakOnDevice(id, token); } });
      } else speakOnDevice(id, token);
    });
  });
  $("stop-voice").addEventListener("click", stopVoice);
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopVoice(); });
  const countInput = $("guest-count"), max = Number(cfg.maxPersonas) > 0 ? Math.floor(Number(cfg.maxPersonas)) : 12;
  countInput.max = max;
  function attending() { return document.querySelector('input[name="asistencia"]:checked').value === "si"; }
  function updateStepper() {
    const value = Number(countInput.value);
    $("guest-minus").disabled = !attending() || !Number.isFinite(value) || value <= 1;
    $("guest-plus").disabled = !attending() || !Number.isFinite(value) || value >= max;
  }
  ["minus", "plus"].forEach(action => $("guest-" + action).addEventListener("click", () => {
    countInput.value = Math.max(1, Math.min(max, (Number(countInput.value) || 1) + (action === "plus" ? 1 : -1)));
    updateStepper();
  }));
  countInput.addEventListener("input", updateStepper);
  countInput.addEventListener("change", () => { if (countInput.checkValidity()) updateStepper(); });
  document.querySelectorAll('input[name="asistencia"]').forEach(el => el.addEventListener("change", () => {
    $("guest-count-group").hidden = !attending(); countInput.disabled = !attending(); updateStepper();
  }));
  $("guest-name").addEventListener("input", () => $("guest-name").setCustomValidity(""));
  if (!demo) {
    $("rsvp-submit-text").textContent = "Preparar confirmación";
    $("form-note").textContent = "Al continuar podrás enviar tu respuesta por WhatsApp.";
  }
  if (demo) {
    try {
      const previous = JSON.parse(localStorage.getItem("invitacion-futbol-" + cfg.fecha) || "null");
      if (previous && typeof previous.name === "string") {
        $("guest-name").value = previous.name.slice(0, 80);
        if (Number.isInteger(previous.guests) && previous.guests >= 1 && previous.guests <= max) countInput.value = previous.guests;
      }
    } catch (_) { /* Local storage may be disabled. The form still works. */ }
  }
  updateStepper();
  $("rsvp-form").addEventListener("submit", event => {
    event.preventDefault();
    const name = $("guest-name").value.trim();
    $("guest-name").setCustomValidity(name ? "" : "Escribe tu nombre para continuar.");
    if (!event.currentTarget.reportValidity()) return;
    const answer = { name, attending: attending(), guests: attending() ? Number(countInput.value) : 0 };
    if (answer.attending && (!Number.isInteger(answer.guests) || answer.guests < 1 || answer.guests > max)) {
      countInput.setCustomValidity("Escribe un número entero de 1 a " + max + "."); countInput.reportValidity(); countInput.setCustomValidity(""); return;
    }
    currentMessage = core.rsvpMessage(cfg, answer);
    const wa = demo ? null : core.whatsappUrl(cfg.whatsapp, currentMessage);
    if (!demo && !wa) { toast("Falta configurar el WhatsApp del organizador. Tu respuesta aún no se envió."); return; }
    let saved = false;
    if (demo) { try { localStorage.setItem("invitacion-futbol-" + cfg.fecha, JSON.stringify(answer)); saved = true; } catch (_) {} }
    $("confirmation-eyebrow").textContent = demo ? "RESPUESTA DE EJEMPLO" : "UN PASO MÁS";
    $("confirmation-title").textContent = demo ? "¡Prueba lista!" : "Tu mensaje está listo";
    $("confirmation-detail").textContent = demo ? (saved ? "Tu respuesta de ejemplo se guardó en este navegador." : "Tu respuesta de ejemplo está lista para copiar.") : "Abre WhatsApp y toca Enviar para avisar al organizador.";
    $("confirmation-name").textContent = answer.name;
    $("confirmation-guests").textContent = answer.attending ? (answer.guests + (answer.guests === 1 ? " persona" : " personas") + (demo ? " en la demo" : " en el mensaje")) : "Esta vez no podré asistir";
    $("confirmation-message").textContent = currentMessage;
    $("whatsapp-send").hidden = demo;
    if (wa) $("whatsapp-send").href = wa;
    $("confirmation-disclaimer").textContent = demo ? "Esta demostración no envía la respuesta a un organizador." : "La respuesta se envía cuando tú confirmas el mensaje en WhatsApp.";
    stopVoice();
    $("confirmation-dialog").showModal(); document.body.classList.add("modal-open");
  });
  $("dialog-close").addEventListener("click", () => $("confirmation-dialog").close());
  $("confirmation-dialog").addEventListener("close", () => { document.body.classList.remove("modal-open"); $("rsvp-submit").focus(); });
  $("confirmation-dialog").addEventListener("click", event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close(); } });
  $("copy-confirmation").addEventListener("click", async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(currentMessage);
      else {
        const input = document.createElement("textarea"); input.value = currentMessage; input.style.cssText = "position:fixed;left:-9999px;top:0"; $("confirmation-dialog").append(input); input.select();
        const copied = document.execCommand("copy"); input.remove(); if (!copied) throw new Error("Copy unavailable");
      }
      $("copy-confirmation").textContent = "¡Mensaje copiado!";
      setTimeout(() => { $("copy-confirmation").innerHTML = '<svg class="icon"><use href="#icon-copy"/></svg>Copiar mensaje'; }, 2200);
    } catch (_) { $("confirmation-disclaimer").textContent = "No se pudo copiar automáticamente. Selecciona el mensaje de arriba y cópialo."; }
  });
  window.addEventListener("pagehide", () => { stopVoice(); clearInterval(countdownTimer); });
  window.addEventListener("pageshow", event => { if (event.persisted) { tick(); clearInterval(countdownTimer); countdownTimer = setInterval(tick, 1000); } });
})();
