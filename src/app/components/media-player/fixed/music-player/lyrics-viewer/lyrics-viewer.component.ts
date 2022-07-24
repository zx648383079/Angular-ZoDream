import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnChanges, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';

interface ILyricsItem {
    text: string;
    start: number;
    end: number;
    active?: boolean;
    offset?: number;
    style?: any;
}

@Component({
  selector: 'app-lyrics-viewer',
  templateUrl: './lyrics-viewer.component.html',
  styleUrls: ['./lyrics-viewer.component.scss']
})
export class LyricsViewerComponent implements OnChanges {

    @ViewChild('scoller')
    private scroller: ElementRef<HTMLDivElement>;
    @ViewChildren('innerItem')
    private innerItems: QueryList<ElementRef<HTMLDivElement>>;
    public items: ILyricsItem[] = [];
    @Input() public value = '';
    @Input() public height = 200;
    @Input() public width = 0;
    @Input() public src = '';
    @Input() public duration = 0;
    @Input() public currentTime = 0;
    private valueSrc = '';

    constructor(
        private http: HttpClient
    ) {
    }

    public get boxStyle() {
        const style: any = {
            height: this.height + 'px',
        };
        if (this.width) {
            style.width = this.width + 'px';
        }
        return style;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.value) {
            this.valueSrc = '';
            this.items = this.format(this.value, this.duration);
        }
        if (changes.src && changes.src.currentValue && this.valueSrc !== changes.src.currentValue) {
            this.http.get(changes.src.currentValue, {
                responseType: 'text'
            }).subscribe({
                next: res => {
                    this.valueSrc = changes.src.currentValue;
                    this.value = res;
                    this.items = this.format(this.value, this.duration);
                },
                error: err => {
                    // TODO
                }
            });
        }
        if (changes.currentTime) {
            this.refreshItems();
        }
    }

    private refreshItems() {
        let activeIndex = 0;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (!item.text) {
                continue;
            }
            item.active = this.isActive(item, this.currentTime);
            item.offset = this.formatOffset(item, this.currentTime);
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
        if (this.scroller && this.scroller.nativeElement) {
            const ele = this.innerItems.get(activeIndex);
            if (ele && ele.nativeElement) {
                this.scroller.nativeElement.scrollTo({
                    top: ele.nativeElement.offsetTop - this.scroller.nativeElement.offsetTop - this.height / 2,
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
