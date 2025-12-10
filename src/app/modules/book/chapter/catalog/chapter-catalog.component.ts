import {
  Component,
  input,
  output
} from '@angular/core';
import { IChapter } from '../../model';
import { formatTime } from '../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-chapter-catalog',
    templateUrl: './chapter-catalog.component.html',
    styleUrls: ['./chapter-catalog.component.scss']
})
export class ChapterCatalogComponent {

    public orderAsc = true;

    public readonly items = input<IChapter[]>([]);
    public current: any;
    public readonly selected = output<IChapter>();

    constructor() {}

    get filterItems() {
        if (this.orderAsc) {
            return this.items();
        }
        const items = [];
        for (const item of this.items()) {
            if (item.type < 9) {
                items.push(item);
                continue;
            }
            if (!item.children || item.children.length < 1) {
                continue;
            }
            for (const it of item.children) {
                items.push(it);
            }
        }
        return items.reverse();
    }

    public tapOrder() {
        this.orderAsc = !this.orderAsc;
    }

    public tapChapter(item: IChapter) {
        this.current = {
            chapter_id: item.id,
            created_at: formatTime(new Date())
        };
        this.selected.emit(item);
    }
}
