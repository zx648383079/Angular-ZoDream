import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, effect, inject, input, output, viewChild } from '@angular/core';
import { ContextMenuComponent } from '../context-menu';
import { randomInt } from '../../theme/utils';
import { MindConfirmEvent, MindLinkSource, MindPointSource, MindUpdateEvent } from './model';
import { IPoint } from '../../theme/utils/canvas';

interface IPointItem extends IPoint {
    id?: number|string;
    text: string;
    width: number;
    source?: any;
}

interface IPointLink {
    from: number;
    to: number;
    text?: string;
    color?: string;
    source?: any;
}

@Component({
    standalone: false,
    selector: 'app-mind',
    templateUrl: './mind.component.html',
    styleUrls: ['./mind.component.scss']
})
export class MindComponent implements AfterViewInit, OnInit {
    private renderer = inject(Renderer2);
    private elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);


    public readonly lineBoxRef = viewChild<ElementRef<HTMLCanvasElement>>('lineBox');

    public readonly contextMenu = viewChild(ContextMenuComponent);

    public readonly readonly = input(true);
    public readonly items = input<any[]>([]);
    public readonly linkItems = input<any[]>([]);
    /**
     * 转化函数，必须的
     */
    public readonly format = input<(data: any) => MindPointSource | MindLinkSource>(undefined);
    public readonly confirm = output<MindConfirmEvent>();
    public readonly update = output<MindUpdateEvent>();

    public pointItems: IPointItem[] = [];
    public pointLink: IPointLink[] = [];

    private ctx: CanvasRenderingContext2D;
    private moveListeners = {
        move: undefined,
        finish: undefined,
    };
    private lineColor = '#4285F4';
    private lineWidth = 4;
    private centerY = 18;

    get lineBox(): HTMLCanvasElement {
        return this.lineBoxRef().nativeElement as HTMLCanvasElement;
    }

    constructor() {
        effect(() => {
            this.items();
            this.linkItems();
            this.refreshPoint();
            this.refresh();
        });
    }

    ngOnInit() {
        this.renderer.listen(document, 'mousemove', (event: MouseEvent) => {
            if (this.moveListeners.move) {
                this.moveListeners.move(event);
            }
        });
        this.renderer.listen(document, 'mouseup', (event: MouseEvent) => {
            if (this.moveListeners.finish) {
                this.moveListeners.finish(event);
            }
        });
    }

    ngAfterViewInit() {
        const bound = this.elementRef.nativeElement.getBoundingClientRect();
        this.lineBox.width = bound.width <= 0 ? window.innerWidth : bound.width;
        this.lineBox.height = bound.height <= 0 ? window.innerHeight : bound.height;
        this.ctx = this.lineBox.getContext('2d');
        this.refresh();
    }

    public onMoveStart(start: MouseEvent, i: number) {
        let x = start.clientX;
        let y = start.clientY;
        const item = this.pointItems[i];
        this.move(event => {
            item.x += event.clientX - x;
            item.y += event.clientY - y;
            this.refresh();
            x = event.clientX;
            y = event.clientY;
        }, _ => {
            this.update.emit({
                type: 'move',
                source: item.source,
                point: {
                    x: item.x,
                    y: item.y,
                }
            });
        });
    }

    public onNewStart(start: MouseEvent, i: number) {
        start.stopPropagation();
        this.move(event => {
            this.refresh();
            this.drawLine(this.ctx, start.clientX, start.clientY, event.clientX, event.clientY);
        }, (event, to) => {
            if (typeof to !== 'undefined') {
                this.linkPoint(i, to);
                return;
            }
            const x = event.clientX;
            const y = event.clientY - this.centerY;
            const from = i;
            this.confirm.emit({
                type: 'new link',
                point: {
                    x,
                    y,
                },
                from: this.pointItems[from].source,
                next: (data, link) => {
                    const formatData = this.format()(data) as MindPointSource;
                    const formatLink = link ? this.format()(link) as MindLinkSource : undefined;
                    this.pointItems.push(this.newPoint(formatData.text, x, y, data, formatData.id));
                    const to = this.pointItems.length - 1;
                    this.pointLink.push({
                        from,
                        to,
                        text: formatLink?.text,
                        color: formatLink?.color,
                        source: link
                    });
                    this.refresh();
                }
            });
        });
    }

    public onLinkFinish(event: MouseEvent, i: number) {
        event.stopPropagation();
        if (this.moveListeners.finish) {
            this.moveListeners.finish(event, i);
        }
    }

    public tapNew(event: MouseEvent) {
        const x = event.clientX - 100;
        const y = event.clientY - this.centerY * 5;
        this.confirm.emit({
            type: 'new',
            point: {
                x,
                y,
            },
            next: data => {
                const formatData = this.format()(data) as MindPointSource;
                this.pointItems.push(this.newPoint(formatData.text, x, y, data, formatData.id));
            }
        });
    }

    public onContext(event: MouseEvent, i: number) {
        return this.contextMenu().show(event, [
            {
                name: $localize `Delete`,
                icon: 'icon-trash',
                onTapped: () => {
                    this.removePoint(i);
                    this.refresh();
                },
            }
        ]);
    }

    public refresh() {
        if (!this.ctx) {
            return;
        }
        this.clearCanvas(this.ctx, 0, 0, this.lineBox.width, this.lineBox.height);
        for (const item of this.pointLink) {
            this.drawPointLink(this.ctx, item);
        }
    }

    private newPoint(text: string, x: number, y: number, source?: any, id?: number|string): IPointItem {
        return {
            text,
            x,
            y,
            width: this.fontWidth(text),
            source,
            id,
        };
    }

    private fontWidth(item: IPointItem|string): number {
        return (typeof item === 'object' ? item.text : item).length * 16 + 20;
    }

    private linkPoint(from: number, to: number) {
        if (!this.canPushLink(from, to, this.pointLink)) {
            return;
        }
        this.confirm.emit({
            type: 'link',
            from: this.pointItems[from].source,
            to: this.pointItems[to].source,
            next: link => {
                const formatLink = this.format()(link) as MindLinkSource;
                this.pointLink.push({
                    from,
                    to,
                    text: formatLink.text,
                    color: formatLink.color || this.randomColor(),
                    source: link,
                });
                this.refresh();
            }
        });
    }

    private removePoint(i: number) {
        this.pointItems.splice(i, 1);
        for (let i = 0; i < this.pointLink.length; i++) {
            const element = this.pointLink[i];
            if (element.from === i || element.to === i) {
                this.pointLink.splice(i, 1);
                this.update.emit({
                    type: 'delete',
                    source: element.source,
                });
                continue;
            }
            if (element.from > i) {
                element.from --;
            }
            if (element.to > i) {
                element.to --;
            }
        }
    }

    private refreshPoint() {
        const format = this.format();
        if (!format) {
            throw new Error('format is required!');
        }
        const maps: any = {};
        const items: IPointItem[] = [];
        let i = -1;
        for (const item of this.items()) {
            const formatItem = format(item) as MindPointSource;
            if (!formatItem) {
                continue;
            }
            const oldPoint = this.getOldPoint(formatItem);
            if (!oldPoint) {
                i ++;
            }
            maps[formatItem.id] = i;
            items.push({
                text: formatItem.text,
                width: this.fontWidth(formatItem.text),
                x: oldPoint ? oldPoint.x : (formatItem.x || randomInt(50, window.innerWidth - 200)),
                y: oldPoint ? oldPoint.y : (formatItem.y || (i * 30)),
                source: item,
            });
        }
        const linkItems: IPointLink[] = [];
        for (const item of this.linkItems()) {
            const formatItem = format(item) as MindLinkSource;
            if (!formatItem) {
                continue;
            }
            const from = maps[formatItem.from];
            const to = maps[formatItem.to];
            if (this.canPushLink(from, to, linkItems)) {
                linkItems.push({
                    from,
                    to,
                    text: formatItem.text,
                    color: formatItem.color,
                    source: item,
                });
            }
        }
        this.pointItems = items;
        this.pointLink = linkItems;
    }

    private getOldPoint(data: MindPointSource): IPointItem|undefined {
        if (!data || !data.id) {
            return;
        }
        for (const item of this.pointItems) {
            if (data.id === item.id) {
                return item;
            }
        }
        return;
    }

    private canPushLink(from: number, to: number, items: IPointLink[]): boolean {
        if (from === to || typeof from !== 'number' || typeof to !== 'number') {
            return false;
        }
        for (const item of items) {
            if (item.from === from && item.to === to) {
                return false;
            }
            if (item.to === from && item.from === to) {
                return false;
            }
        }
        return true;
    }

    public move(move: (event: MouseEvent) => void, finish?: (event: MouseEvent, i?: number) => void) {
        this.moveListeners = {
            move,
            finish: (event, i) => {
                this.moveListeners = {move: undefined, finish: undefined};
                finish && finish(event, i);
            },
        };
    }

    private drawBezier(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2 : number, y2: number) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(x1 + (x2 - x1) * 2 / 3, y1, x1, y2, x2, y2);
        ctx.stroke();
    }
    private drawPointLink(ctx: CanvasRenderingContext2D, link: IPointLink) {
        const from = this.pointItems[link.from];
        const to = this.pointItems[link.to];
        if (!from || !to) {
            return;
        }
        let fromX: number;
        let toX: number;
        if (from.x + from.width < to.x) {
            fromX = from.x + from.width;
            toX = to.x;
        } else if (from.x < to.x) {
            fromX = from.x;
            toX = to.x;
        } else if (from.x > to.x + to.width) {
            fromX = from.x;
            toX = to.x + to.width;
        } else {
            fromX = from.x;
            toX = to.x;
        }
        this.drawLink(ctx, fromX, from.y + this.centerY, toX, to.y + this.centerY, link.text, link.color);
    }

    private drawLink(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2 : number, y2: number, text?: string, color = this.lineColor) {
        this.drawLine(ctx, x1, y1, x2, y2, color);
        if (!text) {
            return;
        }
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        ctx.font = '16px scans-serif';
        ctx.fillStyle = color || '#000';
        ctx.fillText(text, centerX - text.length * 8, centerY - 8);
    }
    private drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2 : number, y2: number, color: string = this.lineColor) {
        ctx.strokeStyle = color || this.lineColor;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    private clearCanvas(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        ctx.clearRect(x, y, w, h);
    }

    private randomColor() {
        const r = randomInt(60, 255);
        const g = randomInt(0, 255);
        const b = randomInt(0, 255);
        return `rgb(${r},${g},${b})`;
    }
}
