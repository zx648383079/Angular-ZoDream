import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineServiceComponent } from './online-service.component';
import { MessageContainerComponent } from './message-container/message-container.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        OnlineServiceComponent, MessageContainerComponent
    ],
    exports: [
        OnlineServiceComponent,
        MessageContainerComponent,
    ]
})
export class OnlineServiceModule { }
