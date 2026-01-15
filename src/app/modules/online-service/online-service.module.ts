import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineServiceComponent } from './online-service.component';
import { OnlineService } from './online.service';
import { ThemeModule } from '../../theme/theme.module';
import { MessageContainerModule } from '../../components/message-container';
import { DesktopModule } from '../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        DesktopModule,
        MessageContainerModule,
    ],
    declarations: [
        OnlineServiceComponent, 
    ],
    exports: [
        OnlineServiceComponent,
    ],
    providers: [
        OnlineService,
    ]
})
export class OnlineServiceModule { }
