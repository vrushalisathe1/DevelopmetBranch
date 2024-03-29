import {  Routes } from "@angular/router";
import { CustomerupdateComponent } from "./customeredit.component";
import { CustomeraddComponent } from "./customeradd.component";
import { CustomerlistComponent } from "./customerlist.component";

export const routes: Routes = [  
    { path: '', component: CustomerlistComponent },
    { path: 'add', component: CustomeraddComponent },
    { path: 'edit/:id', component: CustomerupdateComponent }       
];
