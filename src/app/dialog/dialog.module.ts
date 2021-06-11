import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from './dialog.service';
import { DialogBoxComponent } from './box/dialog-box.component';
import { ToastrModule } from 'ngx-toastr';


const COMPONENTS = [
    DialogBoxComponent
];

@NgModule({
    imports: [
        CommonModule,
        ToastrModule.forRoot({
            timeOut: 1500,
            positionClass: 'toast-top-center',
            preventDuplicates: true,
            progressAnimation: 'increasing'
        }),
    ],
    declarations: [
        ...COMPONENTS
    ],
    providers: [
        DialogService,
    ],
    exports: [
        ...COMPONENTS
    ],
})
export class DialogModule {
    static forRoot(): ModuleWithProviders<DialogModule> {
        return {
            ngModule: DialogModule
        };
    }
}
