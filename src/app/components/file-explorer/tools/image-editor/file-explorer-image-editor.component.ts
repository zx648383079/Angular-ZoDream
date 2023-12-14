import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { IFileExplorerTool, IFileItem } from '../../model';
import { assetUri } from '../../../../theme/utils';
import { Canvas } from './Canvas';

@Component({
    selector: 'app-file-explorer-image-editor',
    templateUrl: './file-explorer-image-editor.component.html',
    styleUrls: ['./file-explorer-image-editor.component.scss']
})
export class FileExplorerImageEditorComponent implements IFileExplorerTool, AfterViewInit {

    @ViewChild('imageBox')
    private imageBox: ElementRef<HTMLCanvasElement>;
    public visible = false;
    public data: IFileItem;
    public imageWidth = 0;
    public imageHeight = 0;
    public isLoading = false;
    public isEditting = false;
    private resizeFn: Function;
    private canvas: Canvas;
    
    @HostListener('window:resize', [])
    private onResize() {
        if (this.resizeFn) {
            this.resizeFn();
        }
    }

    ngAfterViewInit(): void {
        if (!this.imageBox?.nativeElement) {
            return;
        }
        this.canvas = new Canvas(this.imageBox.nativeElement);
    }

    public open(file: IFileItem) {
        this.data = {...file};
        this.visible = true;
        this.loadImage(file.thumb);
    }

    public close() {
        this.visible = false;
    }

    public tapEnterEdit() {
        this.isEditting = true;
    }

    public tapSave() {

    }

    private loadImage(src: string) {
        this.isLoading = true;
        const loader = new Image();
        loader.src = assetUri(src);
        loader.onload = () => {
            this.isLoading = false;
            const width = loader.width;
            const height = loader.height;
            this.imageWidth = width;
            this.imageHeight = height;
            this.displayImage(loader, width, height);
            this.resizeFn = () => {
                this.displayImage(loader, width, height);
            };
        };
    }

    private displayImage(img: HTMLImageElement, width: number, height: number) {
        const target = this.imageBox?.nativeElement;
        if (!this.visible || !target) {
            return;
        }
        const box = target.parentElement;
        const maxWidth = box.clientWidth;
        const maxHeight = box.clientHeight;
        const scale = Math.max(width / maxWidth, height / maxHeight);
        const w = width / scale;
        const h = height / scale;
        this.canvas.resize(w, h);
        this.canvas.drawImage(img);
    }
}
