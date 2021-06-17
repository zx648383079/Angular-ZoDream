import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'materialType'
})
export class MaterialTypePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return ['文本', '音频', '视频'][value];
    }

}
