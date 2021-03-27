import { Component, OnInit } from '@angular/core';
import { ExamService } from './exam.service';
import { ICourse } from './model';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

    public items: ICourse[] = [];

    constructor(
      private service: ExamService,
    ) { }
  
    ngOnInit() {
        this.service.courseChildren().subscribe(res => {
            this.items = res.data;
        });
    }

}
