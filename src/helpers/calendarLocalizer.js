import { format, parse, startOfWeek, getDay } from 'date-fns';
import { dateFnsLocalizer } from 'react-big-calendar';

import esES from 'date-fns/locale/es';

const locales = {
    'es': esES,
}

// Exportaremos el localizer que usando la libreria dat-fns para manipular las operaciones de las fechas
export const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});