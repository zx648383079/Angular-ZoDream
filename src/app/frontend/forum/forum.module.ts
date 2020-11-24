import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { forumRoutedComponents, ForumRoutingModule } from './forum-routing.module';
import { ForumService } from './forum.service';


@NgModule({
  declarations: [...forumRoutedComponents],
  imports: [
    CommonModule,
    ForumRoutingModule
  ],
  providers: [
    ForumService
  ]
})
export class ForumModule { }
