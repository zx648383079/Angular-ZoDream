import { Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ContextMenuComponent } from '../../../context-menu';
import { EditorService } from '../editor.service';
import { IPoint, IResetEvent, IRuleLine } from '../model/core';

@Component({
  selector: 'app-editor-rule-bar',
  templateUrl: './editor-rule-bar.component.html',
  styleUrls: ['./editor-rule-bar.component.scss']
})
export class EditorRuleBarComponent implements OnInit {
    @ViewChild('ruleBar', {static: true})
    public barRef: ElementRef<HTMLDivElement>;
    @ViewChild('hCanvas', {static: true})
    public hCanvasRef: ElementRef<HTMLCanvasElement>;
    @ViewChild('vCanvas', {static: true})
    public vCanvasRef: ElementRef<HTMLCanvasElement>;
    @ViewChild(ContextMenuComponent)
    public contextMenu: ContextMenuComponent;

    public tempLine: IRuleLine;

    public hLines: IRuleLine[] = [];
    public vLines: IRuleLine[] = [];
    public lineVisible = true;

    private get hRuler() {
        return this.hCanvasRef?.nativeElement;
    }

    private get vRuler() {
        return this.vCanvasRef?.nativeElement;
    }

    constructor(
        private readonly zone: NgZone,
        private readonly service: EditorService,
    ) {
    }

    ngOnInit() {
        this.service.resize$.subscribe(res => {
            if (!res || !res.main) {
                return;
            }
            this.zone.run(() => {
                this.createHRulerRect(res.main.width - 16, res.zoom ? res.zoom.x - res.main.x - 16 : 0);
                this.createVRulerRect(res.main.height - 16, res.zoom ? res.zoom.y - res.main.y - 16 : 0);
                this.refreshLine(res);
            });
        });
    }

    public tapIcon(event: MouseEvent) {
        event.stopPropagation();
        this.contextMenu.show(event, [
            {
                name: this.lineVisible ? '隐藏辅助线' : '显示辅助线',
                icon: this.lineVisible ? 'icon-eye-slash' : 'icon-eye',
                onTapped: () => {
                    this.lineVisible = !this.lineVisible;
                }
            },
            {
                name: '清空辅助线',
                icon: 'icon-trash',
                onTapped: () => {
                    this.vLines = [];
                    this.hLines = [];
                }
            }
        ]);
    }


    public tapBar(event: MouseEvent, horizontal = true) {
        const res = this.service.resize$.value;
        if (!res) {
            return;
        }
        this.lineVisible = true;
        if (horizontal) {
            this.hLines.push({
                horizontal,
                value: event.clientX - res.main.x - 16,
                label: Math.floor(event.clientX - res.zoom.x),
            });
            return;
        }
        this.vLines.push({
            horizontal,
            value: event.clientY - res.main.y - 16,
            label: Math.floor(event.clientY - res.zoom.y),
        });
    }

    public tapRemoveLine(i: number, horizontal: boolean, event: MouseEvent) {
        event.stopPropagation();
        if (horizontal) {
            this.hLines.splice(i, 1);
        } else {
            this.vLines.splice(i, 1);
        }
    }

    public onLineEnd() {
        this.tempLine = undefined;
    }

    public onLineMove(event: MouseEvent, horizontal = true) {
        const res = this.service.resize$.value;
        if (!res) {
            return;
        }
        if (horizontal) {
            this.tempLine = {
                horizontal,
                value: event.clientX - res.main.x - 16,
                label: Math.floor(event.clientX - res.zoom.x),
            };
            return;
        }
        this.tempLine = {
            horizontal,
            value: event.clientY - res.main.y - 16,
            label: Math.floor(event.clientY - res.zoom.y),
        };
    }

    private refreshLine(res: IResetEvent) {
        for (const item of this.vLines) {
            item.label = Math.floor(item.value + 16 + res.main.y - res.zoom.y);
        }
        for (const item of this.hLines) {
            item.label = Math.floor(item.value + 16 + res.main.x - res.zoom.x);
        }
    }

    /**
     * 创建横向的标尺
     */
     private createHRulerRect(width: number, panelLeftCalc = 0): void {
        const ruler = this.hRuler;
        if (!ruler) {
            return;
        }
        ruler.width = width;
        ruler.height = 16;
        const h = ruler.getContext('2d');
        // const panelLeftCalc = 0;//this.panelInfoModel.left - 216;
        // h.transform(1, 0, 0, 1, this.transformMatrixModel.translateX, 0);
        h.fillStyle = '#f9fafb';
        h.fillRect(0, 0, width, 16);
        // 创建新的矩阵
        h.setTransform(1, 0, 0, 1, panelLeftCalc, 0);
        h.lineWidth = 2;
        const handleDrawLine = (i: number) => {
            this.drawLine(
                h,
                { x: i * 10, y: i % 10 == 0 ? 0 : 10 },
                { x: i * 10, y: 16 },
                '#ccc'
            );
            this.drawLine(
                h,
                { x: i * 10 + 1, y: i % 10 == 0 ? 0 : 10 },
                { x: i * 10 + 1, y: 16 },
                '#f9fafb'
            );
            if (i % 10 == 0) {
                h.font = 'normal normal bold 12px';
                h.fillStyle = '#2b3c4d';
                h.fillText(i * 10 + '', i * 10 + 4, 10);
            }
        };
        for (let i: number = 0; i < (width - panelLeftCalc) / 10; i++) {
            handleDrawLine(i);
        }
        for (let i: number = 0; i > -panelLeftCalc / 10; i--) {
            handleDrawLine(i);
        }
    }

    /**
     * 创建纵向的标尺
     */
    private createVRulerRect(height: number, panelTopCalc = 0): void {
        const ruler = this.vRuler;
        if (!ruler) {
            return;
        }
        ruler.height = height;
        ruler.width = 16;
        const v = ruler.getContext('2d');
        // const panelTopCalc = 0;// this.panelInfoModel.top - 66;
        // v.transform(1, 0, 0, 1, 0, height);
        v.fillStyle = '#f9fafb';
        v.fillRect(0, 0, 16, height);
        // 创建新的矩阵
        v.setTransform(1, 0, 0, 1, 0, panelTopCalc);
        v.lineWidth = 2;
        const handleDrawLine = (i: number) => {
            this.drawLine(
                v,
                { x: i % 10 == 0 ? 0 : 10, y: i * 10 },
                { x: 16, y: i * 10 },
                '#ccc'
            );
            this.drawLine(
                v,
                { x: i % 10 == 0 ? 0 : 10, y: i * 10 - 1 },
                { x: 16, y: i * 10 - 1 },
                '#f9fafb'
            );
            if (i % 10 == 0) {
                v.save();
                v.textAlign = 'center';
                v.textBaseline = 'middle';
                v.translate(6, i * 10 - 14);
                v.rotate((-90 * Math.PI) / 180);
                v.font = 'normal normal bold 12px';
                v.fillStyle = '#2b3c4d';
                v.fillText(i * 10 + '', 0, 0);
                v.restore();
            }
        };
        for (let i: number = 0; i < (height - panelTopCalc) / 10; i++) {
            handleDrawLine(i);
        }
        for (let i: number = 0; i > -panelTopCalc / 10; i--) {
            handleDrawLine(i);
        }
    }

    private drawLine(
        rule: CanvasRenderingContext2D,
        move: IPoint,
        line: IPoint,
        color: string
    ): void {
        rule.beginPath();
        rule.strokeStyle = color;
        rule.moveTo(move.x, move.y);
        rule.lineTo(line.x, line.y);
        rule.stroke();
    }

}
