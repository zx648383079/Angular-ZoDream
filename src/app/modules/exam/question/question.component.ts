import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../exam.service';
import { ICourse, IQuestionCard, IQuestionFormat, IQuestionOption } from '../model';

@Component({
    standalone: false,
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.scss']
})
export class QuestionComponent {
    private readonly service = inject(ExamService);
    private readonly route = inject(ActivatedRoute);


    public readonly course = signal<ICourse|null>(null);
    public readonly data = signal<IQuestionFormat|null>(null);
    public readonly cardItems = signal<IQuestionCard[]>([]);

    public readonly analysisVisiable = signal(false);
    public readonly cardVisiable = signal(false);
    public readonly cardIndex = signal(0);
    public readonly editable = signal(true);

    constructor() {
        this.route.params.subscribe(params => {
            if (params.course) {
                this.service.course(params.course).subscribe(res => {
                    this.course.set(res);
                });
                this.service.questionCard(params.course).subscribe(res => {
                    this.cardItems.set(res.data);
                    this.tapCard(0);
                });
                return;
            }
            this.service.question({
                id: params.id,
                course: params.course
            }).subscribe(res => {
                res.answer = undefined;
                this.data.set(res);
            });
        });
    }

    public toggleCard() {
        this.cardVisiable.update(v => !v);
    }

    public toggleAnalysis() {
        this.analysisVisiable.update(v => !v);
    }

    public tapCard(i: number) {
        if (i >= this.cardItems.length) {
            return;
        }
        this.cardIndex.set(i);
        this.cardItems.update(v => v.map((item, j) => {
            item.active = j === i;
            return item;
        }));
        this.service.question({
            id: this.cardItems()[i].id
        }).subscribe(res => {
            res.answer = undefined;
            this.data.set(res);
            this.editable.set(true);
        });
    }

    public tapPrevious() {
        this.tapCard(Math.max(0, this.cardIndex() - 1));
    }

    /**
     * tapNext
     */
    public tapNext() {
        this.tapCard(this.cardIndex() + 1);
    }

    /**
     * tapCheck
     */
    public tapCheck() {
        const data = this.data()!;
        this.service.questionCheck({
            [data.id]: {
                answer: data.answer,
                dynamic: data.dynamic,
            }
        }).subscribe(res => {
            this.editable.set(false);
            this.data.set(res.data[0]);
        })
    }

}
