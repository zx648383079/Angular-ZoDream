import { ApplicationRef, ComponentRef, Directive, ElementRef, Injector, Input, NgZone, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { DialogPopupComponent } from './popup/dialog-popup.component';
import { IPoint } from '../../theme/utils/canvas';
import { css } from '../../theme/utils/doc';

@Directive({
    standalone: false,
    selector: '[appPopup]'
})
export class PopupDirective implements OnInit {

    @Input() public placement = 'left';
    @Input() public appPopup: TemplateRef<any>|string;

    private popupRef: ComponentRef<DialogPopupComponent>;

    constructor(
        private elementRef: ElementRef<HTMLDivElement>,
        private renderer: Renderer2,
        private injector: Injector,
        private viewContainerRef: ViewContainerRef,
        private applicationRef: ApplicationRef,
        private zoon: NgZone
    ) {

    }

    ngOnInit(): void {
        const ele = this.elementRef.nativeElement;
        this.renderer.listen(ele, 'click', () => {
            this.toggle();
        });
    }

    public toggle() {
        if (this.popupRef) {
            this.close();
            return;
        }
        this.open();
    }

    public open() {
        if (this.popupRef) {
            return;
        }
        this.popupRef = this.viewContainerRef.createComponent(DialogPopupComponent, {
            injector: this.injector,
            projectableNodes: this.createBodyNode()
        });
        this.popupRef.setInput('placement', this.placement);
        this.popupRef.changeDetectorRef.detectChanges();
        this.zoon.runOutsideAngular(() => {
            const ele = this.popupRef.location.nativeElement as HTMLDivElement;
            if (!ele) {
                return;
            }
            const offset = this.getPosition(ele);
            css(ele, {
                transform: `translate3d(${offset.x}px, ${offset.y}px, 0px)`
            });
            this.renderer.listen(ele, 'click', () => {
                this.close();
            });
        });
    }

    public close() {
        this.popupRef?.destroy();
        this.popupRef = undefined;
    }

    private createBodyNode(): Node[][] {
        const content = this.appPopup;
        if (!content) {
            return [];
        }
        if (content instanceof TemplateRef) {
            const viewRef = content.createEmbeddedView(undefined);
            this.applicationRef.attachView(viewRef);
            return [viewRef.rootNodes];
        }
        return [[this.renderer.createText(`${content}`)]];
    }

    private getPosition(ele: HTMLDivElement): IPoint {
        const offset = 8;
        const target = this.elementRef.nativeElement;
        switch (this.placement) {
            case 'top':
                return {
                    x: (target.clientWidth - ele.clientWidth) / 2,
                    y: - target.clientHeight - ele.clientHeight - offset,
                };
            case 'bottom':
                return {
                    x: (target.clientWidth - ele.clientWidth) / 2,
                    y: offset,
                };
            case 'right':
                return {
                    x: target.clientWidth + offset,
                    y: (-target.clientHeight - ele.clientHeight) / 2,
                };
            case 'left':
            default:
                return {
                    x: - ele.clientWidth - offset,
                    y: (-target.clientHeight - ele.clientHeight) / 2,
                };
        }
    }
}
