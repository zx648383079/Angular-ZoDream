import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckInputComponent } from './check-input/check-input.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { CountdownButtonComponent } from './countdown-button/countdown-button.component';
import { DateInputComponent } from './date-input/date-input.component';
import { DatePickerModule } from '../datepicker';
import { FileInputComponent } from './file-input/file-input.component';
import { FileOnlineComponent } from './file-online/file-online.component';
import { RegionComponent } from './region/region.component';
import { SelectInputComponent } from './select-input/select-input.component';
import { StarComponent } from './star/star.component';
import { SwitchComponent } from './switch/switch.component';
import { TimeInputComponent } from './time-input/time-input.component';
import { ThemeModule } from '../../theme/theme.module';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { PasswordStrongComponent } from './password-strong/password-strong.component';
import { ActionButtonComponent } from './action-button/action-button.component';
import { NumberInputComponent } from './number-input/number-input.component';
import { UploadButtonComponent } from './upload-button/upload-button.component';
import { WordsInputComponent } from './words-input/words-input.component';
import { DataSizeComponent } from './data-size/data-size.component';
import { ButtonGroupComponent } from './button-group/button-group.component';
import { AutoSuggestBoxComponent } from './auto-suggest-box/auto-suggest-box.component';
import { ColorLayerComponent } from './color-layer/color-layer.component';

const COMPONENTS = [
    CheckInputComponent,
    ColorLayerComponent,
    ColorPickerComponent,
    CountdownButtonComponent,
    DateInputComponent,
    FileInputComponent,
    FileOnlineComponent,
    RegionComponent,
    SelectInputComponent,
    StarComponent,
    SwitchComponent,
    TimeInputComponent,
    AutocompleteComponent,
    PasswordStrongComponent,
    ActionButtonComponent,
    NumberInputComponent,
    UploadButtonComponent,
    WordsInputComponent,
    DataSizeComponent,
    ButtonGroupComponent,
    AutoSuggestBoxComponent,
];

@NgModule({
    imports: [
        CommonModule,
        DatePickerModule,
        ThemeModule,
    ],
    declarations: [...COMPONENTS],
    exports: [
        ...COMPONENTS,
    ]
})
export class ZreFormModule { }
