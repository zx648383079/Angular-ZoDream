import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IEmoji } from '../../theme/models/forum';
import { IMicro } from '../../theme/models/micro';
import { IErrorResponse } from '../../theme/models/page';
import { FileUploadService } from '../../theme/services/file-upload.service';
import { MicroService } from '../micro.service';

@Component({
  selector: 'app-publish-form',
  templateUrl: './publish-form.component.html',
  styleUrls: ['./publish-form.component.scss']
})
export class PublishFormComponent {

    public fileItems = [
    ];
    public content = '';

    public openType = 0;

    public typeItems = [
        '公开', '吐槽', '私人'
    ];

    @Output() public published = new EventEmitter<IMicro>();

    constructor(
        private service: MicroService,
        private toastrService: ToastrService,
        private uploadService: FileUploadService,
    ) { }

    public tapEmoji(item: IEmoji) {
        this.content += item.type > 0 ? item.content : '[' + item.name + ']';
    }

    public tapRemoveFile(i: number) {
        this.fileItems.splice(i, 1);
    }

    public tapPublish() {
        if (this.content.length < 1) {
            this.toastrService.warning('请输入内容');
            return;
        }
        this.service.create({
            content: this.content,
            open_type: this.openType,
            file: this.fileItems,
        }).subscribe(res => {
            this.toastrService.success('发布成功！');
            this.fileItems = [];
            this.content = '';
            this.published.emit(res);
        }, err => {
            const res = err.error as IErrorResponse;
            this.toastrService.warning(res.message);
        });
    }

    public uploadImage(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadImages(files).subscribe(res => {
            this.fileItems.push(... res.map(i => i.url));
        });
    }

    public uploadAudio(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadAudio(files[0]).subscribe(res => {
            this.fileItems.push(res.url);
        });
    }

    public uploadVideo(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadVideo(files[0]).subscribe(res => {
            this.fileItems.push(res.url);
        });
    }
}
