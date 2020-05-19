import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MicroComponent } from './micro.component';

const routes: Routes = [{ path: '', component: MicroComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MicroRoutingModule { }
