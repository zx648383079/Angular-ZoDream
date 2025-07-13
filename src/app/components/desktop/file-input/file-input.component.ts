import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { IUploadFile, IUploadResult } from '../../../theme/models/open';
import { FileUploadService } from '../../../theme/services/file-upload.service';
import { assetUri } from '../../../theme/utils';
import { FileOnlineComponent } from '../file-online/file-online.component';
import { UploadCustomEvent } from '../../form';

@Component({
    standalone: false,
    selector: 'app-file-input',
    templateUrl: './file-input.component.html',
    styleUrls: ['./file-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => FileInputComponent),
        multi: true
    }]
})
export class FileInputComponent implements ControlValueAccessor {

    @Input() public accept = 'image/*';
    @Input() public placeholder = $localize `Please select file`;
    /**
     * 是否开启在线选择
     */
    @Input() public online = false;
    @Input() public custom = false;

    public uploadFailure = false;
    public value: string;
    public disabled = false;
    public isLoading = false;
    public fileName = this.uploadService.uniqueGuid();

    @Output() public fileUploaded = new EventEmitter<IUploadResult | IUploadFile>();
    @Output() public customUpload = new EventEmitter<UploadCustomEvent>();

    onChange: any = () => {};
    onTouch: any = () => {};

    constructor(
        private uploadService: FileUploadService,
    ) {
    }

    get canPreview() {
        return !this.custom && this.accept.indexOf('image') >= 0;
    }

    public onValueChange() {
        this.onChange(this.value);
    }

    public openOnline(modal: FileOnlineComponent) {
        this.uploadFailure = false;
        if (this.disabled || !this.online) {
            return;
        }
        modal.open((item: IUploadFile) => {
            this.onChange(this.value = item.url);
            this.fileUploaded.emit(item);
        });
    }

    public uploadFile(event: any) {
        this.uploadFailure = false;
        const files = event.target.files as FileList;
        if (files.length < 1) {
            return;
        }
        if (this.custom) {
            this.isLoading = true;
            this.customUpload.emit({
                file: files[0],
                next: res => {
                    this.isLoading = false;
                    if (res) {
                        this.onChange(this.value = res.url);
                        this.fileUploaded.emit(res);
                    }
                }
            });
            return;
        }
        let upload$: Observable<IUploadResult>;
        if (this.accept.indexOf('image') >= 0) {
            upload$ = this.uploadService.uploadImage(files[0]);
        } else if (this.accept.indexOf('audio') >= 0) {
            upload$ = this.uploadService.uploadAudio(files[0]);
        } else if (this.accept.indexOf('video') >= 0) {
            upload$ = this.uploadService.uploadVideo(files[0]);
        } else {
            upload$ = this.uploadService.uploadFile(files[0]);
        }
        this.isLoading = true;
        upload$.subscribe({
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

    public tapPreview() {
        this.uploadFailure = false;
        if (!this.value) {
            return;
        }
        window.open(assetUri(this.value), '_blank');
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
