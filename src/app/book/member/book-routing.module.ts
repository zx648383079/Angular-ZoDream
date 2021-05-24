import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { BookMemberComponent } from './book-member.component';

const routes: Routes = [
    {
        path: '',
        component: BookMemberComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookMemberRoutingModule {}


export const bookMemberRoutingComponents = [
    BookMemberComponent
];
