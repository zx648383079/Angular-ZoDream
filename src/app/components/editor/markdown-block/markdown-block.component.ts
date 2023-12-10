import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
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
export class MarkdownBlockComponent implements OnChanges {

    @Input() public value = '';
    @Input() public isFormated = true;
    public formated: SafeHtml;

    constructor(
        private sanitizer: DomSanitizer,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.formated = this.sanitizer.bypassSecurityTrustHtml(
                this.isFormated ? this.value : marked(this.value).toString()
            );
        }
    }
}
