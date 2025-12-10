import { Component, ElementRef, SimpleChanges, inject, input, output } from '@angular/core';
import { FileUploadService } from '../../../theme/services';
import { UploadButtonEvent } from '../event';

@Component({
    standalone: false,
    selector: 'app-upload-button',
    templateUrl: './upload-button.component.html',
    styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent {
    private elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
    private uploadService = inject(FileUploadService);


    public readonly disabled = input(false);
    public readonly loading = input(false);
    public readonly accept = input('');
    public readonly multiple = input(false);

    public fileName = this.uploadService.uniqueGuid();

    public readonly uploading = output<UploadButtonEvent>();
    private height = 0;

    get loadingStyle() {
        const width = this.height - 10;
        return {
            height: width + 'px',
            width: width + 'px',
        };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.disabled) {
            this.toggleClass('disabled', changes.disabled.currentValue);
        }
    }

    ngAfterViewInit() {
        if (this.height > 0) {
            return;
        }
        const ele = this.elementRef.nativeElement;
        const bound = ele.getBoundingClientRect();
        const style = getComputedStyle(ele);
        const toInt = (val: string): number => {
            return parseInt(val.replace(/[^\d]+/g, ''), 10)
        };
        this.height = bound.height - toInt(style.paddingTop) - toInt(style.paddingBottom);
    }

    /**
     * 开始执行加载
     */
    public enter() {
        this.loading = true;
        this.toggleClass('disabled', true);
    }

    /**
     * 停止执行
     */
    public reset() {
        this.loading = false;
        this.toggleClass('disabled', this.disabled());
    }

    public uploadFile(e: any) {
        if (this.disabled() || this.loading()) {
            return;
        }
        const files = e.target.files as FileList;
        if (files.length < 1) {
            return;
        }
        this.uploading.emit({
            files,
            enter: this.enter.bind(this),
            reset: this.reset.bind(this),
        });
    }

    private toggleClass(name: string, force?: boolean) {
        const ele = this.elementRef.nativeElement;
        if (force === void 0) {
            force = !ele.classList.contains(name);
        }
        if (force) {
            ele.classList.add(name);
            return;
        }
        ele.classList.remove(name);
    }

}
