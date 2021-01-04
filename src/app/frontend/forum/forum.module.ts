import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { forumRoutedComponents, ForumRoutingModule } from './forum-routing.module';
import { ForumService } from './forum.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [...forumRoutedComponents],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ForumRoutingModule,
    ],
    providers: [
        ForumService
    ],
})
export class ForumModule { }
