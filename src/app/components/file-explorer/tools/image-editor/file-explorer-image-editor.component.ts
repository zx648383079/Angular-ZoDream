import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { IFileExplorerTool, IFileItem } from '../../model';
import { assetUri } from '../../../../theme/utils';

@Component({
    selector: 'app-file-explorer-image-editor',
    templateUrl: './file-explorer-image-editor.component.html',
    styleUrls: ['./file-explorer-image-editor.component.scss']
})
export class FileExplorerImageEditorComponent implements IFileExplorerTool {

    @ViewChild('imageBox')
    private imageBox: ElementRef<HTMLDivElement>;
    public visible = false;
    public data: IFileItem;
    public isLoading = false;
    private resizeFn: Function;
    
    @HostListener('window:resize', [])
    private onResize() {
        if (this.resizeFn) {
            this.resizeFn();
        }
    }

    public open(file: IFileItem) {
        this.data = {...file};
        this.visible = true;
        this.loadImage(file.thumb);
    }

    public close() {
        this.visible = false;
    }

    private loadImage(src: string) {
        this.isLoading = true;
        const loader = new Image();
        loader.src = assetUri(src);
        loader.onload = () => {
            this.isLoading = false;
            const width = loader.width;
            const height = loader.height;
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
        const maxWidth = target.clientWidth;
        const maxHeight = target.clientHeight;
        for (let i = target.children.length - 1; i >= 0; i--) {
            target.removeChild(target.children[i]);
        }
        const scale = Math.max(Math.max(width / maxWidth, height / maxHeight), 1); 
        const w = width / scale;
        const h = height / scale;
        const x = (maxWidth - w) / 2;
        const y = (maxHeight - h) / 2;
        img.style.width = w + 'px';
        img.style.height = h + 'px';
        target.appendChild(img);
    }
}
