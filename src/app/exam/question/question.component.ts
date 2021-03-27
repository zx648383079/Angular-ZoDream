import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../exam.service';
import { ICourse, IQuestion } from '../model';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

    public course: ICourse;
    public data: IQuestion;
    public cardItems = [];

    constructor(
        private service: ExamService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.course) {
                this.service.course(params.id).subscribe(res => {
                    this.course = res;
                });
            }
            this.service.question({
                id: params.id,
                course: params.course
            }).subscribe(res => {
                this.data = res;
            });
        });
    }

}
