import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DialogService } from '../../dialog';
import { IEmoji } from '../../theme/models/seo';
import { IMicro, ITopic } from '../model';
import { IErrorResponse } from '../../theme/models/page';
import { FileUploadService } from '../../theme/services/file-upload.service';
import { MicroService } from '../micro.service';
import { IUploadResult } from '../../theme/models/open';
import { emptyValidate } from '../../theme/validators';
import { DialogBoxComponent } from '../../dialog';

@Component({
  selector: 'app-publish-form',
  templateUrl: './publish-form.component.html',
  styleUrls: ['./publish-form.component.scss']
})
export class PublishFormComponent {

    public fileType = 0;

    public fileItems: IUploadResult[] = [
    ];
    public content = '';

    public openType = 0;

    public typeItems = [
        '公开', '吐槽', '仅关注', '私人'
    ];

    public topic = '';
    public topicItems: ITopic[] = [];

    @Output() public published = new EventEmitter<IMicro>();

    constructor(
        private service: MicroService,
        private toastrService: DialogService,
        private uploadService: FileUploadService,
    ) { }

    public onTopicChange() {
        this.service.topicList({
            keywords: this.topic,
            per_page: 10,
        }).subscribe(res => {
            this.topicItems = res.data;
        });
    }

    public openTopic(modal: DialogBoxComponent) {
        modal.openCustom(item => {
            if (emptyValidate(item)) {
                return false;
            }
            this.content += '#' + item + '#';
        });
    }

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
            file: this.fileItems.map(i => {
                return {
                    thumb: i.thumb,
                    file: i.url,
                }
            }),
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
            if (this.fileType > 0) {
                this.fileItems = [];
            }
            this.fileType = 0;
            this.fileItems.push(...res);
        });
    }

    public uploadAudio(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadAudio(files[0]).subscribe(res => {
            if (this.fileType != 1) {
                this.fileItems = [];
            }
            this.fileType = 1;
            this.fileItems.push(res);
        });
    }

    public uploadVideo(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadVideo(files[0]).subscribe(res => {
            if (this.fileType != 2) {
                this.fileItems = [];
            }
            this.fileType = 2;
            this.fileItems.push(res);
        });
    }
}
