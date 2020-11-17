import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

    constructor(
        private route: ActivatedRoute,
        private service: BookService,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.chapterId = params.id;
        });
    }

    public onProgressChange(event) {

    }

    public onRequest(id: number) {
        this.service.getChapter(id).subscribe(res => {
            this.flipPager.append(res);
        });
    }

    public tapPrev() {

    }

    public tapNext() {

    }

    public tapBackgroundImg() {

    }

    public tapMinus(key: string) {

    }

    public tapPlus(key: string) {

    }

    public tapChapter() {

    }

    public tapEye() {

    }

    public tapSetting() {

    }

}
