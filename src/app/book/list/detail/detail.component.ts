import {
    Component,
    OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBookList, IBookListItem } from '../../../theme/models/book';
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
        private route: ActivatedRoute) {

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

}
