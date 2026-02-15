import { Pipe, PipeTransform } from '@angular/core';
import { mapFormat } from '../../theme/utils';
import { LogTypeItems } from './model';

@Pipe({
    standalone: false,
    name: 'logType'
})
export class LogTypePipe implements PipeTransform {

    transform(value: number, args?: any): string {
        if (args === 'short') {
            return mapFormat(value, LogTypeItems.map(i => i[0]));
        }
        return mapFormat(value, LogTypeItems);
    }
}
