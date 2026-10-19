# Invitación de fútbol — 31 de octubre

Diseño actualizado: póster deportivo oscuro con azul y dorado, estadio fotográfico, nombre de gran tamaño detrás de los jugadores, entradas escalonadas al desplazarse, luces suaves e indicadores de audio. Las animaciones respetan la preferencia de movimiento reducido del dispositivo. No hay reproducción automática de audio.

Base estática para celular con Haaland y Cristiano Ronaldo. No requiere instalar paquetes ni ejecutar una compilación.

## Datos cargados

- Fecha: sábado 31 de octubre de 2026.
- Horario: 4:00 a 8:00 p. m. (America/Chihuahua).
- Lugar: Piccolo Xtremo Reliz.
- Nombre y edad de ejemplo: Mateo, 5 años.
- La confirmación está en modo de demostración hasta añadir el WhatsApp real del organizador.

## Personalizar

Abre `dist/config.js` con un editor de texto y cambia `nombre`, `edad` y los demás datos. Mantén las comillas y comas. Para activar la confirmación real, configura `whatsapp` con el número internacional del organizador y cambia `demo` a `false`.

Formato de número mexicano: `52` seguido de los 10 dígitos del organizador, sin +, espacios ni guiones. El número no debe ser ficticio. Al confirmar, se prepara un mensaje con el nombre y número de invitados. El invitado debe abrir WhatsApp y tocar Enviar. Esta base no almacena una lista central de asistentes ni afirma haber enviado un mensaje automáticamente.

En modo demo, la respuesta se guarda únicamente en el navegador del visitante y se puede copiar. Si el navegador bloquea el almacenamiento, igual se puede preparar y copiar el mensaje.

Las fechas usan formato ISO con desplazamiento horario. Ejemplo: `2026-10-31T16:00:00-06:00`. Cambia tanto `fecha` como `fechaFin` y conserva la zona horaria adecuada. El encabezado, la cuenta regresiva y el archivo de calendario se actualizan con los datos configurados.

## Voz

Toca cualquiera de los jugadores para escuchar una narración en español. Toca otra vez o usa Detener voz para pararla. La voz depende del navegador y del dispositivo; no imita las voces reales de los futbolistas. Si el dispositivo no admite síntesis de voz, la frase permanece visible como texto.

Puedes usar grabaciones propias: guarda, por ejemplo, `haaland.mp3` dentro de `dist/assets` y pon `audio: "assets/haaland.mp3"` en la configuración del personaje. Si no hay audio o falla la carga, se usa la voz del dispositivo. Si cambias fecha o lugar, actualiza también la frase de narración de Cristiano en `config.js`.

## Publicar en Netlify

1. Descomprime este paquete.
2. Inicia sesión en tu cuenta de Netlify.
3. Abre https://app.netlify.com/drop.
4. Arrastra la carpeta `dist` completa. Dentro deben estar `index.html`, los archivos JavaScript, `styles.css` y `assets`.
5. Cuando Netlify termine, abre el enlace `netlify.app` del proyecto. Si tu equipo crea proyectos privados por defecto, cambia la visibilidad a pública antes de enviarla a invitados.

Para actualizarla, edita los archivos y arrastra la carpeta `dist` actualizada a la sección de despliegues del mismo proyecto. Si prefieres conectarla a Git, el archivo `netlify.toml` del paquete indica `dist` como directorio de publicación.

Guía oficial: https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/

## Archivos

- `dist/index.html`: estructura y textos de la página.
- `dist/styles.css`: diseño principalmente para celular (también funciona en escritorio).
- `dist/config.js`: datos, colores, WhatsApp y frases.
- `dist/app.js`: voz, formulario, contador, calendario y acciones.
- `dist/motion.js`: transiciones de entrada, desplazamiento de fondo y barra de progreso.
- `dist/core.js`: cálculos y construcción de mensajes.
- `dist/assets`: fotografías optimizadas, fuentes e ícono.

Los campos tienen tamaño de letra de 16 px para evitar el zoom automático habitual en iPhone. Hay botones fijos de ubicación y confirmación, etiquetas accesibles, navegación con teclado y respeto a la preferencia de movimiento reducido.

## Imágenes y fuentes

Referencias encontradas en Pinterest:

- Haaland: https://www.pinterest.com/pin/1134344224884141309/
- Cristiano Ronaldo: https://mx.pinterest.com/pin/217791331975578111/

Se descargaron los PNG originales del sitio de origen y se exportaron a WebP conservando la transparencia, para evitar la cuadrícula de las miniaturas y reducir el peso en celular:

- https://uniqrenders.com/athletes/football/erling-haaland-manchester-city-premier-league-norway-norwegian-footballers-2181
- https://uniqrenders.com/athletes/football/cristiano-ronaldo-al-nassr-saudi-pro-league-portugal-portuguese-footballers-4600

Crédito: UniqRenders. Las fotografías son contenido de terceros; no se ofrece una licencia de reventa de esas fotografías. Las fuentes Bebas Neue y Nunito Sans se distribuyen con sus archivos de licencia OFL dentro de `assets`.

La ubicación abre una búsqueda de Google Maps para el establecimiento indicado. Puede sustituirse por el enlace exacto compartido por el salón en `ubicacionMaps`. Referencia oficial: https://developers.google.com/maps/documentation/urls/get-started?hl=es-419

Foto de estadio: Chris Kursikowski / Unsplash. https://unsplash.com/photos/a-soccer-field-at-night-with-the-lights-on-5IS7UghgoMA (Unsplash License).
