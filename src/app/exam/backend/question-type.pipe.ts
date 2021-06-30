import { Pipe, PipeTransform } from '@angular/core';
import { mapFormat } from '../../theme/utils';

@Pipe({
  name: 'questionType'
})
export class QuestionTypePipe implements PipeTransform {

    transform(value: number, args?: any): string {
        return mapFormat(value, ['单选题', '多选题', '判断题', '简答题', '填空题']);
    }

}
