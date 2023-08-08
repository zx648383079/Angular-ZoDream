import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CateringBackendComponent } from './catering-backend.component';
import { StoreComponent } from './store/store.component';
import { EditStoreComponent } from './store/edit/edit-store.component';


const routes: Routes = [
    {
        path: 'store/create',
        component: EditStoreComponent,
    },
    {
        path: 'store/edit/:id',
        component: EditStoreComponent,
    },
    {
        path: 'store',
        component: StoreComponent,
    },
    {
        path: '',
        component: CateringBackendComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CateringBackendRoutingModule {}


export const cateringBackendRoutingComponents = [
    CateringBackendComponent, StoreComponent, EditStoreComponent
];
