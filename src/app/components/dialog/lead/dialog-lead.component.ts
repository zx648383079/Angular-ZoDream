import { Component, DOCUMENT, HostListener, inject, signal } from '@angular/core';
import { DialogPackage } from '../dialog.injector';
import { DialogLeadTour, DialogLeadTourStep } from '../model';
import { DialogService } from '../dialog.service';
import { scrollTop } from '../../../theme/utils/doc';

@Component({
    standalone: false,
    selector: 'app-dialog-lead-tour',
    template: `
    <div class="lead-overlay-container" [style]="overlayStyle()"></div>
    <div class="dialog-lead-box" [style]="dialogStyle()">
        <div class="dialog-header">
            <div class="dialog-title">{{ title() }}</div>
            <i class="iconfont icon-close dialog-close" (click)="close()"></i>
        </div>
        <div class="dialog-body">
            @if (icon()) {
            <div class="message-icon">
                <i class="iconfont" [class]="icon()"></i>
            </div>
            }
            <div class="message-body">
                {{ content() }}
            </div>
        </div>
        <div class="dialog-footer">
            <div class="btn btn-primary" (click)="previous()">{{ primaryText() }}</div>
            <div class="btn btn-danger" (click)="next()">{{ secondaryText() }}</div>
        </div>
    </div>
    `,
    styles: ['']
})
export class DialogLeadComponent {
    private readonly data = inject<DialogPackage<DialogLeadTour>>(DialogPackage);
    private readonly document = inject<Document>(DOCUMENT);
    private readonly service = inject(DialogService);


    public readonly overlayStyle = signal<any>({});
    public readonly dialogStyle = signal<any>({});
    public readonly title = signal('');
    public readonly content = signal('');
    public readonly icon = signal('');
    public readonly primaryText = signal('');
    public readonly secondaryText = signal('');
    private index = -1;
    private option: DialogLeadTour;

    constructor() {
        this.option = this.data.data;
        this.next();
    }

    @HostListener('window:resize', [])
    @HostListener('window:scoll', [])
    public onResize() {
        const index = this.index;
        if (index < 0) {
            return;
        }
        this.renderStep(this.option.items[index]);
    }

    public get backable() {
        return this.index > 0;
    };

    public get nextable() {
        return this.index < this.option.items.length - 1;
    };

    public next() {
        if (!this.nextable) {
            this.close();
            return;
        }
        this.index ++;
        this.renderStep(this.option.items[this.index]);
    }

    public previous() {
        if (!this.backable) {
            this.close();
            return;
        }
        this.index --;
        this.renderStep(this.option.items[this.index]);
    }

    public close() {
        this.service.remove(this.data.dialogId);
    }

    private renderStep(data: DialogLeadTourStep, level = 0) {
        const target = data.selector instanceof HTMLElement ? data.selector : document.querySelector(data.selector);
        if (!target) {
            this.close();
            return;
        }
        const offset = target.getBoundingClientRect();
        const sTop = scrollTop(this.document);
        
        if (level < 3 && (offset.top < 0 || offset.bottom > window.innerHeight)) {
            this.closeModal();
            scrollTop(sTop + offset.top - window.innerHeight / 2);
            setTimeout(() => {
                this.renderStep(data, level + 1);
            }, 500);
            return;
        }
        this.openModal(offset, data);
    }

    private closeModal() {
        this.overlayStyle.update(v => {
            return {
                ...v,
                height: '0px',
                width: '0px'
            }
        });
        this.dialogStyle.set({
            display: 'none'
        });
    }

    private openModal(offset: DOMRect, data: DialogLeadTourStep) {
        this.overlayStyle.set({
            left: offset.left + 'px',
            top: offset.top + 'px',
            width: offset.width + 'px',
            height: offset.height + 'px',
        });
        const modalHeight = 190;
        const modalWidth = 320;
        this.dialogStyle.set(this.computeModalStyle(offset, modalWidth, modalHeight));
        this.content.set(data.content);
        this.primaryText.set(this.backable ? this.option.backText : this.option.cancelText);
        this.secondaryText.set(this.nextable ? this.option.nextText : this.option.confirmText);
    }

    private computeModalStyle(offset: DOMRect, width: number, height: number): any {
        const bottom = offset.bottom + height + 10;
        if (bottom <= window.innerHeight) {
            return {
                left: offset.left + 'px',
                top: offset.bottom + 10 + 'px'
            };
        }
        const top = offset.top - height - 10;
        if (top >= 0) {
            return {
                left: offset.left + 'px',
                top: top + 'px'
            };
        }
        const right = offset.right + width + 10;
        if (right <= window.innerWidth) {
            return {
                left: offset.right + 10 + 'px',
                top: offset.top + 'px'
            };
        }
        const left = offset.left - width - 10;
        if (left >= 0) {
            return {
                left: left + 'px',
                top: offset.top + 'px'
            };
        }
        return {
            left: (window.innerWidth - width) / 2 + 'px',
            top: (window.innerHeight - height) / 2 + 'px',
        }
    }
}
