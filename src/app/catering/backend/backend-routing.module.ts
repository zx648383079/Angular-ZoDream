import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CateringBackendComponent } from './catering-backend.component';


const routes: Routes = [
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
    CateringBackendComponent,
];
