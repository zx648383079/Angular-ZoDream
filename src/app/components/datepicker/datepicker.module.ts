import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker.component';
import { ThemeModule } from '../../theme/theme.module';

const COMPONENTS = [DatepickerComponent];

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
    ],
    declarations: [...COMPONENTS],
    exports: [
        ...COMPONENTS,
    ]
})
export class DatePickerModule { }
