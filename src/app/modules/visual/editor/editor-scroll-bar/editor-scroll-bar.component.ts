import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditorService } from '../editor.service';
import { IPoint } from '../../../../theme/utils/canvas';

@Component({
  selector: 'app-editor-scroll-bar',
  templateUrl: './editor-scroll-bar.component.html',
  styleUrls: ['./editor-scroll-bar.component.scss']
})
export class EditorScrollBarComponent {

    @Input() public orientation = true;
    @Input() public min = 0;
    @Input() public max = 100;
    @Input() public value = 0;

    public innerStyle: any = {};

    private pxScale = 1;
    private baseSize = 6.4;
    private offset = 0;
    private maxOffset = 100;
    @Output() public valueChange = new EventEmitter<number>();

    constructor(
        private service: EditorService,
    ) {
        this.service.shellSize$.subscribe(res => {
            if (!res) {
                return;
            }
            const zoom = this.service.workspaceInnerSize$.value;
            if (this.orientation) {
                this.onRender(res.size.x, zoom.width, res.size.width, zoom.width);
            } else {
                this.onRender(res.size.y, zoom.height, res.size.height, zoom.height);
            }
        });
        
    }

    public onMouseDown(event: MouseEvent) {
        let last: IPoint = {x: event.clientX, y: event.clientY};
        this.service.mouseMove(p => {
            const offset = this.orientation ? (p.x - last.x) : (p.y - last.y);
            this.scroll(this.offset + offset);
            last = p;
        });
    }

    private output() {
        this.valueChange.emit(this.value = this.converter(this.offset));
    }

    /**
     * 移动多少个像素
     * @param offset 
     */
    public move(offset: number) {
        this.scroll(offset / this.pxScale);
    }

    /**
     * 滚动条滑动到多少距离, 不是实际像素
     * @param offset 
     */
    public scroll(offset: number) {
        this.offset = Math.max(0, Math.min(offset, this.maxOffset));
        this.innerStyle = {
            [this.orientation ? 'left' : 'top']: this.offset + 'px'
        };
        this.output();
    }

    /**
     * 移动百分比
     * @param percent /100 
     */
    public scrollTo(percent: number) {
        this.scroll(percent * this.maxOffset / 100);
    }

    /**
     * 滚动条滑动多少距离，转换成实际页面移动多少像素
     * @param offset 
     */
    private converter(offset: number): number {
        return offset * this.pxScale + this.min;
    }

    /**
     * 
     * @param viewSize 可见区域的
     * @param pageSize 总页面的
     * @param barSize 滚动条的长度
     */
    private onRender(offsetPx: number, viewSize: number, pageSize: number, barSize: number) {
        this.max = pageSize;
        if (pageSize <= viewSize) {
            this.maxOffset = 0;
            this.applySize(0, barSize);
            return;
        }
        const minInnerSize = Math.min(6 * this.baseSize, this.baseSize / 2);
        const diff = pageSize - viewSize;
        const barDiff = barSize - diff;
        const innerSize = barDiff <= minInnerSize ? minInnerSize : barDiff;
        this.maxOffset = barSize - innerSize;
        this.pxScale = diff / this.maxOffset;
        this.applySize(offsetPx / this.pxScale, innerSize);
        
    }

    private applySize(offset: number, size: number) {
        this.offset = Math.max(0, Math.min(offset, this.maxOffset));
        this.innerStyle = {
            [this.orientation ? 'left' : 'top']: offset + 'px',
            [this.orientation ? 'width' : 'height']: size + 'px',
        };
    }
}
