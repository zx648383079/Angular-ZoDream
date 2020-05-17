import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiskComponent } from './disk.component';
import { HomeComponent } from './home/home.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ShareComponent } from './share/share.component';
import { TrashComponent } from './trash/trash.component';
import { PasswordComponent } from './password/password.component';

const routes: Routes = [
  {
    path: '',
    component: DiskComponent,
    children: [
      {
        path: 'catalog',
        component: CatalogComponent
      },
      {
        path: 'share',
        component: ShareComponent
      },
      {
        path: 'password',
        component: PasswordComponent
      },
      {
        path: 'trash',
        component: TrashComponent
      },
      {
        path: '',
        component: HomeComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiskRoutingModule { }
