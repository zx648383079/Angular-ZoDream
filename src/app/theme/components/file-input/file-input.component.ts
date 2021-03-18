import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { IUploadResult } from '../../models/open';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
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

    private static guid = 0;
    @Input() public accept = 'image/*';
    @Input() public placeholder = '请选择文件';

    public uniqueId = ++ FileInputComponent.guid;

    public value: string;
    public disabled = false;

    onChange: any = () => {};
    onTouch: any = () => {};

    constructor(
        private uploadService: FileUploadService,
    ) {
    }

    get canPreview() {
        return this.accept.indexOf('image') >= 0;
    }

    public onValueChange() {
        this.onChange(this.value);
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
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
        upload$.subscribe(res => {
            this.onChange(this.value = res.url);
        });
    }

    public tapPreview() {
        if (!this.value) {
            return;
        }
        window.open(this.value, '_blank');
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
