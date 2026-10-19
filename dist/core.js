(function (root) {
  "use strict";
  const pad = n => String(n).padStart(2, "0");
  function countdown(date, now = Date.now()) {
    const target = new Date(date).getTime();
    if (!Number.isFinite(target)) return null;
    const left = Math.max(0, Math.floor((target - now) / 1000));
    return { days: Math.floor(left / 86400), hours: Math.floor(left / 3600) % 24,
      minutes: Math.floor(left / 60) % 60, seconds: left % 60, finished: left === 0 };
  }
  function whatsappUrl(number, text) {
    const phone = String(number || "").replace(/[\s()+-]/g, "");
    if (!/^\d{10,15}$/.test(phone)) return null;
    return "https://wa.me/" + phone + "?text=" + encodeURIComponent(text);
  }
  function rsvpMessage(event, answer) {
    const who = event.nombreCompleto || event.nombre;
    if (answer.attending) {
      return `¡Hola! Soy ${answer.name}. Confirmo mi asistencia al cumpleaños de ${who}.\nSeremos ${answer.guests} ${answer.guests === 1 ? "persona" : "personas"} en total.\n¡Nos vemos en la fiesta!`;
    }
    return `¡Hola! Soy ${answer.name}. Gracias por invitarme al cumpleaños de ${who}. Esta vez no podré asistir. ¡Que disfruten mucho la fiesta!`;
  }
  function calendar(event) {
    const start = new Date(event.fecha), end = new Date(event.fechaFin);
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) return null;
    const stamp = date => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const escape = text => String(text || "").replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
    const encoder = new TextEncoder();
    const fold = line => { let result = "", length = 0; for (const c of line) { const size = encoder.encode(c).length; if (length + size > 75) { result += "\r\n "; length = 1; } result += c; length += size; } return result; };
    return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Invitacion Futbol//ES", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
      "UID:invitacion-" + start.getTime() + "@invitacion.local", "DTSTAMP:" + stamp(new Date()), "DTSTART:" + stamp(start), "DTEND:" + stamp(end),
      "SUMMARY:" + escape("Cumpleaños de " + (event.nombreCompleto || event.nombre)), "LOCATION:" + escape(event.lugar + ", " + event.direccion),
      "DESCRIPTION:" + escape(event.mensaje + "\n" + event.ubicacionMaps), "END:VEVENT", "END:VCALENDAR"].map(fold).join("\r\n") + "\r\n";
  }
  const api = { countdown, whatsappUrl, rsvpMessage, calendar, pad };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.InvitacionCore = api;
})(typeof window !== "undefined" ? window : globalThis);
