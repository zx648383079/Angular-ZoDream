import { afterNextRender, Component, computed, effect, ElementRef, inject, input, model, signal, viewChild } from '@angular/core';
import { FileUploadService } from '../../../../../theme/services';
import { IGoodsGallery } from '../../../model';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-gallery-panel',
    templateUrl: './gallery-panel.component.html',
    styleUrls: ['./gallery-panel.component.scss'],
})
export class GalleryPanelComponent implements FormValueControl<any> {
    private readonly uploadService = inject(FileUploadService);


    private readonly imageElement = viewChild<ElementRef<HTMLDivElement>>('imageBox');
    public readonly max = input(0);
    public readonly items = signal<IGoodsGallery[]>([]);
    public readonly disabled = input<boolean>(false);
    public readonly value = model<any>();
    public readonly isLoading = signal(false);
    public imageId = '';
    public videoId = '';

    constructor() {
        const fileName = this.uploadService.uniqueGuid();
        this.imageId = 'image_' + fileName;
        this.videoId = 'video_' + fileName;
        effect(() => {
            const obj = this.value();
            this.items.set(obj instanceof Array ? obj : []);
        });
        afterNextRender({
            write: () => {
                this.imageBox.ondrop = (ev) => {
                    this.fileDrog(ev.dataTransfer.files);
                    return false;
                };
                this.imageBox.ondragover = () => false;
            }
        });
    }

    public readonly canUpload = computed(() => {
        if (this.disabled()) {
            return false;
        }
        return this.max() <= 0 || this.max() > this.items().length;
    });

    private get imageBox() {
        return this.imageElement().nativeElement as HTMLDivElement;
    }

    public tapRemoveGallary(i: number) {
        if (this.disabled()) {
            return;
        }
        this.items.update(v => {
            v.splice(i, 1);
            return [...v];
        });
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
            if (this.max() > 0 && j >= this.max()) {
                return;
            }
        }
        if (j < 1) {
            return;
        }
        // 这样就可以多文件上传
        this.uploadService.uploadFiles(form).subscribe(res => {
            this.items.update(v => {
                for (const file of res) {
                    v.push({
                        thumb: file.thumb,
                        type: maps[file.original],
                        file: file.url
                    });
                }
                return v;
            });
            this.output();
        });
    }

    private output() {
        this.value.set(this.items);
    }

}
