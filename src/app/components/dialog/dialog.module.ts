import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from './dialog.service';
import { DialogBoxComponent } from './box/dialog-box.component';
import { DialogMessageComponent } from './message/dialog-message.component';
import { DialogConfirmComponent } from './confirm/dialog-confirm.component';
import { DialogLoadingComponent } from './loading/dialog-loading.component';
import { DialogContainerComponent } from './container/dialog-container.component';
import { PopupDirective } from './popup.directive';
import { DialogPopupComponent } from './popup/dialog-popup.component';

const COMPONENTS = [
    DialogBoxComponent,
    DialogMessageComponent,
    DialogConfirmComponent,
    DialogLoadingComponent,
    DialogContainerComponent,
    DialogPopupComponent,
    PopupDirective,
];

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [	
        ...COMPONENTS,
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
                DialogService
            ]
        };
    }
}
