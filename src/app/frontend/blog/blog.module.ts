import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { TagComponent } from './tag/tag.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { CategoryComponent } from './category/category.component';
import { ArchivesComponent } from './archives/archives.component';
import { BlogService } from './blog.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [BlogComponent, TagComponent, ListComponent, DetailComponent, CategoryComponent, ArchivesComponent],
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
