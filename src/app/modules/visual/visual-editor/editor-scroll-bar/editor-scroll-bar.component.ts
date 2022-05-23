import { Component, EventEmitter, Input, Output } from '@angular/core';
import { checkRange } from '../../../../theme/utils';
import { EditorService } from '../editor.service';
import { IPoint } from '../model';

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

    private length = 50;
    private baseWidth = 0;
    @Output() public valueChange = new EventEmitter<number>();

    constructor(
        private service: EditorService,
    ) {
        this.service.resize$.subscribe(res => {
            if (!res || !res.zoom) {
                return;
            }
            this.baseWidth = this.orientation ? res.zoom.width : res.zoom.height;
            // this.baseX = this.orientation ? res.zoom.x : res.zoom.y;
            this.length = Math.min(60, Math.pow(this.baseWidth, 2) / (this.max - this.min));
        });
        
    }

    public get innerStyle() {
        const x = checkRange(this.baseWidth - (this.value - this.min) * this.baseWidth / (this.max - this.min), 0, this.baseWidth - this.length);
        if (this.orientation) {
            return {
                width: this.length + 'px',
                left: x + 'px',
            };
        }
        return {
            height: this.length + 'px',
            top: x + 'px',
        };
    }

    public onMouseDown(event: MouseEvent) {
        let last: IPoint = {x: event.clientX, y: event.clientY};
        this.service.mouseMove(p => {
            const offset = this.orientation ? (p.x - last.x) : (p.y - last.y);
            this.output(this.value - offset * (this.max - this.min) / this.baseWidth);
            last = p;
        });
    }

    private output(val: number) {
        val = checkRange(val, this.min, this.max);
        if (this.value == val) {
            return;
        }
        this.valueChange.emit(this.value = val);
    }
}
