import {
    Pipe,
    PipeTransform
} from '@angular/core';
import { formatAgo, formatDate, formatHour, formatShort } from '../../../theme/utils';

@Pipe({
    standalone: false,
    name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (args) {
            case 'short':
                return formatShort(value);
            case 'ago':
                return formatAgo(value);
            case 'hour':
                return formatHour(value);
            default:
                break;
        }
        if (!value) {
            return '';
        }
        return formatDate(value, args ? args : 'yyyy-mm-dd hh:ii');
    }

}