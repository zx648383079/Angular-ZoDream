import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { ServiceBackendComponent } from './service-backend.component';
import { UserComponent } from './user/user.component';
import { WordComponent } from './word/word.component';

const routes: Routes = [
    {
        path: 'word/:category',
        component: WordComponent,
    },
    {
        path: 'word',
        component: WordComponent,
    },
    {
        path: 'user/:category',
        component: UserComponent,
    },
    {
        path: 'category',
        component: CategoryComponent,
    },
    {
        path: '',
        component: ServiceBackendComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OnlineServiceBackendRoutingModule {}

export const onlineServiceBackendRoutingComponents = [
    ServiceBackendComponent, UserComponent, WordComponent
];
