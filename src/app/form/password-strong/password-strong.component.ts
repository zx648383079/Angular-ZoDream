import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { emptyValidate } from '../../theme/validators';

interface IRatingItem {
    check: RegExp | ((value: string) => number);
    score?: number;
}

@Component({
  selector: 'app-password-strong',
  templateUrl: './password-strong.component.html',
  styleUrls: ['./password-strong.component.scss']
})
export class PasswordStrongComponent implements OnChanges {

    @Input() public value = '';

    public score = 0;

    private ratingItems: IRatingItem[] = [
        {
            check: value => {
                if (value.length > 20) {
                    return 3;
                }
                return value.length > 6 ? 2 : 0
            },
        },
        {
            check: /[a-z]/,
            score: 2,
        },
        {
            check: /[A-Z]/,
            score: 2,
        },
        {
            check: /[0-9]/,
            score: 1,
        },
        {
            check: /[^a-zA-Z0-9]/,
            score: 4
        }
    ];

    public get formatLabel() {
        const maps = [
            '',
            $localize `weak`,
            $localize `general`,
            $localize `strong`,
            $localize `stronger`
        ];
        return maps[this.formatRating];
    }

    public get formatRating() {
        if (this.score <= 0) {
            return 0;
        }
        if (this.score <= 3) {
            return 1;
        }
        if (this.score < 6) {
            return 2;
        }
        if (this.score > 9) {
            return 4;
        }
        return 3;
    }

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.refresh();
        }
    }

    public refresh() {
        if (emptyValidate(this.value)) {
            this.score = 0;
            return;
        }
        let score = 0;
        for (const item of this.ratingItems) {
            if (typeof item.check === 'function') {
                score += item.check(this.value);
                continue;
            }
            if (item.check.test(this.value)) {
                score += item.score;
            }
        }
        this.score = score;
    }
}
