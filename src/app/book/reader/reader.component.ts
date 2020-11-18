import {
    Component,
    OnInit,
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
    private bookId = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: BookService,
    ) {}

    ngOnInit() {
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

    public tapBackgroundImg() {

    }

    public tapMinus(key: string) {

    }

    public tapPlus(key: string) {

    }

    public tapChapter() {
        this.router.navigate(['/book/chapter/' + this.flipPager.current?.book_id]);
    }

    public tapEye() {

    }

    public tapSetting() {

    }

}
