import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { IBound, IPoint } from '../../utils/canvas';
import { HttpClient } from '@angular/common/http';

interface ICaptcha {
    type?: string;
    image: string;
    width: number;
    height: number;
    imageItems?: IBound[];
    control?: string;
    controlWidth?: number;
    controlHeight?: number;
    controlY?: number;
    count?: number;
}

@Component({
    selector: 'app-captcha',
    templateUrl: './captcha.component.html',
    styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent {

    public visible = false;
    public data: ICaptcha;
    public value: any = '';
    public x = 0;
    public maskItems: IPoint[] = [];
    @Input() public token = '';
    @Output() public submited = new EventEmitter();
    private mouseMoveListeners = {
        move: undefined,
        finish: undefined,
    };

    constructor(
        private http: HttpClient
    ) { }

    @HostListener('document:mousemove', ['$event'])
    private docMouseMove(e: MouseEvent) {
        if (this.mouseMoveListeners.move) {
            this.mouseMoveListeners.move({x: e.clientX, y: e.clientY});
        }
    }

    @HostListener('document:mouseup', ['$event'])
    private docMouseUp(e: MouseEvent) {
        if (this.mouseMoveListeners.finish) {
            this.mouseMoveListeners.finish({x: e.clientX, y: e.clientY});
        }
    }

    public open() {
        this.visible = true;
    }

    public onMoveStart(e: MouseEvent) {
        e.stopPropagation();
        this.x = 0;
        this.onMouseMove(p => {
            this.x = Math.max(p.x - e.clientX, 0);
        }, () => {
            this.submited.emit();
        });
    }

    public onHint(e: MouseEvent) {
        this.maskItems.push({
            x: e.offsetX,
            y: e.offsetY
        });
    }

    public tapRefresh() {
        this.http.get<ICaptcha>('auth/captcha', {params: {
            captcha_token: this.token,
            type: 'hint',
        }}).subscribe(res => {
            if (!res.type) {
                res.type = 'code';
            }
            this.visible = true;
            this.data = res;
        });
    }

    private onMouseMove(move?: (p: IPoint) => void, finish?: (p: IPoint) => void) {
        this.mouseMoveListeners = {
            move,
            finish: !move && !finish ? undefined : (p: IPoint) => {
                this.mouseMoveListeners = {move: undefined, finish: undefined};
                finish && finish(p);
            },
        };
    }

}
