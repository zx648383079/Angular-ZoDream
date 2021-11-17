import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactComponent } from './contact.component';
import { FriendLinkComponent } from './friend-link/friend-link.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { StatusPipe } from './status.pipe';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  { path: '', component: ContactComponent },
  {
    path: 'friend-link',
    component: FriendLinkComponent
  },
  {
    path: 'feedback',
    component: FeedbackComponent,
  },
  {
    path: 'report',
    component: ReportComponent,
  },
  {
    path: 'subscribe',
    component: SubscribeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }

export const contactRoutedComponents = [
  ContactComponent, FeedbackComponent, FriendLinkComponent, SubscribeComponent, ReportComponent,

  StatusPipe,
];
