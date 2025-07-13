import {
    Pipe,
    PipeTransform
} from '@angular/core';
import { formatAgo } from '../../../theme/utils';

@Pipe({
    standalone: false,
    name: 'ago'
})
export class AgoPipe implements PipeTransform {

    transform(value: any, args ? : any): any {
        return formatAgo(value);
    }

}
