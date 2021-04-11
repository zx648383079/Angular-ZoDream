import {
    Pipe,
    PipeTransform
} from '@angular/core';
import { formatAgo } from '../utils';

@Pipe({
    name: 'ago'
})
export class AgoPipe implements PipeTransform {

    transform(value: any, args ? : any): any {
        return formatAgo(value);
    }

}
