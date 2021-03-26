import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinComponent } from './checkin.component';
import { CheckinService } from './checkin.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [CheckinComponent],
    providers: [
        CheckinService,
    ],
    exports: [
        CheckinComponent,  
    ],
})
export class CheckinModule { }
