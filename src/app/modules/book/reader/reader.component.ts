import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IChapter } from '../model';
import { BookService } from '../book.service';
import { FlipPagerComponent, IFlipProgress, IRequestEvent } from './flip-pager/flip-pager.component';
import { scrollBottom, windowHeight, windowScollTop } from '../util';
import { SearchEvents } from '../../../theme/models/event';
import { SearchService } from '../../../theme/services';

@Component({
    selector: 'app-reader',
    templateUrl: './reader.component.html',
    styleUrls: ['./reader.component.scss']
})
export class ReaderComponent implements OnInit, OnDestroy {

    @ViewChild('container')
    public containerElement: ElementRef<HTMLDivElement>;

    @ViewChild(FlipPagerComponent)
    public flipPager: FlipPagerComponent;
    public chapterId = 0;
    public mode = 0;
    public fontItems = ['雅黑', '宋体', '楷书', '启体'];
    public flipItems = ['无', '覆盖', '仿真', '滚屏'];
    public configs: any = {
        font: 3,
        background: '#fff',
        backgroundImage: null,
        oldTheme: '', // 记录夜间模式切换
        size: 18,
        line: 10,
        letter: 4,
        color: '#333',
        flip: 0,
    };
    public sizeRound: {[key: string]: number[]} = {
        size: [12, 2, 40],
        line: [2, 1, 40],
        letter: [1, 1, 40],
    };
    public progress = 0;
    public isLoading = false;
    public scrollToUp = false;
    private bookId = 0;
    private scrollTop = 0;
    private booted = false;
    private lastProgress = -30;
    private cacheChapters: {[id: number]: IChapter} = {};

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: BookService,
        private renderer: Renderer2,
        private searchService: SearchService,
    ) {}

    ngOnInit() {
        this.searchService.emit(SearchEvents.NAV_TOGGLE, 3);
        this.renderer.listen(window, 'scroll', this.onScroll.bind(this));
        this.scrollTop = windowScollTop();
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.bookId = params.book;
            this.chapterId = params.id;
            if (this.chapterId < 1 && this.bookId > 0) {
                this.onRequest({id: 0, callback: (item) => {
                    this.chapterId = item.id;
                    this.booted = false;
                }});
            }
        });
    }

    ngOnDestroy() {
        this.searchService.emit(SearchEvents.NAV_TOGGLE, 0);
    }

    get container() {
        return this.containerElement.nativeElement;
    }

    get footerStyle() {
        if (!this.scrollToUp) {
            return {};
        }
        const bound = this.container.getBoundingClientRect();
        return {
            width: bound.width + 'px'
        };
    }

    public onProgressChange(event: IFlipProgress) {
        if (event.progress === 0) {
            this.searchService.pushHistoryState(event.item.title,
                window.location.href.replace(/\/\d+\/\d+.*/, '/' + event.item.book + '/' + event.item.id));
        }
        this.chapterId = event.item.id;
        const progress = Math.floor(event.progress);
        if (progress !== this.progress) {
            this.progress = progress;
        }
        if (Math.abs(this.progress - this.lastProgress) > 20) {
            this.service.recordHistory(event.item.book, event.item.id, event.progress).subscribe(_ => {});
            this.lastProgress = this.progress;
        }
    }

    public onScrollChange() {
        this.flipPager.scrollTo(this.flipPager.current, this.progress);
    }

    public onRequest(event: IRequestEvent) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        if (Object.prototype.hasOwnProperty.call(this.cacheChapters, event.id)) {
            event.callback(this.cacheChapters[event.id]);
            this.isLoading = false;
            this.booted = true;
            return;
        }
        this.service.getChapter(event.id, this.bookId).subscribe({
            next: res => {
                this.cacheChapters[event.id] = res;
                event.callback(res);
                this.isLoading = false;
                this.booted = true;
            }, 
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    public tapPrev() {
        this.flipPager.tapPrevious();
    }

    public tapNext() {
        this.flipPager.tapNext();
    }

    public onBackgroundChange() {
        this.configs.backgroundImage = null;
    }

    public tapBackgroundImg() {
        const name = 'file-input';
        let fileELment: HTMLInputElement = document.querySelector('.' + name) as HTMLInputElement;
        const that = this;
        const changeEventHandle = function(this: GlobalEventHandlers) {
                const files = (this as HTMLInputElement).files;
                if (!files || files.length < 1) {
                    return;
                }
                that.configs.backgroundImage = window.URL.createObjectURL(files[0]);
            };
        if (!fileELment) {
            fileELment = document.createElement('input');
            fileELment.type = 'file';
            fileELment.className = name;
            fileELment.multiple = false;
            fileELment.accept = 'image/*';
            document.body.appendChild(fileELment);
            fileELment.onchange = changeEventHandle;
        } else {
            fileELment.value = '';
            fileELment.multiple = false;
            fileELment.accept = 'image/*';
            fileELment.onchange = changeEventHandle;
        }
        fileELment.dispatchEvent(new MouseEvent('click'));
    }

    public tapMinus(name: 'size' | 'line' | 'letter') {
        if (!this.configs.hasOwnProperty(name)) {
            return;
        }
        const round = {
            size: [12, 2, 40],
            line: [2, 1, 40],
            letter: [1, 1, 40],
        };
        this.configs[name] = Math.min(Math.max(this.configs[name] as number - this.sizeRound[name][1],
        this.sizeRound[name][0]), this.sizeRound[name][2]);
    }

    public tapPlus(name: 'size' | 'line' | 'letter') {
        if (!this.configs.hasOwnProperty(name)) {
            return;
        }
        this.configs[name] = Math.min(Math.max(this.configs[name] as number + this.sizeRound[name][1],
        this.sizeRound[name][0]), this.sizeRound[name][2]);
    }

    public tapChapter() {
        this.router.navigate(['../../../chapter/' + this.flipPager.current?.book], {relativeTo: this.route});
    }

    public tapEye() {
        if (this.configs.theme === 7) {
            this.configs.theme = 1;
            [this.configs.background, this.configs.color] = this.configs.oldTheme.split('|');
            return;
        }
        this.configs.oldTheme = [this.configs.background, this.configs.color].join('|');
        this.configs.background = '#000';
        this.configs.color = '#fff';
        this.configs.theme = 7;
    }

    public tapSetting() {
        this.mode = this.mode === 2 ? 0 : 2;
    }

    private onScroll(_: any) {
        const oldTop = this.scrollTop;
        this.scrollTop = windowScollTop();
        const scrollWindowBottom = this.scrollTop + windowHeight();
        this.scrollToUp = this.scrollTop < oldTop;
        if (this.booted && !this.isLoading && scrollBottom() < 30) {
            this.flipPager.loadNext();
        }
        this.flipPager.onScroll(this.scrollTop, scrollWindowBottom, this.scrollToUp);
    }

}
