import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FriendLinkComponent } from './friend-link/friend-link.component';
import { SubscribeComponent } from './subscribe/subscribe.component';


@NgModule({
  declarations: [ContactComponent, FeedbackComponent, FriendLinkComponent, SubscribeComponent],
  imports: [
    CommonModule,
    ContactRoutingModule
  ]
})
export class ContactModule { }
