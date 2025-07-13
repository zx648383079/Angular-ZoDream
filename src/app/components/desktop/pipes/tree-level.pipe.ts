import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: false,
    name: 'treeLevel'
})
export class TreeLevelPipe implements PipeTransform {

    transform(value: number): string {
        return '├' + '─'.repeat(value);
    }

}
