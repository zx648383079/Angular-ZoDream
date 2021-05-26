import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import { IChapter } from '../../model';
import { formatTime } from '../../../theme/utils';

@Component({
    selector: 'app-chapter-catalog',
    templateUrl: './chapter-catalog.component.html',
    styleUrls: ['./chapter-catalog.component.scss']
})
export class ChapterCatalogComponent {

    public orderAsc = true;

    @Input() public items: IChapter[] = [];
    public current: any;
    @Output() public selected = new EventEmitter<IChapter>();

    constructor() {}

    get filterItems() {
        if (this.orderAsc) {
            return this.items;
        }
        const items = [];
        for (const item of this.items) {
            if (item.type < 1) {
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
