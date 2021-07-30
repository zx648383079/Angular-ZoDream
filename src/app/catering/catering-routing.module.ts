import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CateringComponent } from './catering.component';
import { SearchInputComponent } from './search-input/search-input.component';


const routes: Routes = [
    {
        path: '',
        component: CateringComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CateringRoutingModule {}


export const cateringRoutingComponents = [
    CateringComponent,
    SearchInputComponent,
];
