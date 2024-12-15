import { AfterViewInit, Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileUploadService } from '../../../../../theme/services';
import { IGoodsGallery } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-gallery-panel',
    templateUrl: './gallery-panel.component.html',
    styleUrls: ['./gallery-panel.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => GalleryPanelComponent),
        multi: true
    }]
})
export class GalleryPanelComponent implements ControlValueAccessor, AfterViewInit {

    @ViewChild('imageBox') 
    private imageElement: ElementRef<HTMLDivElement>;
    @Input() public max = 0;
    public items: IGoodsGallery[] = [];
    public disabled = false;
    public isLoading = false;
    public imageId = '';
    public videoId = '';

    onChange: any = () => { };
    onTouch: any = () => { };

    constructor(
        private uploadService: FileUploadService,
    ) {
        const fileName = this.uploadService.uniqueGuid();
        this.imageId = 'image_' + fileName;
        this.videoId = 'video_' + fileName;
    }

    public get canUpload() {
        if (this.disabled) {
            return false;
        }
        return this.max <= 0 || this.max > this.items.length;
    }

    get imageBox() {
        return this.imageElement.nativeElement as HTMLDivElement;
    }

    ngAfterViewInit() {
        this.imageBox.ondrop = (ev) => {
            this.fileDrog(ev.dataTransfer.files);
            return false;
        };
        this.imageBox.ondragover = () => false;
    }

    public tapRemoveGallary(i: number) {
        if (this.disabled) {
            return;
        }
        this.items.splice(i, 1);
        this.output();
    }

    public uploadImages(event: any) {
        this.fileDrog(event.target.files as FileList);
    }

    public uploadVideo(event: any) {
        this.fileDrog(event.target.files as FileList);
    }

    public fileDrog(files: FileList) {
        if (!this.canUpload) {
            return;
        }
        const maps: any = {};
        const form = new FormData();
        let j = 0;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.indexOf('image/') < 0 && file.type.indexOf('video/') < 0) {
                continue;
            }
            maps[file.name] = file.type.indexOf('image/') < 0 ? 1 : 0;
            form.append('file[]', file, file.name);
            j ++;
            if (this.max > 0 && j >= this.max) {
                return;
            }
        }
        if (j < 1) {
            return;
        }
        // 这样就可以多文件上传
        this.uploadService.uploadFiles(form).subscribe(res => {
            for (const file of res) {
                this.items.push({
                    thumb: file.thumb,
                    type: maps[file.original],
                    file: file.url
                });
            }
            this.output();
        });
    }

    private output() {
        this.onChange(this.items);
    }

    writeValue(obj: any): void {
        this.items = obj instanceof Array ? obj : [];
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
