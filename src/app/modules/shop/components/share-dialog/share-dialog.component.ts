import { Component, ElementRef, HostListener, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DialogEvent } from '../../../../components/dialog';
import { assetUri } from '../../../../theme/utils';

@Component({
    selector: 'app-shop-share-dialog',
    templateUrl: './share-dialog.component.html',
    styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent implements OnChanges, DialogEvent {

    @ViewChild('imageBox', {static: true})
    private imageBox: ElementRef<HTMLDivElement>;

    public visible = false;
    public isLoading = true;

    private resizeFn: Function;

    constructor() { }

    @HostListener('window:resize', [])
    private onResize() {
        if (this.resizeFn) {
            this.resizeFn();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        
    }

    public close(result?: any): void {
        this.visible = false;
        this.resizeFn = undefined;
    }

    public open(data?: any, confirm?: any, check?: any): void {
        this.resizeFn = undefined;
        this.visible = true;
        this.loadImage('/assets/images/blog.png');
    }

    public openCustom(cb?: unknown, title?: unknown): void {
        this.open();
    }
    public confirmClose(e: KeyboardEvent): void {
        this.close();
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
        const target = this.imageBox.nativeElement;
        if (!this.visible || !target) {
            return;
        }
        const maxWidth = window.innerWidth;
        const maxHeight = window.innerHeight;
        for (let i = target.children.length - 1; i >= 0; i--) {
            target.removeChild(target.children[i]);
        }
        const scale = Math.max(Math.max(width / maxWidth, height / maxHeight), 1); 
        const w = width / scale;
        const h = height / scale;
        const x = (maxWidth - w) / 2;
        const y = (maxHeight - h) / 2;
        img.style.width = target.style.width = w + 'px';
        img.style.height = target.style.height = h + 'px';
        target.style.left = x + 'px';
        target.style.top = y + 'px';
        target.appendChild(img);
    }

}
