import { Pipe, PipeTransform } from '@angular/core';
import { mapFormat } from '../../../theme/utils';

@Pipe({
  name: 'materialType'
})
export class MaterialTypePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return mapFormat(value, ['文本', '音频', '视频']);
    }

}
