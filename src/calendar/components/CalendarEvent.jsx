
// PERSONALIZAMOS COMO SE MOSTRARA EL EVENTO
export const CalendarEvent = ( { event } ) => {

    // REcuperamos el evento que hemos creado y lo desestrucuramos en los datos que contiene
    const {title, user} = event;

  return (
    <>
        <strong>{title}</strong>
        <strong> - {user.name}</strong>
    </>
  )
}
