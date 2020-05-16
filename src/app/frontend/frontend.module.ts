import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontendRoutingModule } from './frontend-routing.module';
import { HomeComponent } from './home/home.component';
import { FrontendComponent } from './frontend.component';
import { AboutComponent } from './about/about.component';
import { FrontendService } from './frontend.service';
import { FriendLinkComponent } from './friend-link/friend-link.component';


@NgModule({
    declarations: [HomeComponent, AboutComponent, FrontendComponent, FriendLinkComponent],
    imports: [
        CommonModule,
        FrontendRoutingModule
    ],
    providers: [
        FrontendService
    ]
})
export class FrontendModule { }
