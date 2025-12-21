import { Component, inject, input, model, output, signal } from '@angular/core';
import { FileUploadService } from '../../../theme/services';
import { IUploadResult, IUploadFile } from '../../../theme/models/open';
import { assetUri } from '../../../theme/utils';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-image-input',
    templateUrl: './image-input.component.html',
    styleUrls: ['./image-input.component.scss'],
})
export class ImageInputComponent implements FormValueControl<string> {
    private readonly uploadService = inject(FileUploadService);


    public readonly placeholder = input($localize `Select an image`);
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');
    public readonly isLoading = signal(false);
    public uploadFailure = false;
    public fileName = this.uploadService.uniqueGuid();

    public readonly fileUploaded = output<IUploadResult | IUploadFile>();

    public formatAsset(val?: string) {
        return assetUri(val);
    }

    public tapRemove() {
        this.value.set('');
    }

    public uploadFile(event: any) {
        this.uploadFailure = false;
        const files = event.target.files as FileList;
        if (files.length < 1) {
            return;
        }
        this.isLoading.set(true);
        this.uploadService.uploadImage(files[0]).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.value.set(res.url);
                this.fileUploaded.emit(res);
            },
            error: _ => {
                this.isLoading.set(false);
                this.uploadFailure = true;
            },
        });
    }

}
