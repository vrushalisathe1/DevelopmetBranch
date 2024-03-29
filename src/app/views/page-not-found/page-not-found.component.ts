import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@Component({
    selector: 'app-page-not-found',
    standalone: true,
    imports: [CommonModule, RouterModule, SharedModule],
    templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

}
