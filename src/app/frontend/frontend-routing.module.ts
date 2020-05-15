import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontendComponent } from './frontend.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
    {
        path: '',
        component: FrontendComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent,
            }, {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            }, {
                path: '**',
                component: HomeComponent,
        }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontendRoutingModule { }
