import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IChapter } from '../../../theme/models/book';

interface IFlipProgress {
    chapter: IChapter;
    progress: number;
}

interface IBlockItem {
    title: string;
    tags: string[];
    lines: string[];
}

@Component({
    selector: 'app-flip-pager',
    templateUrl: './flip-pager.component.html',
    styleUrls: ['./flip-pager.component.scss']
})
export class FlipPagerComponent implements OnChanges {

    @Input() public initChapter = 0;
    @Input() public maxCache = 5;
    @Input() public flipMode = 0;
    @Input() public options: any = {};
    @Output() progressChanged = new EventEmitter<IFlipProgress>();
    @Output() previewRequest = new EventEmitter<number>();

    public blockItems: IBlockItem[] = [];

    private chapterItems: IChapter[] = [];
    private currentIndex = -1;

    constructor(
        private toastrService: ToastrService,
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

    get current(): IChapter {
        return this.currentIndex >= 0 && this.currentIndex < this.chapterItems.length ? this.chapterItems[this.currentIndex] : undefined;
    }

    public tapPrevious() {
        const previous = this.current?.previous;
        if (!previous) {
            this.toastrService.warning('已到第一章节，无法前进了');
            return;
        }
        this.showChanpter(previous.id);
    }

    public tapNext() {
        const next = this.current?.next;
        if (!next) {
            this.toastrService.warning('已到最新章节，没有更多了');
            return;
        }
        this.showChanpter(next.id);
    }

    public showChanpter(id: number) {
        for (let i = 0; i < this.chapterItems.length; i++) {
            if (this.chapterItems[i].id === id) {
                this.currentIndex = i;
                this.refreshView();
                return;
            }
        }
        this.currentIndex = this.chapterItems.length;
        this.previewRequest.emit(id);
    }

    public append(item: IChapter) {
        this.chapterItems.push(item);
        if (this.chapterItems.length > this.maxCache) {
            const len = this.chapterItems.length - this.maxCache;
            this.chapterItems.splice(0, len);
            this.currentIndex -= len;
        }
        if (this.currentIndex < 0) {
            this.currentIndex = 0;
            this.refreshView();
            return;
        }
        if (this.currentIndex === this.chapterItems.length - 1) {
            this.refreshView();
        }
    }

    private refreshView() {
        const item = this.chapterItems[this.currentIndex];
        this.blockItems = [{
            title: item.title,
            tags: [
                '字数：' + item.size,
                '更新时间：' + item.created_at,
            ],
            lines: item.content.split('\n')
        }];
        if (this.blockItems.length < 2) {
            document.documentElement.scrollTop = 0;
        }
        this.progressChanged.emit({
            chapter: item,
            progress: 0,
        });
    }

    private init() {
        this.chapterItems = [];
        this.currentIndex = -1;
        this.previewRequest.emit(this.initChapter);
    }

}
