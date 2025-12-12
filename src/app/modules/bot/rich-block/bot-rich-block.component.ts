import { Component, ViewEncapsulation, effect, inject, input } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    selector: 'app-bot-rich-block',
    template: `
    <div [innerHTML]="formated"></div>
    `,
    styleUrls: ['./bot-rich-block.component.scss'],
    host: {
        class: 'style-rich-media',
    }
})
export class BotRichBlockComponent {
    private sanitizer = inject(DomSanitizer);


    public readonly value = input('');
    public formated: SafeHtml;

    constructor() {
        effect(() => {
            this.formated = this.sanitizer.bypassSecurityTrustHtml(
                this.value()
            );
        });
    }
}
