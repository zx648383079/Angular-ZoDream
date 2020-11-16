import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import { IChapter } from '../../../theme/models/book';

interface IFlipProgress {
    chapter: IChapter;
    progress: number;
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
    @Output() progressChanged = new EventEmitter<IFlipProgress>();
    @Output() previewRequest = new EventEmitter<number>();

    public lineItems = [];

    private chapterItems: IChapter[] = [];
    private currentIndex = -1;

    constructor() {}

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.initChapter && changes.initChapter.currentValue > 0) {
            this.init();
        }
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
        }
    }

    private refreshView() {
        const item = this.chapterItems[this.currentIndex];
        this.lineItems = item.content.split('\n');
    }

    private init() {
        this.chapterItems = [];
        this.currentIndex = -1;
        this.previewRequest.emit(this.initChapter);
    }

}
