import { Component, OnInit, inject, output } from '@angular/core';
import { DialogService } from '../../../components/dialog';
import { IEmoji } from '../../../theme/models/seo';
import { IMicro, ITopic } from '../model';
import { IErrorResponse } from '../../../theme/models/page';
import { FileUploadService } from '../../../theme/services/file-upload.service';
import { MicroService } from '../micro.service';
import { IUploadResult } from '../../../theme/models/open';
import { emptyValidate } from '../../../theme/validators';
import { DialogBoxComponent } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { ThemeService } from '../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-publish-form',
    templateUrl: './publish-form.component.html',
    styleUrls: ['./publish-form.component.scss']
})
export class PublishFormComponent {
    private service = inject(MicroService);
    private toastrService = inject(DialogService);
    private uploadService = inject(FileUploadService);
    private themeService = inject(ThemeService);


    public fileType = 0;

    public fileItems: IUploadResult[] = [
    ];
    public content = '';

    public openType = 0;

    public typeItems = [
        $localize `Public`, 
        $localize `Tucao`, 
        $localize `Only Followers`, 
        $localize `Private`
    ];

    public topic = '';
    public topicItems: ITopic[] = [];

    public readonly published = output<IMicro>();

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

    public tapPublish(e?: ButtonEvent) {
        if (this.content.length < 1) {
            this.toastrService.warning($localize `Please input content`);
            return;
        }
        e?.enter();
        this.service.create({
            content: this.content,
            open_type: this.openType,
            file: this.fileItems.map(i => {
                return {
                    thumb: i.thumb,
                    file: i.url,
                }
            }),
        }).subscribe({
            next: res => {
                e?.reset();
                this.toastrService.success($localize `Successfully released!`);
                this.fileItems = [];
                this.content = '';
                this.published.emit(res);
            }, error: err => {
                e?.reset();
                const res = err.error as IErrorResponse;
                if (res.code === 401) {
                    this.themeService.emitLogin();
                    return;
                }
                this.toastrService.warning(res.message);
            }
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
