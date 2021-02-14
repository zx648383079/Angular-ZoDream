import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LegworkComponent } from './legwork.component';

const routes: Routes = [{
    path: '',
    component: LegworkComponent,
    children: [
        {
            path: '',
            component: HomeComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LegworkRoutingModule {}

export const legworkRoutingComponents = [
    LegworkComponent, HomeComponent
];
