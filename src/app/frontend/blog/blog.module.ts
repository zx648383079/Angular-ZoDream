import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule, blogRoutingComponents } from './blog-routing.module';
import { BlogService } from './blog.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [...blogRoutingComponents],
  imports: [
    CommonModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    BlogRoutingModule
  ],
  providers: [
    BlogService
  ]
})
export class BlogModule { }
