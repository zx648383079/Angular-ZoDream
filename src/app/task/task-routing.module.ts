import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { EditComponent } from './edit/edit.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { SettingComponent } from './setting/setting.component';
import { TaskComponent } from './task.component';

const routes: Routes = [
    {
        path: '',
        component: TaskComponent,
        children: [
            {
                path: 'detail/:id',
                component: DetailComponent,
            },
            {
                path: 'edit/:id',
                component: EditComponent,
            },
            {
                path: 'create',
                component: EditComponent,
            },
            {
                path: 'list',
                component: ListComponent,
            },
            {
                path: 'setting',
                component: SettingComponent,
            },
            {
                path: '',
                component: HomeComponent,
            },
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }

export const taskRoutingComponents = [
    TaskComponent, DetailComponent, EditComponent, ListComponent, HomeComponent, SettingComponent
];
