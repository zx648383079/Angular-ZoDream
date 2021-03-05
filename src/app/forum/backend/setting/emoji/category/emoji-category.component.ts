import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IEmojiCategory } from '../../../../../theme/models/forum';
import { FileUploadService } from '../../../../../theme/services/file-upload.service';
import { ForumService } from '../../../forum.service';

@Component({
  selector: 'app-emoji-category',
  templateUrl: './emoji-category.component.html',
  styleUrls: ['./emoji-category.component.scss']
})
export class EmojiCategoryComponent implements OnInit {

    public items: IEmojiCategory[] = [];
    public isLoading = false;
    public keywords = '';
    public editData: IEmojiCategory;

    constructor(
        private service: ForumService,
        private toastrService: ToastrService,
        private modalService: NgbModal,
        private uploadService: FileUploadService,
    ) {
        this.tapRefresh();
    }

    ngOnInit() {
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.emojiCategoryList({
            keywords: this.keywords,
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords || '';
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        if (!confirm('确定删除“' + item.name + '”分组？')) {
            return;
        }
        this.service.emojiCategoryRemove(item.id).subscribe(res => {
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
            icon: '',
        };
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(value => {
            this.service.emojiCategorySave(this.editData).subscribe(res => {
                this.toastrService.success('保存成功');
                this.tapRefresh();
            });
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadImage(files[0]).subscribe(res => {
            this.editData.icon = res.url;
            if (!this.editData.name) {
                this.editData.name = res.original;
            }
        }, err => {
            this.toastrService.warning(err.error.message);
        });
    }

    public tapPreview() {
        window.open(this.editData.icon, '_blank');
    }

}
