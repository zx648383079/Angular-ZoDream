import { Component, ViewEncapsulation, effect, inject, input, signal, untracked } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    selector: 'app-bot-rich-block',
    template: `
    <div [innerHTML]="formated()"></div>
    `,
    styleUrls: ['./bot-rich-block.component.scss'],
    host: {
        class: 'style-rich-media',
    }
})
export class BotRichBlockComponent {
    private readonly sanitizer = inject(DomSanitizer);


    public readonly value = input('');
    public readonly formated = signal<SafeHtml|null>(null);

    constructor() {
        effect(() => {
            const val = this.value();
            untracked(() => {
                this.formated.set(this.sanitizer.bypassSecurityTrustHtml(
                    val  
                ));
            });
            
        });
    }
}
