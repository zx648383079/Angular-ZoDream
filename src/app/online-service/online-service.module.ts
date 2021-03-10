import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineServiceComponent } from './online-service.component';
import { MessageContainerComponent } from './message-container/message-container.component';
import { FormsModule } from '@angular/forms';
import { OnlineService } from './online.service';
import { ThemeModule } from '../theme/theme.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ThemeModule,
    ],
    declarations: [
        OnlineServiceComponent, MessageContainerComponent
    ],
    exports: [
        OnlineServiceComponent,
        MessageContainerComponent,
    ],
    providers: [
        OnlineService,
    ]
})
export class OnlineServiceModule { }
