import { Component, inject, signal } from '@angular/core';
import { ExamService } from './exam.service';

@Component({
    standalone: false,
    selector: 'app-exam-backend',
    templateUrl: './exam-backend.component.html',
    styleUrls: ['./exam-backend.component.scss']
})
export class ExamBackendComponent {
    private readonly service = inject(ExamService);


    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});

    constructor() {
        this.service.statistics().subscribe(res => {
            this.isLoading.set(false);
            this.data.set(res);
        });
    }

}
