import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule, blogRoutedComponents } from './blog-routing.module';
import { ThemeModule } from '../../theme/theme.module';


@NgModule({
  declarations: [...blogRoutedComponents],
  imports: [
    CommonModule,
    ThemeModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
