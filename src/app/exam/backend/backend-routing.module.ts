import {
    NgModule
} from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { CourseComponent } from './course/course.component';
import { CourseGradeComponent } from './course/grade/course-grade.component';
import { ExamBackendComponent } from './exam-backend.component';
import { MaterialComponent } from './material/material.component';
import { MaterialPanelComponent } from './material/panel/material-panel.component';
import { EditPageComponent } from './page/edit/edit-page.component';
import { EvaluateComponent } from './page/evaluate/evaluate.component';
import { PageComponent } from './page/page.component';
import { EditQuestionComponent } from './question/edit/edit-question.component';
import { QuestionComponent } from './question/question.component';
import { EditUpgradeComponent } from './upgrade/edit/edit-upgrade.component';
import { UpgradeComponent } from './upgrade/upgrade.component';

const routes: Routes = [
    {
        path: 'course',
        component: CourseComponent,
    },
    {
        path: 'course/grade',
        component: CourseGradeComponent,
    },
    {
        path: 'upgrade/create',
        component: EditUpgradeComponent,
    },
    {
        path: 'upgrade/edit/:id',
        component: EditUpgradeComponent,
    },
    {
        path: 'upgrade',
        component: UpgradeComponent,
    },
    {
        path: 'question/create',
        component: EditQuestionComponent,
    },
    {
        path: 'question/edit/:id',
        component: EditQuestionComponent,
    },
    {
        path: 'question',
        component: QuestionComponent,
    },
    {
        path: 'material',
        component: MaterialComponent,
    },
    {
        path: 'page/create',
        component: EditPageComponent,
    },
    {
        path: 'page/edit/:id',
        component: EditPageComponent,
    },
    {
        path: 'page/evaluate/:id',
        component: EvaluateComponent,
    },
    {
        path: 'page',
        component: PageComponent,
    },
    {
        path: '',
        component: ExamBackendComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExamBackendRoutingModule {}

export const examBackendRoutedComponents = [
    ExamBackendComponent, QuestionComponent, CourseComponent, PageComponent, EditQuestionComponent, EditPageComponent, EvaluateComponent, MaterialComponent, MaterialPanelComponent, CourseGradeComponent, EditUpgradeComponent, UpgradeComponent
];