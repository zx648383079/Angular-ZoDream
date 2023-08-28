import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-wechat-rich-block',
    template: `
    <div [innerHTML]="formated"></div>
    `,
    styleUrls: ['./wechat-rich-block.component.scss'],
    host: {
        class: 'style-rich-media',
    }
})
export class WechatRichBlockComponent implements OnChanges {

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
