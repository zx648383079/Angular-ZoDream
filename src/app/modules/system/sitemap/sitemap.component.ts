import { Component, ElementRef, inject, viewChild, signal } from '@angular/core';
import { SystemService } from '../system.service';
import { ButtonEvent } from '../../../components/form';
import { interval } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-sitemap',
    templateUrl: './sitemap.component.html',
    styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent {
    private readonly service = inject(SystemService);


    private readonly box = viewChild<ElementRef<HTMLDivElement>>('cmd');

    public readonly items = signal<any[]>([]);
    /**
    * tapMake
    */
    public tapMake(e?: ButtonEvent) {
        this.items.set([]);
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
        const handle = interval(Math.max(16, Math.floor(Math.min(lines.length * 100, 10000) / lines.length)))
        .subscribe(() => {
            if (i >= lines.length) {
                handle.unsubscribe();
            } else {
                this.items.update(v => {
                    v.push(lines[i ++]);
                    return v;
                });
            }
            this.box().nativeElement.scrollTop = this.box().nativeElement.scrollHeight;
        });
    }

}
