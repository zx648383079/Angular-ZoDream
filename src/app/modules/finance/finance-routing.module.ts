import {
    NgModule
} from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { BudgetComponent } from './budget/budget.component';
import { BudgetContainerComponent } from './budget/container/budget-container.component';
import { FinanceComponent } from './finance.component';
import { HomeComponent } from './home/home.component';
import { ChannelComponent } from './income/channel/channel.component';
import { EditIncomeComponent } from './income/edit/edit-income.component';
import { IncomeComponent } from './income/income.component';
import { MoneyComponent } from './money/money.component';
import { ProductComponent } from './money/product/product.component';
import { ProjectComponent } from './money/project/project.component';
import { SettingComponent } from './setting/setting.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';


const routes: Routes = [
    {
        path: '',
        component: FinanceComponent,
        children: [
            {
                path: 'budget',
                component: BudgetComponent,
            },
            {
                path: 'budget/:id',
                component: BudgetContainerComponent,
            },
            {
                path: 'income/channel',
                component: ChannelComponent,
            },
            {
                path: 'income/:action/:id',
                component: EditIncomeComponent,
            },
            {
                path: 'income/create',
                component: EditIncomeComponent,
            },
            {
                path: 'income',
                component: IncomeComponent,
            },
            {
                path: 'money/product',
                component: ProductComponent,
            },
            {
                path: 'money/project',
                component: ProjectComponent,
            },
            {
                path: 'money',
                component: MoneyComponent,
            },
            {
                path: 'setting',
                component: SettingComponent,
            },
            {
                path: '',
                component: HomeComponent,
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FinanceRoutingModule {}

export const financeRoutedComponents = [
    FinanceComponent, HomeComponent, MoneyComponent, IncomeComponent,
    BudgetComponent, ProductComponent, ProjectComponent, ChannelComponent,
    EditIncomeComponent, SettingComponent, BudgetContainerComponent, DateRangePickerComponent
];