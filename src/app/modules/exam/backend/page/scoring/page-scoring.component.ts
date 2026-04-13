import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { formatHour } from '../../../../../theme/utils';
import { IPageEvaluate, IQuestionCard, IQuestionFormat, IQuestionPageItem } from '../../../model';
import { formatPager } from '../../../util';
import { ExamService } from '../../exam.service';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-page-scoring',
    templateUrl: './page-scoring.component.html',
    styleUrls: ['./page-scoring.component.scss']
})
export class PageScoringComponent {
    private readonly service = inject(ExamService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly location = inject(Location);

    public readonly modal = viewChild<DialogEvent>('modal');

    public readonly data = signal<IPageEvaluate|null>(null);
    public readonly cardItems = signal<IQuestionCard[]>([]);
    public readonly page = signal(1);
    public readonly endTime = signal(0);
    public readonly pageItems = signal<IQuestionPageItem[]>([]);
    public readonly current = signal<IQuestionPageItem|null>(null);
    public readonly editForm = form(signal({
        remark: '',
    }));

    constructor() {
        this.route.params.subscribe(params => {
            if (params.id > 0) {
                this.loadData(params.id);
            }
        });
    }

    public readonly formatScale = computed(() => {
        const data = this.data();
        if (!data) {
            return '--';
        }
        return data.right * data.page!.question_count!;
    });

    public formatHour(v: number) {
        return formatHour(v, undefined, true);
    }

    public onScoring(i: number, e: IQuestionFormat|undefined) {
        if (!e) {
            return;
        }
        this.current.update((v: any) => {
            v.items[i].log = e.log;
            return v;
        });
        this.service.pageQuestionScoring({
            id: this.data()!.id,
            question: [
                {
                    id: e.id,
                    score: e.log!.score,
                    remark: e.log!.remark,
                }
            ]
        }).subscribe(() => {});
    }

    public tapSubmit(e?: ButtonEvent) {
        this.modal()?.open(() => {
            e?.enter();
            this.service.pageScoring({
                id: this.data()!.id,
                remark: this.editForm.remark().value()
            }).subscribe({
                next: () => {
                    this.toastrService.success('阅卷完成');
                    e?.reset();
                    this.location.back();
                },
                error: err => {
                    this.toastrService.error(err);
                    e?.reset();
                }
            });
        });
    }

    private loadData(id: any) {
        this.service.evaluate(id).subscribe({
            next: res => {
                this.data.set(res);
                const args = formatPager(res.data!);
                this.pageItems.set(args[0]);
                this.cardItems.set(args[1]);
                this.tapPage(1);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapPrevious() {
        this.tapPage(this.page() - 1);
    }

    public tapNext() {
        this.tapPage(this.page() + 1);
    }

    public tapPage(page: number) {
        this.page.set(page);
        this.current.set(this.pageItems().length >= page ? this.pageItems()[page - 1] : {items: []} as any);
        document.documentElement.scrollTop = 0;
    }
    
    public tapItem(i: number) {
        const card = this.cardItems()[i];
        this.tapPage(card.page!);
    }

}
