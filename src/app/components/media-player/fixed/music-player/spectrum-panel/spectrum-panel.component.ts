import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { SpectrumType } from '../../model';

interface IHatItem {
    current: number;
    target: number;
    speed: number;
}

interface IPoint {
    x: number;
    y: number;
}

type RenderSpectumHatFunc = (context: CanvasRenderingContext2D, pen: string, x: number, y: number, width: number, height: number, hat: IHatItem) => void;
type RenderSpectumFunc = (context: CanvasRenderingContext2D, pen: string, dataIndex: number, x: number, y: number, width: number, height: number) => void;
type RenderSpectumRingPointFunc = (context: CanvasRenderingContext2D, pen: string, x: number, y: number) => void;
type RenderSpectumRingFunc = (context: CanvasRenderingContext2D, pen: string, dataIndex: number, x: number, y: number, width: number, height: number, 
    angle: number, centerX: number, centerY: number, radius: number) => void;

@Component({
  selector: 'app-spectrum-panel',
  templateUrl: './spectrum-panel.component.html',
  styleUrls: ['./spectrum-panel.component.scss']
})
export class SpectrumPanelComponent implements OnChanges, AfterViewInit {

    @ViewChild('drawerBox')
    private drawerElement: ElementRef;
    @Input() public value: number[] = [];
    @Input() public height = 200;
    @Input() public width = 0;
    public fill = 'red';
    private kind = SpectrumType.Columnar;
    private ctx: CanvasRenderingContext2D;
    private hatItems: IHatItem[] = [];

    private space = 2;
    private columnWidth = 10;
    private hatSpeed = .1;
    private rate = .5;
    private rectHeight = 0;

    constructor() {
    }

    public get boxStyle() {
        const style: any = {
            height: this.height + 'px',
        };
        if (this.width) {
            style.width = this.width + 'px';
        }
        return style;
    }

    get drawer(): HTMLCanvasElement {
        return this.drawerElement.nativeElement as HTMLCanvasElement;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.value) {
            this.drawColumns(this.value);
        } else if (changes.width || changes.height) {
            this.drawer.width = this.width;
            this.drawer.height = this.height;
            this.drawColumns(this.value);
        }
    }

    ngAfterViewInit() {
        this.drawer.width = this.width;
        this.drawer.height = this.height;
        this.ctx = this.drawer.getContext('2d');
    }

    private drawColumns(items: number[]) {
        if (!this.ctx) {
            return;
        }
        this.onRender(this.ctx);
    }

    private onRender(drawingContext: CanvasRenderingContext2D)
    {
        drawingContext.clearRect(0, 0, this.width, this.height);
        if (this.width < this.columnWidth || this.height < this.columnWidth)
        {
            return;
        }
        switch (this.kind)
        {
            case SpectrumType.Columnar:
                this.renderColumnar(drawingContext);
                break;
            case SpectrumType.SymmetryColumnar:
                this.renderSymmetryColumnar(drawingContext);
                break;
            case SpectrumType.InverseColumnar:
                this.renderInverseColumnar(drawingContext);
                break;
            case SpectrumType.Ring:
                this.renderRing(drawingContext);
                break;
            case SpectrumType.RingLine:
                this.renderRingLine(drawingContext, true);
                break;
            case SpectrumType.SymmetryRing:
                this.renderSymmetryRing(drawingContext);
                break;
            case SpectrumType.Polyline:
                this.renderPolyline(drawingContext);
                break;
            case SpectrumType.PolylineRing:
                this.renderPolylineRing(drawingContext);
                break;
            case SpectrumType.InversePolyline:
                this.renderInversePolyline(drawingContext);
                break;
            case SpectrumType.InversePolylineRing:
                this.renderInversePolylineRing(drawingContext);
                break;
            default:
                break;
        }
    }

    private renderEach(drawingContext: CanvasRenderingContext2D, 
        dataBegin: number, count: number, rate: number, maxHeight: number, func: RenderSpectumFunc)
    {
        const pen = this.fill;
        const outerWidth = this.columnWidth + this.space;
        let dataIndex = dataBegin;
        const y = maxHeight;
        const preRectHeight = maxHeight / 300;
        for (let i = 0; i < count; i++)
        {
            func(drawingContext, pen, 
                i, outerWidth * i, y,
                this.columnWidth,
                dataIndex >= 0 && dataIndex < this.value.length ?
                Math.min(this.value[dataIndex] * preRectHeight * rate, maxHeight) : 0);
            dataIndex++;
        }
    }

    private renderColumnar(drawingContext: CanvasRenderingContext2D) {
        this.renderEach2(drawingContext, this.renderColumnarHat.bind(this));
    }


    private renderPolyline(drawingContext: CanvasRenderingContext2D) {
        let lastPoint: IPoint = {x: 0, y: this.height};
        const pen = this.fill;
        this.renderEach2(drawingContext, (d, _, x, y, w, h, __) =>
        {
            const point: IPoint = {x: x + w / 2, y: y - h};
            this.drawLine(d, pen, lastPoint, point);
            lastPoint = point;
        });
        if (lastPoint.x == 0 || pen == null)
        {
            return;
        }
        this.drawLine(drawingContext, pen, lastPoint, {
            x: lastPoint.x + this.columnWidth / 2,
            y: this.height
        });
    }

    private renderEach2(drawingContext: CanvasRenderingContext2D,
        func: RenderSpectumHatFunc)
    {
        this.renderEach3(drawingContext, false, func);
    }

    private renderEach3(drawingContext: CanvasRenderingContext2D,
        isSymmetry: boolean,
        func: RenderSpectumHatFunc)
    {
        const outerWidth = this.columnWidth + this.space;
        const maxWidth = isSymmetry ? this.width / 2 : this.width;
        const leftX = isSymmetry ? maxWidth - this.space / 2 : 0;
        const rightX = isSymmetry ? maxWidth + this.space / 2 : 0;
        this.renderEach(drawingContext, 0,
            Math.floor(maxWidth / outerWidth),
            this.rate * 2, this.height, (d,p,i,x,y,w,h) =>
            {
                const hat = this.getHat(i, h);
                func(d, p, x + rightX, y, w, h, hat);
                if (isSymmetry)
                {
                    func(d, p, leftX - x, y, w, h, hat);
                }
            });
    }

    private renderInversePolyline(drawingContext: CanvasRenderingContext2D)
    {
        const outerWidth = this.columnWidth + this.space;
        const centerX = this.width / 2;
        const leftX = centerX - this.space / 2;
        const rightX = centerX + this.space / 2;
        let lastX = -this.space/2;
        let lastY = this.height;
        const pen = this.fill;
        let j = -1;
        this.renderEach(drawingContext, 0,
            Math.floor(centerX / outerWidth),
            this.rate, this.height, (d, _, i, x, y, w, h) =>
            {
                j++;
                var top = y - h;
                if (j < 1)
                {
                    lastY = Math.min(top + 3, lastY);
                }
                this.drawLine(d, pen, 
                    {x: lastX + rightX, y: lastY}, 
                    {
                        x: x + rightX, y: top
                    });
                this.drawLine(d, pen,
                    {
                        x: leftX - lastX, y: lastY
                    },
                    {x: leftX - x, y: top});
                lastX = x;
                lastY = top;
            });
    }

    private renderInverseColumnar(drawingContext: CanvasRenderingContext2D)
    {
        this.renderEach3(drawingContext, true, this.renderColumnarHat.bind(this));
    }

    private renderColumnar2(drawingContext: CanvasRenderingContext2D, pen: string, index: number,
        x: number, y: number, height: number)
    {
        this.renderColumnar3(drawingContext, pen, index, x, y, height, true);
    }

    private renderColumnar3(drawingContext: CanvasRenderingContext2D, pen: string, index: number,
        x: number, y: number, height: number, hasHat: boolean)
    {
        this.renderColumnar4(drawingContext, pen, x, y, height, hasHat ? this.getHat(index, height) : null);
    }

    private renderColumnarHat(drawingContext: CanvasRenderingContext2D, pen: string,
        x: number, y: number, width: number, height: number, hat?: IHatItem)
    {
        const rectHeight = this.rectHeight > 0 ? this.rectHeight : height;
        if (height > 0)
        {
            let bottom = .0;
            while (bottom < height)
            {
                var h = Math.min(rectHeight, height - bottom);
                this.drawRectangle(drawingContext, pen
                , x, y - bottom - h, width, h);
                bottom += rectHeight + this.space;
            }
        }
        else if (!hat)
        {
            this.drawRectangle(drawingContext, pen
                , x, y - 2, width, 2);
        }
        if (!hat)
        {
            return;
        }
        var hatHeight = this.rectHeight > 0 ? this.rectHeight : this.space;
        var hatY = y - hat.current - hatHeight;
        if (hat.current > 0)
        {
            hatY -= this.space;
        }
        this.drawRectangle(drawingContext, 
            pen, x, hatY, width, hatHeight);
    }

    private renderColumnar4(drawingContext: CanvasRenderingContext2D, pen: string,
        x: number, y: number, height: number, hat: IHatItem)
    {
        this.renderColumnarHat(drawingContext, pen, x, y, this.columnWidth, height, hat);
    }


    private getHat(index: number, height: number): IHatItem
    {
        let item: IHatItem;
        if (this.hatItems.length <= index)
        {
            item = {current: height, target: height, speed: 0};
            this.hatItems.push(item);
            return item;
        }
        item = this.hatItems[index];
        if (item.current < height || item.current == item.target)
        {
            item.speed = this.hatSpeed;
        } else
        {
            item.speed += this.hatSpeed;
        }
        if (item.target < height || item.current == item.target)
        {
            item.target = height;
        }
        if (item.target > item.current)
        {
            item.current = Math.min(item.current + item.speed, item.target);
        } else if (item.target < item.current)
        {
            item.current = Math.max(item.current - item.speed, item.target);
        }
        if (item.current < height)
        {
            item.current = height;
        }
        return item;
    }


    private renderRing(drawingContext: CanvasRenderingContext2D)
    {
        this.renderColumnarRingEach(drawingContext, false, this.renderColumnarHat);
    }

    private renderRing2(drawingContext: CanvasRenderingContext2D, radiusRate: number,
        maxAngle: number, perimeterRate: number,
        func: RenderSpectumRingFunc)
    {
        this.renderRing3(drawingContext, radiusRate, maxAngle, perimeterRate, true, func);
    }

    private renderRing3(drawingContext: CanvasRenderingContext2D, radiusRate: number,
        maxAngle: number, perimeterRate: number, hasCircle: boolean, 
        func: RenderSpectumRingFunc)
    {
        const outerWidth = this.columnWidth + this.space;
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(centerX, centerY) * radiusRate;
        const columnCount = Math.min(Math.max(this.value.length, 10), 
            Math.floor(Math.PI * radius * 2 * perimeterRate / outerWidth));
        const preAngle = maxAngle / columnCount;
        if (this.value.length < 1)
        {
            return;
        }
        if (hasCircle)
        {
            this.drawEllipse(drawingContext, '',
                            this.fill, centerX, centerY, radius);
        }
        const y = centerY - radius;
        const x = centerX - this.columnWidth / 2;
        this.renderEach(drawingContext, 0, columnCount, this.rate, y, (d, p, i, _, __, ___, h) =>
        {
            func(d, p, i, x, y, this.columnWidth, h, i * preAngle, centerX, centerY, radius);
        });
    }



    private renderSymmetryColumnar(drawingContext: CanvasRenderingContext2D)
    {
        const outerWidth = this.columnWidth + this.space;
        this.renderEach(drawingContext, 0,
            Math.floor(this.width / outerWidth),
            this.rate, this.height / 2, this.renderSymmetryColumnar2.bind(this));
    }

    private renderSymmetryColumnar2(drawingContext: CanvasRenderingContext2D, pen: string, index: number,
       x: number, y: number, width: number, height: number)
    {
        if (height < 2)
        {
            height = 1;
        }
        this.drawRectangle(drawingContext, pen
            , x, y - height, width, 2 * height);
    }

    private renderColumnarRingEach(drawingContext: CanvasRenderingContext2D, isSymmetry: boolean,
        func: RenderSpectumHatFunc)
    {
        this.renderRing2(drawingContext, .6, isSymmetry ? 180.0 : 360.0, isSymmetry ? .5 : 1, 
            (d, p, i, x, y, w, h, a, cx, cy, _) =>
        {
            var hat = this.getHat(i, h);
            d.save();
            d.translate(cx, cy);
            d.rotate(a);
            func(d, p, x, y, w, h, hat);
            d.restore();
            if (isSymmetry)
            {
                d.save();
                d.translate(cx, cy);
                d.rotate(-a);
                func(d, p, x, y, w, h, hat);
                d.restore();
            }
        });
    }

    private renderRingEach(drawingContext: CanvasRenderingContext2D, isSymmetry: boolean,
        func: RenderSpectumRingPointFunc)
    {
        this.renderRing3(drawingContext, .6, isSymmetry ? 180.0 : 360.0, 
            isSymmetry ? .5 : 1, false, (d, p, i, _, __, w, h, a, cx, cy, radius) =>
        {
            var len = radius + h;
            var angle = this.toDeg(a);
            var x = cx + Math.sin(angle) * len;
            var y = cy - Math.cos(angle) * len;
            func(d, p, x, y);

            if (isSymmetry)
            {
                func(d, p, cx * 2 - x , y);
            }
        });
    }

    private renderRingLine(drawingContext: CanvasRenderingContext2D, isSymmetry: boolean)
    {
        const pen = this.fill;
        this.renderRing3(drawingContext, .6, isSymmetry ? 180.0 : 360.0,
            isSymmetry ? .5 : 1, false, (d, _, i, __, ____, w, h, a, cx, cy, radius) =>
            {
                var len = radius + h;
                var angle = this.toDeg(a);
                var x = cx + Math.sin(angle) * len;
                var y = cy - Math.cos(angle) * len;
                len = radius - h;
                var x2 = cx + Math.sin(angle) * len;
                var y2 = cy - Math.cos(angle) * len;
                if (x2 == x && y2 == y)
                {
                    return;
                }
                this.drawLine(d, pen, {x, y}, {x: x2, y: y2});
                if (isSymmetry)
                {
                    this.drawLine(d, pen, {x: cx * 2 - x, y}, {x: cx * 2 - x2, y: y2});
                }
            });
    }

    private renderSymmetryRing(drawingContext: CanvasRenderingContext2D)
    {
        this.renderColumnarRingEach(drawingContext, true, this.renderColumnarHat);
    }

    private renderPolylineRing(drawingContext: CanvasRenderingContext2D)
    {
        let i = -1;
        let first = {x: 0, y: 0};
        let last = {x: 0, y: 0};
        const pen = this.fill;
        this.renderRingEach(drawingContext, false, (d, _, x, y) =>
        {
            i++;
            var point = {x, y};
            if (i < 1)
            {
                last = first = point;
                return;
            }
            this.drawLine(d, pen, last, point);
            last = point;
        });
        if (pen == null)
        {
            return;
        }
        this.drawLine(drawingContext, pen, last, first);
    }

    private renderInversePolylineRing(drawingContext: CanvasRenderingContext2D)
    {
        let i = -1;
        let last1 = {x: 0, y: 0};
        let last2 = {x: 0, y: 0};
        const pen = this.fill;
        this.renderRingEach(drawingContext, true, (d, _, x, y) =>
        {
            i++;
            var point = {x, y};
            if (i == 0)
            {
                last1 = point;
                return;
            }
            if (i == 1)
            {
                last2 = point;
                this.drawLine(d, pen, last1, point);
                return;
            }
            if (i % 2 == 0)
            {
                this.drawLine(d, pen, last1, point);
                last1 = point;
                return;
            }
            this.drawLine(d, pen, last2, point);
            last2 = point;
        });
        this.drawLine(drawingContext, pen, last1, last2);
    }

    private drawEllipse(ctx: CanvasRenderingContext2D, fill: string, pen: string, x: number, y: number, radius: number) {
        if (fill) {
            ctx.fillStyle = this.fill;
        }
        ctx.strokeStyle = pen;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.closePath();

    }

    private drawRectangle(ctx: CanvasRenderingContext2D, fill: string, x: number, y: number, width: number, height: number) {
        ctx.fillStyle = this.fill;
        ctx.fillRect(x, y, width, height);
    }

    private drawLine(ctx: CanvasRenderingContext2D, color: string, start: IPoint, end: IPoint, width = 1) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    private toDeg(a: number) {
        return a * Math.PI / 180;
    }
}
