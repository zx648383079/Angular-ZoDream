import {
    Component,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IChapter } from '../../theme/models/book';
import { BookService } from '../book.service';
import { FlipPagerComponent } from './flip-pager/flip-pager.component';

@Component({
    selector: 'app-reader',
    templateUrl: './reader.component.html',
    styleUrls: ['./reader.component.scss']
})
export class ReaderComponent implements OnInit {

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
    private bookId = 0;
    private scrollTop = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: BookService,
        private renderer: Renderer2,
    ) {}

    ngOnInit() {
        this.renderer.listen(window, 'scroll', this.onScroll.bind(this));
        this.scrollTop = this.getScrollTop();
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.bookId = params.book;
            this.chapterId = params.id;
            if (this.chapterId < 1 && this.bookId > 0) {
                this.onRequest(0);
            }
        });
    }

    public onProgressChange(event) {
        const chapter: IChapter = event.chapter;
        if (event.progress === 0) {
            history.pushState(null, chapter.title,
                window.location.href.replace(/\/\d+\/\d+.*/, '/' + chapter.book_id + '/' + chapter.id));
        }
        this.chapterId = chapter.id;
        this.service.recordHistory(chapter.book_id, chapter.id, event.progress).subscribe(_ => {});
    }

    public onScrollChange() {
        window.scrollTo({
            top: this.progress * this.getPageHeight() / 100 - this.getWindowHeight()
        });
    }

    public onRequest(id: number) {
        this.service.getChapter(id, this.bookId).subscribe(res => {
            this.flipPager.append(res);
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
        this.router.navigate(['/book/chapter/' + this.flipPager.current?.book_id]);
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
        this.progress = (this.getScrollTop() + this.getWindowHeight()) * 100 / this.getPageHeight();
    }

     // 滚动条到底部的距离
     private getScrollBottomHeight() {
        const scrollTop = this.getScrollTop();
        return this.getPageHeight() - scrollTop - this.getWindowHeight();
    }

    // 页面高度
    private getPageHeight() {
        const box = document.querySelector('html');
        if (!box) {
            return 0;
        }
        return box.scrollHeight;
    }

    // 滚动条顶 高度
    private getScrollTop() {
        let scrollTop = 0;
        let bodyScrollTop = 0;
        let documentScrollTop = 0;
        if (document.body) {
            bodyScrollTop = document.body.scrollTop;
        }
        if (document.documentElement) {
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
    }

    private getWindowHeight() {
        let windowHeight = 0;
        if (document.compatMode === 'CSS1Compat') {
            windowHeight = document.documentElement.clientHeight;
        } else {
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
    }

}
