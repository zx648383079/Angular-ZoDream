import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, effect, inject, input, model, signal, viewChild, viewChildren } from '@angular/core';

interface ILyricsItem {
    text: string;
    start: number;
    end: number;
    active?: boolean;
    offset?: number;
    style?: any;
}

@Component({
    standalone: false,
    selector: 'app-lyrics-viewer',
    templateUrl: './lyrics-viewer.component.html',
    styleUrls: ['./lyrics-viewer.component.scss']
})
export class LyricsViewerComponent {
    private readonly http = inject(HttpClient);


    private readonly scroller = viewChild<ElementRef<HTMLDivElement>>('scoller');
    private readonly innerItems = viewChildren<ElementRef<HTMLDivElement>>('innerItem');
    public readonly items = signal<ILyricsItem[]>([]);
    public readonly value = model('');
    public readonly height = input(200);
    public readonly width = input(0);
    public readonly src = input('');
    public readonly duration = input(0);
    public readonly currentTime = input(0);
    private valueSrc = '';

    constructor() {
        effect(() => {
            this.valueSrc = '';
            this.items.set(this.format(this.value(), this.duration()));
        });
        effect(() => {
            this.currentTime();
            this.refreshItems();
        });
        effect(() => {
            const src = this.src();
            this.http.get(src, {
                responseType: 'text'
            }).subscribe({
                next: res => {
                    this.valueSrc = src;
                    this.value.set(res);
                    this.items.set(this.format(this.value(), this.duration()));
                },
                error: err => {
                    // TODO
                }
            });
        });
    }

    public get boxStyle() {
        const style: any = {
            height: this.height() + 'px',
        };
        const width = this.width();
        if (width) {
            style.width = width + 'px';
        }
        return style;
    }

    private refreshItems() {
        let activeIndex = 0;
        for (let i = 0; i < this.items().length; i++) {
            const item = this.items[i];
            if (!item.text) {
                continue;
            }
            item.active = this.isActive(item, this.currentTime());
            item.offset = this.formatOffset(item, this.currentTime());
            if (item.active) {
                activeIndex = i;
            }
            // item.style = item.offset > 0 ? {
            //     'background-image': 'linear-gradient(to right, red, #fff ' + (item.offset * 100) +'%)',
            //     'background-clip': 'text',
            //     '-webkit-background-clip': 'text',
            //     'color': 'transparent',
            // } : {};
        }
        const scroller = this.scroller();
        if (scroller && scroller.nativeElement) {
            const ele = this.innerItems().at(activeIndex);
            if (ele && ele.nativeElement) {
                scroller.nativeElement.scrollTo({
                    top: ele.nativeElement.offsetTop - scroller.nativeElement.offsetTop - this.height() / 2,
                    behavior: 'smooth',
                });
            }
        }
    }

    private formatOffset(item: ILyricsItem, time: number): number {
        if (time <= item.start || time >= item.end) {
            return 0;
        }
        return (time - item.start) / (item.end - item.start);
    }

    private isActive(item: ILyricsItem, time: number): boolean {
        if (time < item.start) {
            return false;
        }
        if (item.end === 0) {
            return true;
        }
        return time < item.end;
    }

    private format(content: string, duration = 0): ILyricsItem[] {
        if (!content) {
            return [];
        }
        const timeToDouble = (time: string) => {
            const args = time.split(':');
            let count = 0;
            args.forEach((v, i) => {
                count += parseFloat(args[i]) * Math.pow(60, args.length - i - 1);
            });
            return count;
        };
        const timeToQuantum = (line: string, end = 0) => {
            const i = line.indexOf(',');
            let len = 1;
            if (i > 0)
            {
                const e = line.indexOf('>', i);
                if (e > 0)
                {
                    len = e - i;
                }
            }
            if (i < 0)
            {
                return [timeToDouble(line), end];
            }
            return [timeToDouble(line.substring(0, i)), timeToDouble(line.substring(i + len))];
        };
        const items: ILyricsItem[] = [];
        content.split('\n').forEach(line => {
            if (line.trim().length < 0) {
                items.push({text: '', start: 0, end: 0});
                return;
            }
            let t = line.indexOf('[');
            const c = line.indexOf(']', t);
            if (t < 0 || c < 0) {
                items.push({text: line, start: 0, end: 0});
                return;
            }
            t ++;
            const [start, end] = timeToQuantum(line.substring(t, c));
            items.push({text: line.substring(c + 1).trim(), start, end});
        });
        return items.map((item, i) => {
            if (item.end > 0) {
                return item;
            }
            item.end = i < items.length - 1 ? items[i + 1].start : duration;
            return item;
        });
    }

}
