import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

interface ILyricsItem {
    text: string;
    start: number;
    end: number;
    active?: boolean;
    offset?: number;
}

@Component({
  selector: 'app-lyrics-viewer',
  templateUrl: './lyrics-viewer.component.html',
  styleUrls: ['./lyrics-viewer.component.scss']
})
export class LyricsViewerComponent implements OnChanges {

    public items: ILyricsItem[] = [];

    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        
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
            const i = line.indexOf('-');
            let len = 1;
            if (i > 0)
            {
                var e = line.indexOf('>', i);
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
            const [start, end] = timeToQuantum(line.substring(t, c - t));
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