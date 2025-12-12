import { Component, effect, input } from '@angular/core';

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

    public internalValue = '';
    public internalLang = '';
    public internalSrc = '';
    public lineNo: {
        value: number;
        checked?: boolean;
    }[] = [];
    public copyTip = '';
    public screenMode = 0;
    private lockTime = 0;

    constructor() {
        effect(() => {
            this.internalValue = this.value();
            this.createLine(this.computeLine(this.value()));
        });
        effect(() => {
            this.parseRaw(this.raw());
        });
        effect(() => {
            this.internalSrc = this.src();
        });
        effect(() => {
            this.internalLang = this.lang();
        });
    }

    public toggleScreen(to: number) {
        this.screenMode = this.screenMode !== to ? to : 0;
    }

    public tapCopy() {
        navigator.clipboard.writeText(this.value()).then(
            () => {
                this.copyTip = $localize `Copy successfully`;
            },
            () => {
                this.copyTip = $localize `Copy failed`;
            }
        );
        if (this.lockTime > 0) {
            window.clearTimeout(this.lockTime);
        }
        this.lockTime = window.setTimeout(() => {
            this.copyTip = '';
            this.lockTime = 0;
        }, 3000);
    }

    private computeLine(val: string): number {
        return val.split('\n').length;
    }

    private createLine(count: number, begin = 1) {
        this.lineNo = [];
        for (let i = 0; i < count; i++) {
            this.lineNo.push({
                value: begin + i,
            });
        }
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
        this.internalLang = info.substring(i, j);
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
            this.internalSrc = this.subBlock(info, i + 1, ')');
        } else if (i > 0 && j < 0) {
            this.internalSrc = this.subBlock(info, i + 1, ')');
        } else if (j > 0) {
            highlight = this.subBlock(info, j + 1, '}').split(',').map(this.parseQuoteLine);
        }
        const lineBegin = lines.length > 0 ? lines[0] : 1;
        j = 0;
        this.lineNo = [];
        this.internalValue = '';
        for (i = begin; i <= end; i++) {
            const lineNo = j + lineBegin;
            j ++;
            if (i > begin) {
                this.internalValue += '\n';
            }
            this.internalValue += items[i];
            this.lineNo.push({
                value: lineNo,
                checked: this.isInRange(lineNo, highlight)
            });
        }
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
