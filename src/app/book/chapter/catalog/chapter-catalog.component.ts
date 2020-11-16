import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import { IChapter } from '../../../theme/models/book';
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
        return this.orderAsc ? this.items : this.items.reverse();
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
