import {  Routes } from "@angular/router";
import { EmployeeListComponent } from "./employeelist.component";
import { EmployeEditComponent } from "./employeeedit.component";
import { EmployeeAddComponent } from "./employeeadd.component";

export const routes: Routes = [
    { path: '', component: EmployeeListComponent },   
    { path: 'edit/:id', component: EmployeEditComponent }, 
    { path: 'file', component: EmployeeAddComponent },
   
];