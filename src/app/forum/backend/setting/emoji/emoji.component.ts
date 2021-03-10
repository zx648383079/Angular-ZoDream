import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IEmoji, IEmojiCategory } from '../../../../theme/models/forum';
import { FileUploadService } from '../../../../theme/services/file-upload.service';
import { ForumService } from '../../forum.service';

@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss']
})
export class EmojiComponent implements OnInit {

    public items: IEmoji[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';

    public categories: IEmojiCategory[] = [];
    public category = 0;
    public editData: IEmoji;

    constructor(
        private service: ForumService,
        private toastrService: ToastrService,
        private modalService: NgbModal,
    ) {
        this.tapRefresh();
        this.service.emojiCategoryList({}).subscribe(res => {
            this.categories = res.data;
        });
    }

    ngOnInit() {
    }

    public get pageTotal(): number {
        return Math.ceil(this.total / this.perPage);
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.emojiList({
            keywords: this.keywords,
            cat_id: this.category,
            page,
            per_page: this.perPage,
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords || '';
        this.category = form.cat_id || 0;
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        if (!confirm('确定删除“' + item.name + '”表情？')) {
            return;
        }
        this.service.emojiRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    public tapView(content: any, item?: any) {
        this.editData = item || {
            id: 0,
            name: '',
            type: 0,
            content: '',
        };
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(value => {
            this.service.emojiSave(this.editData).subscribe(res => {
                this.toastrService.success('保存成功');
                this.tapPage();
            });
        });
    }

    public tapImport(content: any) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(value => {
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        const form = new FormData();
        form.append('file', files[0]);
        this.service.emojiImport(form).subscribe(_ => {
            this.tapRefresh();
        });
    }

}
