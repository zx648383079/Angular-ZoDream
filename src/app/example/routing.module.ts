import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExampleComponent } from './example.component';
import { ExampleHomeComponent } from './home/home.component';
import { ExampleLoginComponent } from './login/login.component';
import { ExampleSettingComponent } from './setting/setting.component';
import { ExampleFormComponent } from './form/form.component';
import { ExampleSearchComponent } from './search/search.component';
import { ExampleChartComponent } from './chart/chart.component';
import { ExampleEditorComponent } from './editor/editor.component';
import { ExampleFileComponent } from './file/file.component';
import { ExamplePlayerComponent } from './player/player.component';
import { ExampleTourComponent } from './tour/tour.component';
import { ExampleModalComponent } from './modal/modal.component';


const routes: Routes = [
    {
        path: '',
        component: ExampleComponent,
        children: [
            {
                path: 'login',
                component: ExampleLoginComponent
            },
            {
                path: 'chart',
                component: ExampleChartComponent
            },
            {
                path: 'editor',
                component: ExampleEditorComponent
            },
            {
                path: 'file',
                component: ExampleFileComponent
            },
            {
                path: 'modal',
                component: ExampleModalComponent,
            },
            {
                path: 'player',
                component: ExamplePlayerComponent
            },
            {
                path: 'tour',
                component: ExampleTourComponent
            },
            {
                path: 'search',
                component: ExampleSearchComponent
            },
            {
                path: 'form',
                component: ExampleFormComponent
            },
            {
                path: 'setting',
                component: ExampleSettingComponent
            },
            {
                path: 'home',
                component: ExampleHomeComponent
            },
            {
                path: '**',
                redirectTo: 'home',
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExampleRoutingModule {}


export const ExampleRoutingComponents = [
    ExampleComponent, ExampleHomeComponent, ExampleLoginComponent, ExampleSettingComponent, ExampleSearchComponent, ExampleFormComponent,
    ExampleChartComponent, ExampleTourComponent, ExamplePlayerComponent, ExampleEditorComponent, ExampleFileComponent, ExampleModalComponent
];
