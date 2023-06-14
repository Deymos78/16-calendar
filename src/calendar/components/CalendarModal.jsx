import { addHours, differenceInSeconds } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';


import Modal from 'react-modal';
import DatePicker, { registerLocale } from "react-datepicker";
import es from 'date-fns/locale/es';

import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import "sweetalert2/dist/sweetalert2.min.css";
import { useUiStore } from '../../hooks/useUiStore';
import { useCalendarStore } from '../../hooks';

registerLocale( 'es', es );


const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};
// Esta linea me ayudara a superponer el modal sobre la aplicacion
Modal.setAppElement('#root');

export const CalendarModal = () => {

    const { isDateModalOpen, closeDateModal } = useUiStore();

    const { activeEvent, startSavingEvent } =  useCalendarStore();
 
    // El useState nos permitira controlar si el modal se muestra o no
    // YA NO HACE FALTA YA QUE EL ESTADO DEL MODAL SE CONTROLARA POR REDUCER
    // const [isOpen, setIsOpen] = useState(true);

    const [formSubmitted, setFormSubmitted] = useState(false);

    // Estos seran los campos del formulario del modal
    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours( new Date(), 2)
    });

    // Vamos a aplicar una clase dependiendo del valor del formSubmitted y el formValues.length
    // Cuando uno de estos valores cambia entonces vamos a aplicar la clase respectiva
    const titleClass =  useMemo(() => {
        
        if( !formSubmitted ) return '';

        return ( formValues.title.length > 0 )
            ? ''
            : 'is-invalid';

    }, [formValues.title, formSubmitted])


    useEffect(() => {

        if( activeEvent !== null ){
            setFormValues({ ...activeEvent })
        }
      
    
    }, [ activeEvent ])
    

    // Controlamos que cuando haya un cambio se refleje en los campos correspondientes
    const onInputChanged = ({ target }) => {

        // Colocamos los valores que le corresponde a cada campo y lo almacenamos para no perder los valores
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    // Tambien almacenamos la fecha en el formulario cuando esta cambia 
    const onDateChanged = ( event, changing ) =>{
        setFormValues({
            ...formValues,
            [changing]: event
        })
    }

    // Creamos una funcion para cerra el modal
    const onCloseModal = () =>{
        console.log('cerrando modal');
        // Cambiamos el estado a cerrado
        // setIsOpen( false );
        closeDateModal();
    }

    // Creamos la logica para cuando se envia el formulario
    const onSubmit = async( event ) =>{
        // Evitamos la carga de la pagina
        event.preventDefault();
        setFormSubmitted(true);

        // Calculamos la diferencia entre los dos valores
        const difference = differenceInSeconds( formValues.end, formValues.start  );

        // Si uno de los dos campos dara un error NaN si es negativo es que el end es inferior al star por lo que esta mal 
        if( isNaN( difference ) || difference <= 0 ){
            Swal.fire('Fechas incorrectas', 'Revisar las fechas ingresadas', 'error');
            return
        }

        // Si no hay titulo salimos tambien
        if( formValues.title.length <= 0 ) return;

        // Imprimimos los valores
        console.log( formValues );

        // TODO:
        // Remover errores en pantalla
        // Cerrar Modal
        await startSavingEvent( formValues );
        closeDateModal();
        setFormSubmitted( false );
    }

  return (
    <Modal
        isOpen={ isDateModalOpen }
        onRequestClose={ onCloseModal}
        style={ customStyles }
        className="modal"
        overlayClassName="modal-fondo"
        closeTimeoutMS={ 200 }
    >

        <h1> Nuevo evento </h1>
        <hr />
        <form className="container" onSubmit={ onSubmit }>

            <div className="form-group mb-2">
                <label>Fecha y hora inicio</label>
                <DatePicker 
                    selected={ formValues.start }
                    onChange={ (event) => onDateChanged(event, 'start') }
                    className='form-control'
                    dateFormat="Pp"
                    showTimeSelect
                    locale="es"
                    timeCaption='Hora'
                />
            </div>

            <div className="form-group mb-2">
                <label>Fecha y hora fin</label>
                <DatePicker 
                    minDate={ formValues.start}
                    selected={ formValues.end }
                    onChange={ (event) => onDateChanged(event, 'end') }
                    className='form-control'
                    dateFormat="Pp"
                    showTimeSelect
                    locale="es"
                    timeCaption='Hora'
                />            
            </div>

            <hr />
            <div className="form-group mb-2">
                <label>Titulo y notas</label>
                <input 
                    type="text" 
                    className={`form-control ${titleClass}`}
                    placeholder="Título del evento"
                    name="title"
                    autoComplete="off"
                    value={ formValues.title }
                    onChange={ onInputChanged }
                />
                <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
            </div>

            <div className="form-group mb-2">
                <textarea 
                    type="text" 
                    className="form-control"
                    placeholder="Notas"
                    rows="5"
                    name="notes"
                    value={ formValues.notes }
                    onChange={ onInputChanged }
                ></textarea>
                <small id="emailHelp" className="form-text text-muted">Información adicional</small>
            </div>

            <button
                type="submit"
                className="btn btn-outline-primary btn-block"
            >
                <i className="far fa-save"></i>
                <span> Guardar</span>
            </button>

        </form>

    </Modal>
  )
}
