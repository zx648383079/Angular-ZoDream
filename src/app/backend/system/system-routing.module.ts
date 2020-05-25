import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SystemComponent } from './system.component';
import { CacheComponent } from './cache/cache.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { SqlComponent } from './sql/sql.component';

const routes: Routes = [
  { path: '', component: SystemComponent },
  {
    path: 'cache',
    component: CacheComponent
  },
  {
    path: 'sitemap',
    component: SitemapComponent
  },
  {
    path: 'sql',
    component: SqlComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }

export const systemRoutedComponents = [
  SystemComponent, CacheComponent, SqlComponent, SitemapComponent
];
