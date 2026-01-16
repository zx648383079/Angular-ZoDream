import { AfterViewInit, Component, ElementRef, HostListener, signal, viewChild } from '@angular/core';
import { IFileDataSource, IFileExplorerTool, IFileItem } from '../../model';
import { assetUri } from '../../../../theme/utils';
import { Canvas } from './Canvas';
import { Subject } from 'rxjs';
import { IImageAction, ImageActionItems } from './action';
import { ISize } from '../../../../theme/utils/canvas';

@Component({
    standalone: false,
    selector: 'app-file-explorer-image-editor',
    templateUrl: './file-explorer-image-editor.component.html',
    styleUrls: ['./file-explorer-image-editor.component.scss']
})
export class FileExplorerImageEditorComponent implements IFileExplorerTool, AfterViewInit {

    private readonly imageBox = viewChild<ElementRef<HTMLDivElement>>('imageBox');
    public readonly visible = signal(false);
    public data: IFileItem;
    public readonly isLoading = signal(false);
    public readonly isEditting = signal(false);
    public toolItems = ImageActionItems;
    private resizeFn: Function;
    private canvas: Canvas|undefined;
    private imageData: HTMLImageElement|undefined;
    private imageWidth = 0;
    private imageHeight = 0;
    private dataSource: IFileDataSource|undefined;
    private dataIndex = -1;
    
    @HostListener('window:resize', [])
    public onResize() {
        if (this.resizeFn) {
            this.resizeFn();
        }
        if (this.canvas) {
            const size = this.getOuterSize();
            this.canvas.resize(size.width, size.height);
        }
    }

    ngAfterViewInit(): void {
        if (!this.imageBox()?.nativeElement) {
            return;
        }
        // this.canvas = new Canvas(this.imageBox.nativeElement);
    }

    public get formatSize() {
        return `${this.imageWidth} * ${this.imageHeight}`;
    }

    public get formatIndex() {
        return `${this.dataIndex + 1}/${this.dataSource.count}`;
    }

    public open(file: IFileItem, source: IFileDataSource) {
        this.dataSource = source;
        this.dataIndex = source.indexOf(file);
        this.visible.set(true);
        this.changeFile(file);
    }

    public close() {
        this.visible.set(false);
    }

    public tapPrevious() {
        this.dataIndex --;
        if (this.dataIndex < 0) {
            this.dataIndex += this.dataSource.count();
        }
        this.changeFile(this.dataSource.getAt(this.dataIndex));
    }

    public tapNext() {
        this.dataIndex ++;
        if (this.dataIndex >= this.dataSource.count()) {
            this.dataIndex = 0;
        }
        this.changeFile(this.dataSource.getAt(this.dataIndex));
    }

    public tapEnterEdit() {
        this.isEditting.set(true);
        this.applyEditting();
    }

    public tapSave() {
        this.isEditting.set(false);
        this.applyEditting();
    }

    public tapTool(action: IImageAction) {
        this.canvas.batch(() => action.action(this.canvas.layer));
    }

    private changeFile(file: IFileItem) {
        this.data = {...file};
        this.loadImage(file.thumb).subscribe(res => {
            this.imageData = res;
            this.imageWidth = res.width;
            this.imageHeight = res.height;
            this.isEditting.set(false);
            this.applyEditting();
        });
    }

    private applyEditting() {
        if (this.isEditting) {
            const ele = document.createElement('canvas');
            this.resetCanvas(ele);
            this.reset(ele);
            this.canvas = new Canvas(ele);
            this.imageData.width = this.imageWidth;
            this.imageData.height = this.imageHeight;
            this.canvas.drawImage(this.imageData);
        } else {
            this.canvas = undefined;
            this.resetImage(this.imageData, this.imageWidth, this.imageHeight);
            this.reset(this.imageData);
        }
    }

    private loadImage(src: string): Subject<HTMLImageElement> {
        const task = new Subject<HTMLImageElement>();
        this.isLoading.set(true);
        const loader = new Image();
        loader.src = assetUri(src);
        loader.onload = () => {
            this.isLoading.set(false);
            task.next(loader);
        };
        loader.onerror = (_, __, ___, ____, err) => {
            task.error(err);
        };
        return task;
    }

    private resetImage(img: HTMLImageElement, width: number, height: number) {
        const target = this.imageBox()?.nativeElement;
        if (!this.visible || !target) {
            return;
        }
        const size = this.getOuterSize();
        const scale = Math.max(width / size.width, height / size.height);
        const w = width / scale;
        const h = height / scale;
        img.width = w;
        img.height = h;
        target.style.width = w + 'px';
        target.style.height = h + 'px';
        // this.canvas.resize(w, h);
        // this.canvas.drawImage(img);
    }

    private resetCanvas(img: HTMLCanvasElement) {
        const target = this.imageBox()?.nativeElement;
        if (!this.visible || !target) {
            return;
        }
        const box = target.parentElement;
        img.width = box.clientWidth;
        img.height = box.clientHeight;
        target.removeAttribute('style');
    }

    private reset(element: HTMLElement) {
        const target = this.imageBox()?.nativeElement;
        if (!target) {
            return;
        }
        for (let i = target.children.length - 1; i >= 0; i--) {
            target.removeChild(target.children[i]);
        }
        target.appendChild(element);
    }

    private getOuterSize(): ISize {
        const target = this.imageBox()?.nativeElement;
        if (!this.visible || !target) {
            return {width: 0, height: 0};
        }
        const box = target.parentElement;
        return {width: box.clientWidth, height: box.clientHeight};
    } 
}
