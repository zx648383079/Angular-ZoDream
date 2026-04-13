import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { ExamService } from '../exam.service';
import { IExamPager, IQuestionCard, IQuestionFormat, IQuestionPageItem } from '../model';
import { formatPager } from '../util';
import { ThemeService } from '../../../theme/services';


@Component({
    standalone: false,
    selector: 'app-pager',
    templateUrl: './pager.component.html',
    styleUrls: ['./pager.component.scss']
})
export class PagerComponent {
    private readonly service = inject(ExamService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);
    private readonly location = inject(Location);

    public readonly data = signal<IExamPager|null>(null);
    public readonly finished = signal(false);
    public readonly cardItems = signal<IQuestionCard[]>([]);
    public readonly page = signal(1);
    public readonly endTime = signal(0);
    public readonly pageItems = signal<IQuestionPageItem[]>([]);
    public readonly current = signal<IQuestionPageItem|null>(null);
    private saveHandle = 0;
    private saveData: any[] = [];

    constructor() {
        this.route.params.subscribe(params => {
            this.service.pager({
                id: params.id || 0,
                course: params.course,
                type: params.type,
            }).subscribe({
                next: res => {
                    this.data.set(res);
                    this.finished.set(res.finished);
                    const args = formatPager(res.data);
                    this.pageItems.set(args[0]);
                    this.cardItems.set(args[1]);
                    this.tapPage(1);
                    this.endTime.set((res.start_time > 0 ? res.start_time * 1000 : Date.now()) + res.time * 60000);
                },
                error: err => {
                    this.toastrService.error(err);
                    this.location.back();
                }
            });
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
        this.current.set(this.pageItems()[page - 1]);
        this.themeService.scrollTop(0);
    }

    public onTimeEnd() {
        if (!this.data) {
            return;
        }
        this.tapFinish();
    }

    public tapItem(i: number) {
        const card = this.cardItems()[i];
        this.tapPage(card.page ?? 1);
    }

    public onQuestionChange(event: IQuestionFormat|null|undefined, i: number) {
        if (!event) {
            return;
        }
        this.current.update(v => {
            if (!v) {
                return v;
            }
            v.items[i].answer = event.answer;
            v.items[i].option = event.option;
            return v;
        });
        
        if (this.data()!.id < 1) {
            return;
        }
        this.asyncSave({
            id: event.id,
            answer: event.answer,
            dynamic: event.dynamic,
        });
    }

    private asyncSave(item: any) {
        const indexOf = () => {
            for (let i = this.saveData.length - 1; i >= 0; i--) {
                if (this.saveData[i].id == item.id) {
                    return i;
                }
            }
            return -1;
        };
        if (this.saveHandle > 0) {
            clearTimeout(this.saveHandle);
        }
        const j = indexOf();
        if (j < 0) {
            this.saveData.push(item);
        } else {
            this.saveData[j] = item;
        }
        this.saveHandle = window.setTimeout(() => {
            this.saveHandle = 0;
            if (this.saveData.length < 1) {
                return;
            }
            this.service.pagerSave([...this.saveData], this.data()!.id, this.data()!.page_id).subscribe(() => {});
            this.saveData = [];
        }, 500);
    }

    public tapFinish(e?: ButtonEvent) {
        this.finished.set(true);
        e?.enter();
        this.service.pagerCheck(this.data()!.data.map(i => {
            return {
                id: i.id,
                answer: i.answer,
                dynamic: i.dynamic
            };
        }), this.data()!.id, this.data()!.page_id).subscribe({
            next: res => {
                e?.reset();
                this.data.set(res);
                this.tapPage(this.page());
            },
            error: err => {
                e?.reset();
                this.finished.set(false);
                this.toastrService.error(err);
            }
        });
    }
}
