import { Component, inject, input, model, output } from '@angular/core';
import { Observable } from 'rxjs';
import { IUploadFile, IUploadResult } from '../../../theme/models/open';
import { FileUploadService } from '../../../theme/services/file-upload.service';
import { assetUri } from '../../../theme/utils';
import { FileOnlineComponent } from '../file-online/file-online.component';
import { UploadCustomEvent } from '../../form';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-file-input',
    templateUrl: './file-input.component.html',
    styleUrls: ['./file-input.component.scss'],
})
export class FileInputComponent implements FormValueControl<string|any> {
    private readonly uploadService = inject(FileUploadService);


    public readonly accept = input('image/*');
    public readonly placeholder = input($localize `Please select file`);
    /**
     * 是否开启在线选择
     */
    public readonly online = input(false);
    public readonly custom = input(false);

    public uploadFailure = false;
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string|any>('');
    public isLoading = false;
    public fileName = this.uploadService.uniqueGuid();

    public readonly fileUploaded = output<IUploadResult | IUploadFile>();
    public readonly customUpload = output<UploadCustomEvent>();


    get canPreview() {
        return !this.custom() && this.accept().indexOf('image') >= 0;
    }

    public openOnline(modal: FileOnlineComponent) {
        this.uploadFailure = false;
        if (this.disabled || !this.online()) {
            return;
        }
        modal.open((item: IUploadFile) => {
            this.value.set(item.url);
            this.fileUploaded.emit(item);
        });
    }

    public uploadFile(event: any) {
        this.uploadFailure = false;
        const files = event.target.files as FileList;
        if (files.length < 1) {
            return;
        }
        if (this.custom()) {
            this.isLoading = true;
            this.customUpload.emit({
                file: files[0],
                next: res => {
                    this.isLoading = false;
                    if (res) {
                        this.value.set(res.url);
                        this.fileUploaded.emit(res);
                    }
                }
            });
            return;
        }
        let upload$: Observable<IUploadResult>;
        if (this.accept().indexOf('image') >= 0) {
            upload$ = this.uploadService.uploadImage(files[0]);
        } else if (this.accept().indexOf('audio') >= 0) {
            upload$ = this.uploadService.uploadAudio(files[0]);
        } else if (this.accept().indexOf('video') >= 0) {
            upload$ = this.uploadService.uploadVideo(files[0]);
        } else {
            upload$ = this.uploadService.uploadFile(files[0]);
        }
        this.isLoading = true;
        upload$.subscribe({
            next: res => {
                this.isLoading = false;
                this.value.set(res.url);
                this.fileUploaded.emit(res);
            },
            error: _ => {
                this.isLoading = false;
                this.uploadFailure = true;
            },
        });
    }

    public tapPreview() {
        const value = this.value();
        this.uploadFailure = false;
        if (!value) {
            return;
        }
        window.open(assetUri(value), '_blank');
    }
}
