import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import format from 'date-fns/format'
// import parse from 'date-fns/parse'
// import startOfWeek from 'date-fns/startOfWeek'
// import getDay from 'date-fns/getDay'
import { CalendarEvent, CalendarModal, FabAddNew, Navbar, FabDelete } from "../";

import { localizer, getMessagesES } from '../../helpers';
import { useEffect, useState } from 'react';
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks';


// DEFINIMOS UN EVENTO POR DEFECTO 
// AHORA LOS EVENTOS LOS RECUPERAREMOS DEL calendarSlice
// const events = [{
//   title: 'Cumpleaños del Jefe',
//   notes: 'Hay que comprar el pastel',
//   start: new Date(),
//   end: addHours( new Date(), 2),
//   bgColor: '#fafafa',
//   user: {
//     _id: '123',
//     name: 'Fernando'
//   }
// }
// ];



// ESTA ES LA PAGINA DEL CALENDARIO AQUI ES DONDE SE MOSTRARA EL CALENDARIO EL CUAL HEMOS IMPORTADO DE LA LIBRERIA REACT-BIG-CALENDAR
export const CalendarPage = () => {

  const { user } = useAuthStore();
  
  const { openDateModal } = useUiStore();

  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();

  const [ lastView, setlastView ] = useState( localStorage.getItem('lastView') || 'week' );

  // FUNCION PARA APLICAR ESTILOS AL EVENTO DEL CALENDARIO
  const eventStyleGetter = ( event, start, end, isSelected ) =>{

    const isMyEvent = ( user.uid === event.user._id ) || ( user.uid === event.user.uid ) ;

    // DEFINIMOS EL ESTILO QUE TENDRA EL EVENTO
    const style ={
      backgroundColor: isMyEvent ? '#347CF7' : '#465660',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white'
    }

    return{
      style
    }
  }

  const onDoubleClick = ( event ) =>{
    // console.log( { doubleClick: event  } );
    openDateModal();
  }

  const onSelect = ( event ) =>{
    // console.log( { click: event  } );
    setActiveEvent( event );
  }

  const onViewChanged = ( event ) =>{
    
    localStorage.setItem('lastView', event);
    setlastView( event );
  }

  useEffect(() => {
    startLoadingEvents();
  }, [])
  

  return (
    <>
    {/* COLOCAMOS LA BARRA DE NAVEGACION */}
        <Navbar />

    {/* COLOCAMOS EL CALENDARIO DE LA LIBRERIA */}
        <Calendar
            culture='es'
            localizer={ localizer }
            events={ events }
            defaultView={ lastView }
            startAccessor="start"
            endAccessor="end"
            style={{ height: 'calc(100vh - 80px) ' }}
            messages={ getMessagesES() }
            eventPropGetter={ eventStyleGetter }
            components={{
              event: CalendarEvent
            }}
            onDoubleClickEvent={ onDoubleClick }
            onSelectEvent={ onSelect }
            onView={ onViewChanged }
        />

        <CalendarModal/>
        <FabAddNew/>
        <FabDelete/>
    </>
  )
}
