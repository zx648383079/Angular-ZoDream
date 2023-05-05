import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { CanActivateAuthRole } from '../../theme/guards';
import { TrendAnalysisComponent } from './trend-analysis.component';
import { HomeComponent } from './home/home.component';
import { SourceComponent } from './source/source.component';
import { TrendComponent } from './trend/trend.component';
import { AnalysisComponent } from './trend/analysis/analysis.component';
import { RealTimeComponent } from './trend/real-time/real-time.component';
import { VisitComponent } from './visit/visit.component';
import { DomainComponent } from './visit/domain/domain.component';
import { EnterComponent } from './visit/enter/enter.component';
import { JumpComponent } from './visit/jump/jump.component';
import { PageComponent } from './visit/page/page.component';
import { PageClickComponent } from './visit/page-click/page-click.component';
import { VisitorComponent } from './visitor/visitor.component';
import { BroswerComponent } from './visitor/broswer/broswer.component';
import { DistrictComponent } from './visitor/district/district.component';
import { HourPipe } from './hour.pipe';

const routes: Routes = [
    {
        path: '',
        component: TrendAnalysisComponent,
        canActivate: [CanActivateAuthRole('trend-analysis')],
        children: [
            {
                path: 'trend/analysis',
                component: AnalysisComponent
            },
            {
                path: 'trend/real-time',
                component: RealTimeComponent
            },
            {
                path: 'trend',
                component: TrendComponent
            },
            {
                path: 'visit/domain',
                component: DomainComponent
            },
            {
                path: 'visit/enter',
                component: EnterComponent
            },
            {
                path: 'visit/jump',
                component: JumpComponent
            },
            {
                path: 'visit/page',
                component: PageComponent
            },
            {
                path: 'visit/page-click',
                component: PageClickComponent
            },
            {
                path: 'visit',
                component: VisitComponent
            },
            {
                path: 'visitor/broswer',
                component: BroswerComponent
            },
            {
                path: 'visitor/district',
                component: DistrictComponent
            },
            {
                path: 'visitor',
                component: VisitorComponent
            },
            {
                path: 'source',
                component: SourceComponent
            },
            {
                path: '',
                component: HomeComponent
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrendRoutingModule {}


export const trendRoutingComponents = [
    TrendAnalysisComponent,
    AnalysisComponent,
    DistrictComponent,
    BroswerComponent,
    EnterComponent,
    PageClickComponent,
    VisitorComponent,
    VisitComponent,
    PageComponent,
    JumpComponent,
    DomainComponent,
    RealTimeComponent,
    TrendComponent,
    HomeComponent,
    SourceComponent,
    HourPipe
];