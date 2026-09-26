/*
 * UNIQUE Salon — datos de contacto
 * ---------------------------------
 * Todos los botones "Reservar cita" usan estos datos.
 * Para cambiar el número de WhatsApp o el mensaje, edita SOLO este archivo.
 *
 * Fuente pública de los datos (septiembre 2026):
 *  - Teléfono 663 09 10 30: ficha de Google Maps "UNIQUE SALON" y publicación de
 *    Instagram de @_unique.salon ("Pide cita 📞 663 091 030").
 *  - Email Salonunique976@gmail.com: misma publicación de Instagram.
 */
window.UNIQUE_CONFIG = {
  // Número en formato internacional, solo dígitos (34 = España)
  whatsapp: "34663091030",
  // Mensaje que aparece escrito al abrir WhatsApp
  whatsappMessage: "Hola UNIQUE ✨ Me gustaría reservar una cita.",
  phone: "+34663091030",
  email: "Salonunique976@gmail.com",
  instagram: "https://www.instagram.com/_unique.salon/",
  // Horario (0 = domingo … 6 = sábado), hora de Madrid. null = cerrado
  hours: {
    0: null,
    1: ["10:00", "20:00"],
    2: ["10:00", "20:00"],
    3: ["10:00", "20:00"],
    4: ["10:00", "20:00"],
    5: ["10:00", "20:00"],
    6: ["10:00", "14:00"]
  }
};
