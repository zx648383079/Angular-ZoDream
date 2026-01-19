import { Component, computed, inject, input, model, signal } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { IMediaFileItem } from '../../../theme/models/seo';
import { FileUploadService } from '../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-multi-image-input',
    templateUrl: './multi-image-input.component.html',
    styleUrls: ['./multi-image-input.component.scss']
})
export class MultiImageInputComponent implements FormValueControl<IMediaFileItem[]> {
    private readonly uploadService = inject(FileUploadService);
    public readonly value = model<IMediaFileItem[]>([{
        url: '',
        thumb: '/assets/images/debug.jpg',
        title: '',
        type: ''
    }]);
    public readonly disabled = input<boolean>(false);
    public readonly minLength = input<number>(0);
    public readonly maxLength = input<number>(0);
    public readonly isLoading = signal(false);
    public readonly fileName = this.uploadService.uniqueGuid();

     public readonly canUpload = computed(() => {
        if (this.disabled()) {
            return false;
        }
        return this.maxLength() <= 0 || this.maxLength() > this.value().length;
    });

    public tapRemoveItem(i: number) {
        if (this.disabled()) {
            return;
        }
        this.value.update(v => {
            v.splice(i, 1);
            return [...v];
        });
    }


    public uploadImages(event: Event) {
        this.uploadFiles((event.target as HTMLInputElement).files as FileList);
    }

    public uploadFiles(files: FileList|File[]) {
        if (!this.canUpload) {
            return;
        }
        const maps: any = {};
        const form = new FormData();
        let j = 0;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.indexOf('image/') < 0 && file.type.indexOf('video/') < 0) {
                continue;
            }
            maps[file.name] = file.type.indexOf('image/') < 0 ? 1 : 0;
            form.append('file[]', file, file.name);
            j ++;
            if (this.maxLength() > 0 && j >= this.maxLength()) {
                return;
            }
        }
        if (j < 1) {
            return;
        }
        this.isLoading.set(true);
        // 这样就可以多文件上传
        this.uploadService.uploadFiles(form).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.value.update(v => {
                    return [...v, ...res.map(item => {
                        return {
                            thumb: item.thumb,
                            size: item.size,
                            title: item.title,
                            type: item.original,
                            url: item.url
                        }
                    })];
                });
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }
}
