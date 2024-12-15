import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    QueryList,
    SimpleChanges,
    ViewChildren
} from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { IChapter } from '../../model';
import { windowScollTop } from '../../util';

export interface IFlipProgress {
    item: IBlockItem;
    progress: number;
}

interface IBlockItem {
    id: number;
    previous?: number;
    next?: number;
    book?: number;
    title: string;
    tags: string[];
    lines: string[];
}

export interface IRequestEvent {
    id: number;
    callback: (item: IChapter) => void;
}

@Component({
    standalone: false,
    selector: 'app-flip-pager',
    templateUrl: './flip-pager.component.html',
    styleUrls: ['./flip-pager.component.scss']
})
export class FlipPagerComponent implements OnChanges {

    @ViewChildren('filpPage')
    public pageItems: QueryList<ElementRef<HTMLDivElement>>;

    @Input() public initChapter = 0;
    @Input() public maxCache = 5;
    @Input() public flipMode = 0;
    @Input() public options: any = {};
    @Output() progressChanged = new EventEmitter<IFlipProgress>();
    @Output() previewRequest = new EventEmitter<IRequestEvent>();

    public blockItems: IBlockItem[] = [];
    private currentIndex = -1;

    constructor(
        private toastrService: DialogService,
    ) {}

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.initChapter && changes.initChapter.currentValue > 0) {
            this.init();
        }
    }

    get pageStyle() {
        const style: any = {};
        if (this.options.size) {
            style['font-size'] = this.options.size + 'px';
        }
        if (this.options.font) {
            const fontItems = ['Microsoft YaHei', 'PingFangSC-Regular', 'Kaiti', '方正启体简体'];
            style['font-family'] = typeof this.options.font === 'number' ? fontItems[this.options.font] : this.options.font;
        }
        if (this.options.backgroundImage) {
            style['background-image'] = 'url(' + this.options.backgroundImage + ')';
        } else if (this.options.background) {
            style['background-color'] = this.options.background;
        }
        if (this.options.color) {
            style.color = this.options.color;
        }
        return style;
    }

    get current(): IBlockItem {
        return this.currentIndex >= 0 && this.currentIndex < this.blockItems.length ? this.blockItems[this.currentIndex] : undefined;
    }

    public tapPrevious() {
        const previous = this.current?.previous;
        if (!previous) {
            this.toastrService.warning($localize `We have reached the first chapter and cannot move forward`);
            return;
        }
        this.showChanpter(previous);
    }

    public tapNext() {
        this.loadNext(true);
    }

    public loadNext(scroll = false) {
        const next = this.current?.next;
        if (!next) {
            this.toastrService.warning($localize `The latest chapter has been reached, there are no more`);
            return;
        }
        this.showChanpter(next, scroll);
    }

    public showChanpter(item: number|IChapter, scroll = true) {
        if (typeof item !== 'object') {
            this.previewRequest.emit({id: item, callback: (res) => {
                this.showChanpter(res, scroll);
            }});
            return;
        }
        const i = this.insertTo(this.formatToBlock(item));
        if (!scroll) {
            return;
        }
        setTimeout(() => {
            this.scrollTo(i);
        }, 50);
    }

    public onScroll(top: number, bottom: number, isUp: boolean) {
        const [i, progress] = this.getScrollCurrent(top, bottom, isUp);
        this.currentIndex = i;
        this.progressChanged.emit({
            item: this.current,
            progress,
        });
    }

    public scrollTo(index: number|IChapter|IBlockItem, progress = 0) {
        if (typeof index === 'object') {
            index = this.indexOf(index.id);
        }
        this.currentIndex = index;
        this.progressChanged.emit({
            item: this.current,
            progress,
        });
        const element = this.pageItems.get(index);
        if (!element || !element.nativeElement) {
            return;
        }
        const bound = element.nativeElement.getBoundingClientRect();
        window.scrollTo({
            top: windowScollTop() + bound.top + progress * bound.height / 100
        });
    }

    private indexOf(id: number): number {
        for (let i = this.blockItems.length - 1; i >= 0; i--) {
            if (this.blockItems[i].id === id) {
                return i;
            }
        }
        return -1;
    }

    private insertTo(item: IBlockItem): number {
        const i = this.indexOf(item.id);
        if (i >= 0) {
            return i;
        }
        if (this.blockItems.length < 1 || this.blockItems[this.blockItems.length - 1].id === item.previous) {
            this.blockItems.push(item);
            return this.blockItems.length - 1;
        }
        if (this.blockItems[0].id === item.next) {
            this.blockItems = [item, ...this.blockItems];
            return 0;
        }
        this.blockItems = [item];
        return 0;
    }

    private formatToBlock(item: IChapter): IBlockItem {
        return {
            id: item.id,
            previous: item.previous?.id,
            next: item.next?.id,
            book: item.book_id,
            title: item.title,
            tags: [
                $localize `Words:` + item.size,
                $localize `Published:` + item.created_at,
            ],
            lines: item.content.split('\n')
        };
    }

    private getScrollCurrent(top: number, bottom: number, isUp: boolean): number[] {
        for (let i = 0; i < this.pageItems.length; i++) {
            const element = this.pageItems.get(i);
            const bound = element.nativeElement.getBoundingClientRect();
            if (bound.top <= 0 && bound.top + bound.height > 0) {
                return [i, (- bound.top) * 100 / bound.height];
            }
        }
        return [0, 0];
    }

    private init() {
        if (this.initChapter === this.current?.id) {
            return;
        }
        this.showChanpter(this.initChapter);
    }

}
