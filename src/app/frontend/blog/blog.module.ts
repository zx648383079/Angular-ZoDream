import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule, blogRoutingComponents } from './blog-routing.module';
import { BlogService } from './blog.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [...blogRoutingComponents],
  imports: [
    CommonModule,
    NgbPaginationModule,
    BlogRoutingModule
  ],
  providers: [
    BlogService
  ]
})
export class BlogModule { }
