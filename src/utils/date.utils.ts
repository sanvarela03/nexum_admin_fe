export function formatearFecha(fechaString: string) {
  const fecha = new Date(fechaString.replace(' ', 'T'))
  const opciones: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }
  const fechaLegible = fecha.toLocaleString('es-ES', opciones)
  return fechaLegible.charAt(0).toUpperCase() + fechaLegible.slice(1)
}