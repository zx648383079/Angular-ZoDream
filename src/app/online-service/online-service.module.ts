import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineServiceComponent } from './online-service.component';
import { FormsModule } from '@angular/forms';
import { OnlineService } from './online.service';
import { ThemeModule } from '../theme/theme.module';
import { MessageContainerModule } from '../message-container/message-container.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ThemeModule,
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
