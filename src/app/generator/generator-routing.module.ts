import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ColumnComponent } from './database/column/column.component';
import { CopyTableComponent } from './database/copy/copy-table.component';
import { DatabaseComponent } from './database/database.component';
import { ExportComponent } from './database/export/export.component';
import { ImportComponent } from './database/import/import.component';
import { QueryComponent } from './database/query/query.component';
import { TableComponent } from './database/table/table.component';
import { GeneratorComponent } from './generator.component';
import { HomeComponent } from './home/home.component';
import { ModuleComponent } from './module/module.component';
import { ControllerComponent } from './template/controller/controller.component';
import { CrudComponent } from './template/crud/crud.component';
import { MigrationComponent } from './template/migration/migration.component';
import { ModelComponent } from './template/model/model.component';

const routes: Routes = [
    {
        path: '',
        component: GeneratorComponent,
        children: [
            {
                path: 'database/column',
                component: ColumnComponent,
            },
            {
                path: 'database/export',
                component: ExportComponent,
            },
            {
                path: 'database/import',
                component: ImportComponent,
            },
            {
                path: 'database/query',
                component: QueryComponent,
            },
            {
                path: 'database/table',
                component: TableComponent,
            },
            {
                path: 'database/copy',
                component: CopyTableComponent,
            },
            {
                path: 'database',
                component: DatabaseComponent,
            },
            {
                path: 'module',
                component: ModuleComponent,
            },
            {
                path: 'template/controller',
                component: ControllerComponent,
            },
            {
                path: 'template/crud',
                component: CrudComponent,
            },
            {
                path: 'template/migration',
                component: MigrationComponent,
            },
            {
                path: 'template/model',
                component: ModelComponent,
            },
            {
                path: '',
                component: HomeComponent
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneratorRoutingModule { }

export const generatorRoutedComponents = [
    GeneratorComponent, HomeComponent, CopyTableComponent, TableComponent, QueryComponent, DatabaseComponent, 
    ImportComponent, ExportComponent, ColumnComponent, ModuleComponent, ControllerComponent, CrudComponent, MigrationComponent, ModelComponent
];
