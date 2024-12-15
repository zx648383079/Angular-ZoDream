import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-color-layer',
    templateUrl: './color-layer.component.html',
    styleUrls: ['./color-layer.component.scss']
})
export class ColorLayerComponent implements OnChanges {

    @Input() public disabled = false;
    @Input() public value = '';
    public hY = 0;
    public x = 0;
    public y = 0;
    public background = '#fff';
    @Output() public valueChange = new EventEmitter<string>();
    private hsv = [0, 0, 0];

    constructor() { }

    get svStyle() {
        return {left: this.x - 5 + 'px', top: this.y - 5 + 'px'};
    }

    get hStyle() {
        return {top: this.hY - 3 + 'px'};
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.applyColor();
        }
    }

    public tapNotTouch(e: MouseEvent) {
        if (this.disabled) {
            return;
        }
        if ('ontouchstart' in document.documentElement) {
            return;
        }
        const clientX = e.clientX + document.body.scrollLeft;
        const clientY = e.clientY + document.body.scrollTop;
        this.touchMove({
            target: e.target,
            targetTouches: [
                {clientX, clientY}
            ]
        } as any);
        this.triggerChange();
    }

    public tapHNotTouch(e: MouseEvent) {
        if (this.disabled) {
            return;
        }
        if ('ontouchstart' in document.documentElement) {
            return;
        }
        const clientX = e.clientX + document.body.scrollLeft;
        const clientY = e.clientY + document.body.scrollTop;
        this.touchHMove({
            target: e.target,
            targetTouches: [
                {clientX, clientY}
            ]
        } as any);
    }

    public touchStart(e: TouchEvent) {
        if (this.disabled) {
            return;
        }
        this.doColor(e);
    }
    public touchMove(e: TouchEvent) {
        if (this.disabled) {
            return;
        }
        this.doColor(e);
    }
    public touchEnd(e: TouchEvent) {
        if (this.disabled) {
            return;
        }
        this.triggerChange();
    }
    public touchHStart(e: TouchEvent) {
        if (this.disabled) {
            return;
        }
        this.doH(e);
    }
    public touchHMove(e: TouchEvent) {
        if (this.disabled) {
            return;
        }
        this.doH(e);
    }
    private applyColor() {
        this.hsv = this.parse(this.value);
        this.hY = this.clamp(160 - this.hsv[0] * 160, 0, 160);
        this.setBackground(this.hsv[0]);
        this.x = this.clamp(this.hsv[1] * 160, 0, 160);
        this.y = this.clamp(160 - this.hsv[2] * 160, 0, 160);
    }
    private setBackground(off: number) {
        this.hsv[0] = off;
        const b = this.HSV2RGB([off, 1, 1]);
        this.background = 'rgb(' + b.join(',') + ')';
    }
    private triggerChange() {
        this.value = '#' + this.HSV2HEX(this.hsv);
        this.valueChange.emit(this.value);
    }

    private doColor(e: TouchEvent) {
        const offset = (e.target as HTMLDivElement).getBoundingClientRect();
        this.y = this.clamp(e.targetTouches[0].clientY - offset.top, 0, offset.height);
        this.x = this.clamp(e.targetTouches[0].clientX - offset.left, 0, offset.width);
        this.hsv[1] = this.x / offset.width;
        this.hsv[2] = (offset.height - this.y) / offset.height;
        this.triggerChange();
    }
    private doH(e: TouchEvent) {
        const offset = (e.target as HTMLDivElement).getBoundingClientRect();
        this.hY = this.clamp(e.targetTouches[0].clientY - offset.top, 0, offset.height);
        this.setBackground(offset.height - this.hY / offset.height);
        this.triggerChange();
    }
    /**
     * 限制最大最小值
     */
    private clamp(val: number, min: number, max: number): number {
        return val > max ? max : val < min ? min : val;
    }
    private parse(x: any): number[] {
        if (typeof x === 'object') {
            return x;
        }
        const rgb = /\s*rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/i.exec(x);
        const hsv = /\s*hsv\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)\s*$/i.exec(x);
        const hex = x[0] === '#' && x.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
        if (hex) {
            return this.HEX2HSV(x.slice(1));
        } else if (hsv) {
            return this._2HSV_pri([+hsv[1], +hsv[2], +hsv[3]]);
        } else if (rgb) {
            return this.RGB2HSV([+rgb[1], +rgb[2], +rgb[3]]);
        }
        return [0, 1, 1]; // default is red
    }
    // [h, s, v] ... 0 <= h, s, v <= 1
    private HSV2RGB(a: number[]): number[] {
        const h = + a[0];
        const s = + a[1];
        const v = + a[2];
        let r = 0;
        let g = 0;
        let b = 0;
        let i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);
        i = i || 0;
        q = q || 0;
        t = t || 0;
        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
        }
        return [this.round(r * 255), this.round(g * 255), this.round(b * 255)];
    }
    private HSV2HEX(a: number[]): string {
        return this.RGB2HEX(this.HSV2RGB(a));
    }
    // [r, g, b] ... 0 <= r, g, b <= 255
    private RGB2HSV(a: number[]): number[] {
        const r = + a[0];
        const g = + a[1];
        const b = + a[2];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;
        let h = 0;
        const s = (max === 0 ? 0 : d / max);
        const v = max / 255;
        switch (max) {
            case min:
                h = 0;
                break;
            case r:
                h = (g - b) + d * (g < b ? 6 : 0);
                h /= 6 * d;
                break;
            case g:
                h = (b - r) + d * 2;
                h /= 6 * d;
                break;
            case b:
                h = (r - g) + d * 4;
                h /= 6 * d;
                break;
        }
        return [h, s, v];
    }
    private RGB2HEX(a: number[]): string {
        // tslint:disable-next-line: no-bitwise
        let s: string| number = + a[2] | ( + a[1] << 8) | ( + a[0] << 16);
        s = '000000' + s.toString(16);
        return s.slice(-6);
    }
    // rrggbb or rgb
    private HEX2HSV(s: string): number[] {
        return this.RGB2HSV(this.HEX2RGB(s));
    }
    private HEX2RGB(s: string): number[] {
        if (s.length === 3) {
            s = s.replace(/./g, '$&$&');
        }
        return [this.num(s[0] + s[1], 16), this.num(s[2] + s[3], 16), this.num(s[4] + s[5], 16)];
    }
    // convert range from `0` to `360` and `0` to `100` in color into range from `0` to `1`
    private _2HSV_pri(a: number[]): number[] {
        return [+ a[0] / 360, + a[1] / 100, + a[2] / 100];
    }
    // convert range from `0` to `1` into `0` to `360` and `0` to `100` in color
    private _2HSV_pub(a: number[]): number[] {
        return [this.round( + a[0] * 360), this.round( + a[1] * 100), this.round( + a[2] * 100)];
    }
    // convert range from `0` to `255` in color into range from `0` to `1`
    private _2RGB_pri(a: number[]): number[] {
        return [+ a[0] / 255, + a[1] / 255, + a[2] / 255];
    }
    private num(i: any, j = 10) {
        return parseInt(i, j || 10);
    }
    private round(i: number) {
        return Math.round(i);
    }

}
