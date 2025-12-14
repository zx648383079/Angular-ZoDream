import { Component, OnInit, inject } from '@angular/core';
import { ExamService } from './exam.service';

@Component({
    standalone: false,
  selector: 'app-exam-backend',
  templateUrl: './exam-backend.component.html',
  styleUrls: ['./exam-backend.component.scss']
})
export class ExamBackendComponent implements OnInit {
    private readonly service = inject(ExamService);


    public isLoading = true;
    public data: any = {};

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading = false;
            this.data = res;
        });
    }

}
