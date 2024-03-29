import { NgModule } from "@angular/core";
import { TableModule } from "./table";
import { ToastModule } from "primeng/toast";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { CheckboxModule } from "primeng/checkbox";
import { AccordionModule } from "./accordion";
import { SplitButtonModule } from 'primeng/splitbutton';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { TreeModule } from "primeng/tree";
import { ContextMenuModule } from 'primeng/contextmenu';
import { HttpClientModule } from "@angular/common/http";
import { NgIdleModule } from "@ng-idle/core";
import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import { InputSwitchModule } from 'primeng/inputswitch';
import { ChipsModule } from 'primeng/chips';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  declarations: [],
    imports: [FormsModule,HttpClientModule,ReactiveFormsModule, CommonModule, TableModule, ToastModule, TranslateModule,
    ButtonModule, InputTextModule, NgbDatepickerModule, DialogModule, DropdownModule, InputMaskModule, CheckboxModule,
        AccordionModule, SplitButtonModule, ChartModule, CardModule, TreeModule, ContextMenuModule, NgIdleModule,
        NgIdleKeepaliveModule, InputSwitchModule, ChipsModule, RadioButtonModule, MultiSelectModule],
    exports: [FormsModule,HttpClientModule,ReactiveFormsModule, CommonModule, TableModule, ToastModule, TranslateModule,
    ButtonModule, InputTextModule, NgbDatepickerModule, DialogModule, DropdownModule, InputMaskModule, CheckboxModule,
        AccordionModule, SplitButtonModule, ChartModule, CardModule, TreeModule, ContextMenuModule, NgIdleModule,
        NgIdleKeepaliveModule, InputSwitchModule, ChipsModule, RadioButtonModule, MultiSelectModule]    
})

export class SharedModule {}
