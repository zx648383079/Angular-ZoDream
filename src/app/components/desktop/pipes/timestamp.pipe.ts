import {
    Pipe,
    PipeTransform
} from '@angular/core';
import { formatDate } from '../../../theme/utils';

@Pipe({
    standalone: false,
    name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (!value) {
            return;
        }
        if (!/^\d+$/.test(value)) {
            return value;
        }
        return formatDate(value, 'yyyy-mm-dd hh:ii');
    }

}
