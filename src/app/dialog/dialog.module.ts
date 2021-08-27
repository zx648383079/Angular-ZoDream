import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from './dialog.service';
import { DialogBoxComponent } from './box/dialog-box.component';
import { DialogMessageComponent } from './message/dialog-message.component';
import { DialogConfirmComponent } from './confirm/dialog-confirm.component';
import { ThemeModule } from '../theme/theme.module';
import { DialogLoadingComponent } from './loading/dialog-loading.component';


const COMPONENTS = [
    DialogBoxComponent,
    DialogMessageComponent,
    DialogConfirmComponent,
    DialogLoadingComponent,
];

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ...COMPONENTS
    ],
    exports: [
        ...COMPONENTS
    ],
})
export class DialogModule {
    static forRoot(): ModuleWithProviders<DialogModule> {
        return {
            ngModule: DialogModule,
            providers: [
                DialogService,
            ]
        };
    }
}
