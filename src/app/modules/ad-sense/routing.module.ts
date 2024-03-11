import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { AdSenseComponent } from './ad-sense.component';
import { AdComponent } from './ad/ad.component';
import { EditAdComponent } from './ad/edit/edit.component';
import { PositionComponent } from './position/position.component';
import { EditPositionComponent } from './position/edit/edit-position.component';

const routes: Routes = [
    {
        path: 'position/create',
        component: EditPositionComponent,
    },
    {
        path: 'position/edit/:id',
        component: EditPositionComponent,
    },
    {
        path: 'position',
        component: PositionComponent,
    },
    {
        path: 'create',
        component: EditAdComponent,
    },
    {
        path: 'edit/:id',
        component: EditAdComponent,
    },
    {
        path: 'list',
        component: AdComponent,
    },
    {
        path: '',
        component: AdSenseComponent
    },
    {
        path: '**',
        redirectTo: '',
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdRoutingModule {}

export const adRoutedComponents = [
    AdSenseComponent, AdComponent, PositionComponent, EditPositionComponent, EditAdComponent
];
