import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../theme/theme.module';
import { forumRoutedComponents, ForumRoutingModule } from './forum-routing.module';
import { ForumService } from './forum.service';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    NgbPaginationModule,
    NgbModalModule,
    ReactiveFormsModule,
    ForumRoutingModule,
  ],
  declarations: [...forumRoutedComponents],
  providers: [
    ForumService
  ]
})
export class ForumModule { }
