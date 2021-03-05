import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from '../../../theme/services/file-upload.service';
import { ICategory } from '../../model';
import { OnlineService } from '../online.service';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    public items: ICategory[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';
    public editData: ICategory;

    constructor(
        private service: OnlineService,
        private toastrService: ToastrService,
        private modalService: NgbModal,
        private uploadService: FileUploadService,
    ) {
        this.tapRefresh();
    }

    ngOnInit() {}

    public get pageTotal(): number {
        return Math.ceil(this.total / this.perPage);
    }

    public open(content: any, item?: ICategory) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            name: '',
            icon: '',
            description: '',
        };
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(value => {
            this.service.categorySave(this.editData).subscribe(_ => {
                this.toastrService.success('保存成功');
                this.tapPage();
            });
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadImage(files[0]).subscribe(res => {
            this.editData.icon = res.url;
        }, err => {
            this.toastrService.warning(err.error.message);
        });
    }

    public tapPreview() {
        window.open(this.editData.icon, '_blank');
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
        this.service.categoryList({
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }

    public tapRemove(item: any) {
        if (!confirm('确定删除“' + item.name + '”分类？')) {
            return;
        }
        this.service.categoryRemove(item.id).subscribe(res => {
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
