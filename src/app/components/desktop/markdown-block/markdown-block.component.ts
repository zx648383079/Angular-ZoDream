import { AfterViewInit, Component, ElementRef, Renderer2, ViewEncapsulation, effect, inject, input, viewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { toggleClass } from '../../../theme/utils/doc';
import { DialogService } from '../../dialog';
import { ImagePlayerComponent } from '../../media-player';

@Component({
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    selector: 'app-markdown-block',
    template: `
    <div [innerHTML]="formated"></div>
    <app-image-player [isFixed]="true" />
    `,
    styleUrls: ['./markdown-block.component.scss'],
    host: {
        class: 'style-markdown',
    }
})
export class MarkdownBlockComponent implements AfterViewInit {
    private readonly sanitizer = inject(DomSanitizer);
    private element = inject<ElementRef<HTMLDivElement>>(ElementRef);
    private readonly renderer = inject(Renderer2);
    private readonly toastrService = inject(DialogService);


    private readonly player = viewChild(ImagePlayerComponent);
    public readonly value = input('');
    public readonly isFormated = input(true);
    public formated: SafeHtml;

    constructor() {
        effect(() => {
            this.formated = this.sanitizer.bypassSecurityTrustHtml(
                this.isFormated() ? this.value() : marked(this.value()).toString()
            );
        });
    }

    ngAfterViewInit(): void {
        this.renderer.listen(this.element.nativeElement, 'click', (e: PointerEvent) => {
            if (!(e.target instanceof HTMLElement)) {
                return;
            }
            if (e.target instanceof HTMLImageElement) {
                const ctl = this.player();
                ctl.visible.set(true);
                ctl.play({
                    name: e.target.title,
                    source: e.target.src
                });
                return;
            }
            
            const isCopy = e.target.classList.contains('icon-copy');
            const isFull = e.target.classList.contains('icon-full-screen');
            const isMini = e.target.classList.contains('icon-minimize');
            if (isCopy || isFull || isMini) {
                const box = this.closest(e.target, 'code-container');
                if (!box) {
                    return;
                }
                if (isMini) {
                    toggleClass(box, '--with-minimize');
                    return;
                }
                if (isFull) {
                    toggleClass(box, '--with-full-screen');
                    return;
                }
                const items = box.getElementsByTagName('code');
                if (items.length === 0) {
                    return;
                }
                navigator.clipboard.writeText(items[0].innerText).then(
                    () => {
                        this.toastrService.success($localize `Copy successfully`);
                    },
                    () => {
                        this.toastrService.warning($localize `Copy failed`);
                    }
                );
            }
        });
    }

    private closest(ele: HTMLElement, cls: string): HTMLElement|undefined {
        while (ele) {
            ele = this.renderer.parentNode(ele);
            if (ele.classList.contains(cls)) {
                return ele;
            }
        }
    }
}
