import { Component, computed, effect, input, signal } from '@angular/core';
import { emptyValidate } from '../../../theme/validators';

interface IRatingItem {
    check: RegExp | ((value: string) => number);
    score?: number;
}

@Component({
    standalone: false,
    selector: 'app-password-strong',
    templateUrl: './password-strong.component.html',
    styleUrls: ['./password-strong.component.scss']
})
export class PasswordStrongComponent {

    public readonly value = input('');
    public readonly score = signal(0);

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

    public readonly formatLabel = computed(() => {
        const maps = [
            '',
            $localize `weak`,
            $localize `general`,
            $localize `strong`,
            $localize `stronger`
        ];
        return maps[this.formatRating()];
    });

    public readonly formatRating = computed(() => {
        const score = this.score();
        if (score <= 0) {
            return 0;
        }
        if (score <= 3) {
            return 1;
        }
        if (score < 6) {
            return 2;
        }
        if (score > 9) {
            return 4;
        }
        return 3;
    });

    constructor() {
        effect(() => {
            this.refresh(this.value());
        });
    }

    private refresh(value: string) {
        if (emptyValidate(value)) {
            this.score.set(0);
            return;
        }
        let score = 0;
        for (const item of this.ratingItems) {
            if (typeof item.check === 'function') {
                score += item.check(value);
                continue;
            }
            if (item.check.test(value)) {
                score += item.score;
            }
        }
        this.score.set(score);
    }
}
