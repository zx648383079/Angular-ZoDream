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

}
