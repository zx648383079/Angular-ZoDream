import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IWord } from '../../model';
import { OnlineBackendService } from '../online.service';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {

    public items: IWord[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';
    public editData: IWord;
    public category = 0;

    constructor(
        private service: OnlineBackendService,
        private toastrService: ToastrService,
        private modalService: NgbModal,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.category) {
                this.category = parseInt(params.category, 10);
            }
            this.tapRefresh();
        });
    }

    public get pageTotal(): number {
        return Math.ceil(this.total / this.perPage);
    }

    public open(content: any, item?: IWord) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            content: '',
            cat_id: this.category,
        };
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(value => {
            this.service.wordSave(this.editData).subscribe(_ => {
                this.toastrService.success('保存成功');
                this.tapPage();
            });
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords || '';
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.wordList({
            category: this.category,
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }

    public tapRemove(item: IWord) {
        if (!confirm('确定删除“' + item.content + '”？')) {
            return;
        }
        this.service.wordRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }


}
