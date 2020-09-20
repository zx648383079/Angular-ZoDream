import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'treeLevel'
})
export class TreeLevelPipe implements PipeTransform {

  transform(value: number): string {
    return 'ￂ' + '-'.repeat(value);
  }

}
