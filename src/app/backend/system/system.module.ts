import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing.module';
import { SystemComponent } from './system.component';
import { ThemeModule } from '../../theme/theme.module';
import { CacheComponent } from './cache/cache.component';
import { SqlComponent } from './sql/sql.component';
import { SitemapComponent } from './sitemap/sitemap.component';


@NgModule({
  declarations: [SystemComponent, CacheComponent, SqlComponent, SitemapComponent],
  imports: [
    CommonModule,
    ThemeModule,
    SystemRoutingModule
  ]
})
export class SystemModule { }
