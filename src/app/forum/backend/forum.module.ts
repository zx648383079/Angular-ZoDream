import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../theme/theme.module';
import { forumRoutedComponents, ForumRoutingModule } from './forum-routing.module';
import { ForumService } from './forum.service'; 
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../../dialog';
import { ZreFormModule } from '../../form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        ForumRoutingModule,
        DialogModule,
        ZreFormModule,
    ],
    declarations: [...forumRoutedComponents],
    providers: [
        ForumService
    ]
})
export class ForumModule { }
