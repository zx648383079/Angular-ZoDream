import { Component, effect, input, signal, untracked } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-code-block',
    templateUrl: './code-block.component.html',
    styleUrls: ['./code-block.component.scss']
})
export class CodeBlockComponent {

    public readonly raw = input('');
    public readonly value = input('');
    public readonly src = input('');
    public readonly lang = input('');

    public readonly internalValue = signal('');
    public readonly internalLang = signal('');
    public readonly internalSrc = signal('');
    public readonly lineNo = signal<{
            value: number;
            checked?: boolean;
        }[]>([]);
    public readonly copyTip = signal('');
    public readonly screenMode = signal(0);
    private lockTime = 0;

    constructor() {
        effect(() => {
            const val = this.value();
            untracked(() => {
                this.internalValue.set(val);
                this.createLine(this.computeLine(val));
            });
        });
        effect(() => {
            this.parseRaw(this.raw());
        });
        effect(() => {
            const val = this.src();
            untracked(() => {
                this.internalSrc.set(val);
            });
        });
        effect(() => {
            const val = this.lang();
            untracked(() => {
                this.internalLang.set(val);
            });
        });
    }

    public toggleScreen(to: number) {
        this.screenMode.update(v => {
            return v !== to ? to : 0;
        });
    }

    public tapCopy() {
        navigator.clipboard.writeText(this.value()).then(
            () => {
                this.copyTip.set($localize `Copy successfully`);
            },
            () => {
                this.copyTip.set($localize `Copy failed`);
            }
        );
        if (this.lockTime > 0) {
            window.clearTimeout(this.lockTime);
        }
        this.lockTime = window.setTimeout(() => {
            this.copyTip.set('');
            this.lockTime = 0;
        }, 3000);
    }

    private computeLine(val: string): number {
        return val.split('\n').length;
    }

    private createLine(count: number, begin = 1) {
        const items = [];
        for (let i = 0; i < count; i++) {
            items.push({
                value: begin + i,
            });
        }
        this.lineNo.set(items);
    }

    private parseRaw(text: string) {
        const items = text.split('\n');
        if (items.length < 2) {
            return;
        }
        const begin = 1;
        const end = items.length - (items[items.length - 1].startsWith('```') ? 2 : 1);
        const info = items[0];
        let i = 0;
        while (info.length > i && info[i] === '`') {
            i ++;
        }
        let j = i;
        while (info.length > i && info[j] !== ' ') {
            j ++;
        }
        this.internalLang.set(info.substring(i, j));
        i = info.indexOf('(', j);
        j = info.indexOf('{', j);
        let highlight: number[][] = [];
        let lines: number[] = [];
        if (i > 0 && j > 0) {
            j ++;
            lines = this.parseQuoteLine(this.subBlock(info, j, '}'));
            j = info.indexOf('{', j);
            if (j > 0) {
                highlight = this.subBlock(info, j + 1, '}').split(',').map(this.parseQuoteLine);
            }
            this.internalSrc.set(this.subBlock(info, i + 1, ')'));
        } else if (i > 0 && j < 0) {
            this.internalSrc.set(this.subBlock(info, i + 1, ')'));
        } else if (j > 0) {
            highlight = this.subBlock(info, j + 1, '}').split(',').map(this.parseQuoteLine);
        }
        const lineBegin = lines.length > 0 ? lines[0] : 1;
        j = 0;
        const lineItems = [];
        let sb = '';
        for (i = begin; i <= end; i++) {
            const lineNo = j + lineBegin;
            j ++;
            if (i > begin) {
                sb += '\n';
            }
            sb += items[i];
            lineItems.push({
                value: lineNo,
                checked: this.isInRange(lineNo, highlight)
            });
        }
        this.lineNo.set(lineItems);
        this.internalValue.set(sb);
    }

    private isInRange(index: number, ranges: number[][]): boolean {
        for (const range of ranges) {
            if (range[0] <= index && range[1] >= index) {
                return true;
            }
        }
        return false;
    }

    private subBlock(str: string, begin: number, endTag: string) {
        const j = str.indexOf(endTag, begin);
        if (j < 0) {
            return '';
        }
        return str.substring(begin, j);
    }

    private parseQuoteLine(block: string): number[] {
        const res = block.split('-').map(parseInt);
        if (res[0] < 1) {
            res[0] = 1;
        }
        if (res.length == 1) {
            res.push(res[0]);
        } else if (res[1] < res[0]) {
            res[1] = res[0];
        }
        return res;
    }
}
