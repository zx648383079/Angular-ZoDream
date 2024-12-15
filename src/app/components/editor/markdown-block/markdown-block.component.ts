import { AfterViewInit, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { toggleClass } from '../../../theme/utils/doc';
import { DialogService } from '../../dialog';

@Component({
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    selector: 'app-markdown-block',
    template: `
    <div [innerHTML]="formated"></div>
    `,
    styleUrls: ['./markdown-block.component.scss'],
    host: {
        class: 'style-markdown',
    }
})
export class MarkdownBlockComponent implements OnChanges, AfterViewInit {

    @Input() public value = '';
    @Input() public isFormated = true;
    public formated: SafeHtml;

    constructor(
        private sanitizer: DomSanitizer,
        private element: ElementRef<HTMLDivElement>,
        private renderer: Renderer2,
        private toastrService: DialogService,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.formated = this.sanitizer.bypassSecurityTrustHtml(
                this.isFormated ? this.value : marked(this.value).toString()
            );
        }
    }

    ngAfterViewInit(): void {
        this.renderer.listen(this.element.nativeElement, 'click', (e: PointerEvent) => {
            if (!(e.target instanceof HTMLElement)) {
                return;
            }
            const isCopy = e.target.classList.contains('icon-copy');
            const isFull = e.target.classList.contains('icon-full-screen');
            if (isCopy || isFull) {
                const box = this.closest(e.target, 'code-container');
                if (!box) {
                    return;
                }
                if (isFull) {
                    toggleClass(box, 'code-full-screen');
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
