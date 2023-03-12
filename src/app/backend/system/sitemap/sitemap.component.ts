import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SystemService } from '../system.service';
import { ButtonEvent } from '../../../components/form';

@Component({
    selector: 'app-sitemap',
    templateUrl: './sitemap.component.html',
    styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {

    @ViewChild('cmd', {static: false}) 
    private box: ElementRef<HTMLDivElement>;

    public items: any[] = [];

    constructor(
        private service: SystemService,) { }

    ngOnInit() {
    }

    /**
    * tapMake
    */
    public tapMake(e?: ButtonEvent) {
        e?.enter();
        this.service.sitemap().subscribe({
            next: res => {
                e?.reset();
                this.renderCMD(res.data.map(item => item.url));
            },
            error: _ => {
                e?.reset();
            }
        });
    }

    /**
    * renderCMD
    */
    public renderCMD(lines: any[]) {
        let i = 0;
        const handle = setInterval(() => {
                if (i >= lines.length) {
                    clearInterval(handle);
                } else {
                    this.items.push(lines[i ++]);
                }
                this.box.nativeElement.scrollTop = this.box.nativeElement.scrollHeight;
        }, Math.max(16, Math.floor(Math.min(lines.length * 100, 10000) / lines.length)));
    }

}
