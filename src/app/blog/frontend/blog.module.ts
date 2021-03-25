import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule, blogRoutingComponents } from './blog-routing.module';
import { BlogService } from './blog.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../theme/theme.module';


@NgModule({
  declarations: [...blogRoutingComponents],
  imports: [
    CommonModule,
    ThemeModule,
    ReactiveFormsModule,
    FormsModule,
    BlogRoutingModule
  ],
  providers: [
    BlogService
  ]
})
export class BlogModule { }
