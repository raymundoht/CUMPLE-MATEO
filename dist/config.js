/* EDITA TU INVITACIÓN AQUÍ. Se publica sin instalar ni compilar. */
window.INVITACION = {
  nombre: "Héctor Alfonso", // Se muestra en el póster, la voz, WhatsApp y calendario.
  edad: 4,
  titulo: "¡El partido del año!",
  mensaje: "Fútbol, juegos y mucha diversión. Ponte la camiseta y ven a celebrar conmigo.",
  fecha: "2026-10-31T16:00:00-06:00",
  fechaFin: "2026-10-31T20:00:00-06:00",
  zonaHoraria: "America/Chihuahua",
  lugar: "Piccolo Xtremo Reliz",
  direccion: "Reliz · Chihuahua, Chih.",
  ubicacionMaps: "https://www.google.com/maps/search/?api=1&query=Piccolo+Xtremo+Reliz%2C+Chihuahua%2C+M%C3%A9xico",
  indicacion: "Abre Google Maps para consultar la ubicación y cómo llegar.",
  vestimenta: "Tu camiseta favorita y ropa cómoda para jugar.",
  fechaLimite: "¡Confirma y únete al equipo!",
  maxPersonas: 12,
  // Número internacional del organizador sin +, espacios ni guiones.
  // En México: 52 seguido de los 10 dígitos. No uses un número ficticio.
  whatsapp: "526141002989",
  // Cambia a false cuando hayas añadido el WhatsApp real.
  // La demo no envía respuestas; se pueden probar y copiar.
  demo: false,
  // Voces de los personajes desactivadas por el momento.
  // Cámbialo a true cuando agregues los archivos de audio en cada personaje (campo "audio").
  voces: false,
  colores: { acento: "#e0bd70", fondo: "#070c17", dorado: "#e0bd70", papel: "#f5f7fc" },
  personajes: {
    haaland: {
      nombre: "Haaland",
      frase: "¡El partido de {nombre} está por comenzar! Estás invitado a un cumpleaños lleno de fútbol, juegos y diversión. ¡Ponte la camiseta y ven a celebrar!",
      audio: "", // Opcional: "assets/haaland.mp3". Narración, no voz real del jugador.
      tono: 1,
      velocidad: 1
    },
    ronaldo: {
      nombre: "Cristiano",
      frase: "¡Prepárate para celebrar! La cita es el treinta y uno de octubre, de cuatro a ocho de la tarde, en Piccolo Extremo Reliz. ¡Mira la ubicación y confirma tu asistencia!",
      audio: "",
      tono: 1.1,
      velocidad: 1
    }
  }
};
