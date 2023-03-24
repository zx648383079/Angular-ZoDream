import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamMemberRoutingComponents, ExamMemberRoutingModule } from './routing.module';
import { ExamService } from './exam.service';

@NgModule({
    imports: [
        CommonModule,
        ExamMemberRoutingModule
    ],
    declarations: [...ExamMemberRoutingComponents],
    providers: [
        ExamService
    ]
})
export class ExamMemberModule { }
