import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { EditComponent } from './edit/edit.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { RecordComponent } from './record/record.component';
import { ReviewComponent } from './review/review.component';
import { SettingComponent } from './setting/setting.component';
import { ShareDetailComponent } from './share/detail/share-detail.component';
import { MyShareComponent } from './share/my/my-share.component';
import { ShareComponent } from './share/share.component';
import { TaskComponent } from './task.component';
import { HourPipe } from './hour.pipe';
import { CommentPanelComponent } from './components/comment-panel/comment-panel.component';
import { CircleProgressComponent } from './components/circle-progress/circle-progress.component';
import { PlanComponent } from './plan/plan.component';
import { TaskSelectComponent } from './task-select/task-select.component';
import { PlanPendantComponent } from './components/pendant/pendant.component';

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
                path: 'plan',
                component: PlanComponent,
            },
            {
                path: 'setting',
                component: SettingComponent,
            },
            {
                path: 'review',
                component: ReviewComponent,
            },
            {
                path: 'record',
                component: RecordComponent,
            },
            {
                path: 'share/my',
                component: MyShareComponent,
            },
            {
                path: 'share/:id',
                component: ShareDetailComponent,
            },
            {
                path: 'share',
                component: ShareComponent,
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
    TaskComponent, DetailComponent, EditComponent, ListComponent,
    HomeComponent, SettingComponent, ReviewComponent, RecordComponent, ShareDetailComponent, MyShareComponent, ShareComponent,
    CommentPanelComponent, CircleProgressComponent, PlanComponent, TaskSelectComponent,
    PlanPendantComponent,
    HourPipe, 
];
