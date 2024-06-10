import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { TradeTrackerComponent } from './trade-tracker.component';
import { ProductComponent } from './product/product.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

const routes: Routes = [
    {
        path: 'product/:id',
        component: ProductComponent
    },
    {
        path: '',
        component: TradeTrackerComponent
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
export class TrackerRoutingModule {}

export const TrackerRoutedComponents = [
    TradeTrackerComponent, ProductComponent, ToolbarComponent
];
