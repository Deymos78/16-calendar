import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from "../store";


export const useCalendarStore = () => {

    const dispatch = useDispatch();

    const { events, activeEvent } = useSelector( state => state.calendar );

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent (calendarEvent)  );
    }

    const startSavingEvent = async( calendarEvent ) => {

        if( calendarEvent._id ){
            // Actualizando
            dispatch( onUpdateEvent({ ...calendarEvent }));
        }else{
            // Creando
            dispatch( onAddNewEvent({ ...calendarEvent, _id: new Date().getTime() }) )
        }
    }

    const startDeletingEvent = () => {
        // TODO: Llegar al Backend
        dispatch( onDeleteEvent() );
    }



    return{
        // Propiedades
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,

        // Metodos
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,

    }

}