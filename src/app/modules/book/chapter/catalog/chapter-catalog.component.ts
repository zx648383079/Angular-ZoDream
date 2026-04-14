import {
  Component,
  computed,
  input,
  output,
  signal
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

    public readonly orderAsc = signal(true);

    public readonly items = input<IChapter[]>([]);
    public readonly current = signal<any>(null);
    public readonly selected = output<IChapter>();

    public readonly filterItems = computed(() => {
        if (this.orderAsc()) {
            return this.items();
        }
        const items = [];
        for (const item of this.items()) {
            if (item.type! < 9) {
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
    });

    public tapOrder() {
        this.orderAsc.update(v => !v);
    }

    public tapChapter(item: IChapter) {
        this.current.set({
            chapter_id: item.id,
            created_at: formatTime(new Date())
        });
        this.selected.emit(item);
    }
}
