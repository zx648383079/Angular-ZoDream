import {
    Component,
    OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IBookList, IBookListItem } from '../../model';
import { BookService } from '../../book.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public data: IBookList;

    public items: IBookListItem[] = [];

    constructor(
        private service: BookService,
        private router: Router,
        private route: ActivatedRoute,
        private toastrService: ToastrService) {

    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.listDetail(params.id).subscribe(res => {
                this.data = res;
                this.items = res.items;
            });
        });
    }

    public tapCollect() {
        this.service.listCollect(this.data.id).subscribe(res => {
            this.data.is_collected = res.is_collected;
            this.data.collect_count = res.collect_count;
        }, err => {
            this.toastrService.warning(err.error.message);
        });
    }

    public tapAgree(item: IBookListItem) {
        this.service.listAgree(item.id).subscribe(res => {
            item.is_agree = res.is_agree;
            item.agree_count = res.agree_count;
            item.disagree_count = res.disagree_count;
        }, err => {
            this.toastrService.warning(err.error.message);
        });
    }

    public tapDisagree(item: IBookListItem) {
        this.service.listDisagree(item.id).subscribe(res => {
            item.is_agree = res.is_agree;
            item.agree_count = res.agree_count;
            item.disagree_count = res.disagree_count;
        }, err => {
            this.toastrService.warning(err.error.message);
        });
    }

    public tapAddBook(item: IBookListItem) {
        this.service.recordHistory(item.book_id, 0, 0).subscribe(_ => {
            item.on_shelf = true;
        }, err => {
            this.toastrService.warning(err.error.message);
        });
    }

}
