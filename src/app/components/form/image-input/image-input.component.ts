import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { FileUploadService } from '../../../theme/services';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { IUploadResult, IUploadFile } from '../../../theme/models/open';
import { assetUri } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-image-input',
    templateUrl: './image-input.component.html',
    styleUrls: ['./image-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ImageInputComponent),
        multi: true
    }]
})
export class ImageInputComponent implements ControlValueAccessor {

    @Input() public placeholder = $localize `Select an image`;
    public value = '';
    public disabled = false;
    public isLoading = false;
    public uploadFailure = false;
    public fileName = this.uploadService.uniqueGuid();

    @Output() public fileUploaded = new EventEmitter<IUploadResult | IUploadFile>();

    onChange: any = () => {};
    onTouch: any = () => {};

    constructor(
        private uploadService: FileUploadService,
    ) { }

    public formatAsset(val?: string) {
        return assetUri(val);
    }

    public tapRemove() {
        this.onChange(this.value = '');
    }

    public uploadFile(event: any) {
        this.uploadFailure = false;
        const files = event.target.files as FileList;
        if (files.length < 1) {
            return;
        }
        this.isLoading = true;
        this.uploadService.uploadImage(files[0]).subscribe({
            next: res => {
                this.isLoading = false;
                this.onChange(this.value = res.url);
                this.fileUploaded.emit(res);
            },
            error: _ => {
                this.isLoading = false;
                this.uploadFailure = true;
            },
        });
    }

    writeValue(obj: any): void {
        this.value = obj;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
