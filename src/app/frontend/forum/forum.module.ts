import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumRoutingModule } from './forum-routing.module';
import { ForumComponent } from './forum.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { ThreadComponent } from './thread/thread.component';


@NgModule({
  declarations: [ForumComponent, HomeComponent, ListComponent, ThreadComponent],
  imports: [
    CommonModule,
    ForumRoutingModule
  ]
})
export class ForumModule { }
