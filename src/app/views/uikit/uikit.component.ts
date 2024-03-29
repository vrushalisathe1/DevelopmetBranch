import { Component, OnInit,  OnDestroy } from '@angular/core';
import {  RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
    selector: 'app-uikit',
    standalone: true,
    imports: [CommonModule, RouterModule, SharedModule, MultiSelectModule],
    templateUrl: './uikit.component.html'
})
export class UIKitComponent implements OnInit, OnDestroy {
    constructor() { }    

    ngOnInit() { }

    ngOnDestroy() { }

}
