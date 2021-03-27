import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'questionType'
})
export class QuestionTypePipe implements PipeTransform {

    transform(value: number, args?: any): string {
        return ['单选题', '多选题', '判断题', '简答题', '填空题'][value];
    }

}
