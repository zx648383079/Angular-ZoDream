import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../exam.service';
import { ICourse, IQuestionCard, IQuestionFormat, IQuestionOption } from '../model';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

    public course: ICourse;
    public data: IQuestionFormat;
    public cardItems: IQuestionCard[] = [];

    public analysisVisiable = false;
    public cardVisiable = false;
    public cardIndex = 0;
    public editable = true;

    constructor(
        private service: ExamService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.course) {
                this.service.course(params.course).subscribe(res => {
                    this.course = res;
                });
                this.service.questionCard(params.course).subscribe(res => {
                    this.cardItems = res.data;
                    this.tapCard(0);
                });
                return;
            }
            this.service.question({
                id: params.id,
                course: params.course
            }).subscribe(res => {
                this.data = res;
            });
        });
    }

    public tapCard(i: number) {
        if (i >= this.cardItems.length) {
            return;
        }
        this.cardIndex = i;
        this.cardItems = this.cardItems.map((item, j) => {
            item.active = j === i;
            return item;
        });
        this.service.question({
            id: this.cardItems[i].id
        }).subscribe(res => {
            this.data = res;
        });
    }

    public tapPrevious() {
        this.tapCard(Math.max(0, this.cardIndex - 1));
    }

    /**
     * tapNext
     */
    public tapNext() {
        this.tapCard(this.cardIndex + 1);
    }

    /**
     * tapCheck
     */
    public tapCheck() {
        this.service.questionCheck({
            [this.data.id]: {
                answer: this.data.answer,
                dynamic: this.data.dynamic,
            }
        }).subscribe(res => {
            this.editable = false;
            this.data = res.data[0];
        })
    }

}
