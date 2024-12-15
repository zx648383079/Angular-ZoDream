import { Pipe, PipeTransform } from '@angular/core';
import { mapFormat } from '../../../theme/utils';
import { QuestionTypeItems } from '../model';

@Pipe({
    standalone: false,
    name: 'questionType'
})
export class QuestionTypePipe implements PipeTransform {

    transform(value: number, args?: any): string {
        return mapFormat(value, QuestionTypeItems);
    }

}
