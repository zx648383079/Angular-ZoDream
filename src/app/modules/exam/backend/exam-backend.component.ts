import { Component, OnInit } from '@angular/core';
import { ExamService } from './exam.service';

@Component({
  selector: 'app-exam-backend',
  templateUrl: './exam-backend.component.html',
  styleUrls: ['./exam-backend.component.scss']
})
export class ExamBackendComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: ExamService,
    ) { }

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading = false;
            this.data = res;
        });
    }

}
