import { Component, computed, inject, signal } from '@angular/core';
import { DialogPackage } from '../dialog.injector';
import { DialogPromptOption } from '../model';
import { DialogService } from '../dialog.service';
import { emptyValidate } from '../../../theme/validators';

@Component({
    standalone: false,
    selector: 'app-dialog-prompt',
    templateUrl: './dialog-prompt.component.html',
    styleUrls: ['./dialog-prompt.component.scss']
})
export class DialogPromptComponent {
    private readonly data = inject<DialogPackage<DialogPromptOption>>(DialogPackage);
    private readonly service = inject(DialogService);


    public readonly placeholder = signal('');

    public readonly content = signal('');

    public readonly title = signal('');
    public readonly confirmText = signal('');
    public readonly cancelText = signal('');
    public readonly visible = signal(true);

    private readonly required = signal(true);

    public readonly valid = computed(() => {
        return !this.required() || !emptyValidate(this.content());
    });

    constructor() {
        const data = this.data;
        const option = data.data;
        this.title.set(option.title || $localize `Content`);
        this.placeholder.set(option.placeholder || $localize `Please input the content`);
        this.content.set(option.content || '');
        this.required.set(option.required === false);
        this.confirmText.set(option.confirmText || $localize `Ok`);
        this.cancelText.set(option.cancelText || $localize `Cancel`);
    }

    public close(result?: boolean) {
        if (result && !this.valid()) {
            return;
        }
        this.visible.set(false);
        const option = this.data.data;
        if (result) {
            option.onConfirm && option.onConfirm(this.content());
        } else {
            option.onCancel && option.onCancel();
        }
    }

    public animationDone() {
        if (this.visible()) {
            return;
        }
        this.service.remove(this.data.dialogId);
    }

    public onValueChange(e: Event) {
        this.content.set((e.target as HTMLTextAreaElement).value);
    }
}
