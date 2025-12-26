import { Component, OnInit, inject, output, signal } from '@angular/core';
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
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-publish-form',
    templateUrl: './publish-form.component.html',
    styleUrls: ['./publish-form.component.scss']
})
export class PublishFormComponent {
    private readonly service = inject(MicroService);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);
    private readonly themeService = inject(ThemeService);


    public fileType = 0;

    public readonly fileItems = signal<IUploadResult[]>([]);

    public readonly dataForm = form(signal({
        content: '',
        open_type: '0'
    }), schemaPath => {
        required(schemaPath.content);
    });

    public typeItems = [
        $localize `Public`, 
        $localize `Tucao`, 
        $localize `Only Followers`, 
        $localize `Private`
    ];

    public readonly topic = signal('');
    public readonly topicItems = signal<ITopic[]>([]);

    public readonly published = output<IMicro>();

    public onTopicChange(e: Event) {
        this.topic.set((e.target as HTMLInputElement).value);
        this.service.topicList({
            keywords: this.topic(),
            per_page: 10,
        }).subscribe(res => {
            this.topicItems.set(res.data);
        });
    }

    public openTopic(modal: DialogBoxComponent) {
        modal.openCustom(item => {
            if (emptyValidate(item)) {
                return false;
            }
            this.dataForm.content().value.update(v => v + '#' + item + '#');
        });
    }

    public tapEmoji(item: IEmoji) {
        this.dataForm.content().value.update(v => v + (item.type > 0 ? item.content : '[' + item.name + ']'));
    }

    public tapRemoveFile(i: number) {
        this.fileItems.update(v => {
            v.splice(i, 1);
            return v;
        });
    }

    public tapPublish(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Please input content`);
            return;
        }
        e?.enter();
        this.service.create({
            ...this.dataForm().value(),
            file: this.fileItems().map(i => {
                return {
                    thumb: i.thumb,
                    file: i.url,
                }
            }),
        }).subscribe({
            next: res => {
                e?.reset();
                this.toastrService.success($localize `Successfully released!`);
                this.fileItems.set([]);
                this.dataForm.content().value.set('');
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
                this.fileItems.set([]);
            }
            this.fileType = 0;
            this.fileItems.update(v => {
                return [...v, ...res];
            });
        });
    }

    public uploadAudio(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadAudio(files[0]).subscribe(res => {
            if (this.fileType != 1) {
                this.fileItems.set([]);
            }
            this.fileType = 1;
            this.fileItems.update(v => {
                return [...v, res];
            });
        });
    }

    public uploadVideo(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadVideo(files[0]).subscribe(res => {
            if (this.fileType != 2) {
                this.fileItems.set([]);
            }
            this.fileType = 2;
            this.fileItems.update(v => {
                return [...v, res];
            });
        });
    }
}
