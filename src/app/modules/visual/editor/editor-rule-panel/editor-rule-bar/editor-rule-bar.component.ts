import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { EditorService } from '../../editor.service';
import { IRuleLine } from '../../model';
import { IPoint } from '../../../../../theme/utils/canvas';

@Component({
    selector: 'app-editor-rule-bar',
    templateUrl: './editor-rule-bar.component.html',
    styleUrls: ['./editor-rule-bar.component.scss']
})
export class EditorRuleBarComponent implements OnChanges {

    @ViewChild('drawer')
    private drawer: ElementRef<HTMLCanvasElement>;
    @Input() public orientation = true;
    @Input() public offset = 0;
    @Input() public gap = 10;
    @Input() public scale = 1;
    @Input() public foreground = '#ccc';
    @Output() public tapped = new EventEmitter<IRuleLine>();
    @Output() public hovered = new EventEmitter<IRuleLine>();

    private baseWidth = 0;
    private baseX = 0;
    private baseHeight = 16;

    private get offsetX() {
        return (this.baseHeight - this.offset) * this.scale;
    }

    constructor(
        private readonly service: EditorService,
    ) {
        this.service.shellSize$.subscribe(res => {
            if (!res) {
                return;
            }
            const zoom = this.service.workspaceSize$.value;
            this.baseWidth = (this.orientation ? zoom.width :  zoom.height) - this.baseHeight;
            this.baseX = (this.orientation ? zoom.x :  zoom.y) + this.baseHeight;
            this.offset = (this.orientation ? res.size.x : res.size.y);
            this.scale = res.scale / 100;
            const canvas = this.drawer.nativeElement;
            if (this.orientation) {
                canvas.width = this.baseWidth;
                canvas.height = this.baseHeight;
            } else {
                canvas.width = this.baseHeight;
                canvas.height = this.baseWidth;
            }
            this.onRender(canvas.getContext('2d'));
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes.offset || changes.gap || changes.scale) && this.drawer) {
            this.onRender(this.drawer.nativeElement.getContext('2d'));
        }
    }

    public tapBar(event: MouseEvent) {
        this.tapped.emit(this.createLine(event));
    }

    public onLineMove(event: MouseEvent) {
        this.hovered.emit(this.createLine(event));
    }

    private createLine(event: MouseEvent) :IRuleLine {
        const x = (this.orientation ? event.clientX : event.clientY) - this.baseX;
        return {
            value: x,
            label: Math.floor((x + this.offsetX) / this.scale),
            horizontal: this.orientation
        };
    }

    private onRender(drawingContext: CanvasRenderingContext2D) {
        drawingContext.fillStyle = '#fff';
        drawingContext.lineWidth = 2;
        const h = this.baseHeight;
        if (this.orientation) {
            drawingContext.fillRect(0, 0, this.baseWidth, h);
        } else {
            drawingContext.fillRect(0, 0, h, this.baseWidth);
        }
        const gap = this.gap * this.scale;
        const count = Math.ceil(this.baseWidth / gap);
        const start = Math.ceil(this.offsetX / gap);
        const fontSize = h * .3;
        for (let i = 0; i < count; i++)
        {
            const real = start + i;
            const hasLabel = real % 5 == 0;
            const x = (real * gap - this.offsetX);
            const y = h * (hasLabel ? .6 : .4);
            if (this.orientation)
            {
                this.drawLine(drawingContext, {x, y: 0}, {x, y}, this.foreground);
                if (hasLabel)
                {
                    this.drawText(drawingContext, (real * this.gap).toString(), fontSize, this.foreground, {x, y});
                }
            } else
            {
                this.drawLine(drawingContext, {x: 0, y: x}, {x: y, y: x}, this.foreground);
                if (hasLabel)
                {
                    this.drawText(drawingContext, (real * this.gap).toString(), fontSize, this.foreground, {x: y - fontSize * 2, y: x});
                }
            }
        }
    }

    private drawText(context: CanvasRenderingContext2D, text: string, font: number, color: string, point: IPoint) {
        context.font = `normal normal bold ${font}px`;
        context.fillStyle = color;
        context.fillText(text, point.x, point.y + font);
    }

    private drawLine(
        context: CanvasRenderingContext2D,
        move: IPoint,
        line: IPoint,
        color: string
    ): void {
        context.beginPath();
        context.strokeStyle = color;
        context.moveTo(move.x, move.y);
        context.lineTo(line.x, line.y);
        context.stroke();
    }
}
