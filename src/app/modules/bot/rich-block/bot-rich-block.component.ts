import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
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
export class BotRichBlockComponent implements OnChanges {

    @Input() public value = '';
    public formated: SafeHtml;

    constructor(
        private sanitizer: DomSanitizer,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.formated = this.sanitizer.bypassSecurityTrustHtml(
                this.value
            );
        }
    }

}
