import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Injectable({
    providedIn: 'root'
})

export class CustomValidator {

    convertDateForEdit: NgbDateStruct = undefined;
    constructor(private datePipe: DatePipe) { }

    convertToMMDDYYYY(date) {
        if (date != null) {
            date = this.getdateForEdit(date);
            return date;
        }
        else {
            return null;
        }
    }

    convertDateToDateTimePicker(date) {
        var _setDate = new Date(date);
        if (date != undefined && date != "" && date != null) {
            return this.convertDateForEdit = {
                day: _setDate.getDate(),
                month: _setDate.getMonth() + 1,
                year: _setDate.getFullYear()
            };
        }
        else
            return null;
    }

    getdateForEdit(date) {
        let _pickyear = "";
        let _pickmonth = "";
        let _pickday = "";

        if (date != undefined && date != "" && date != null) {
            _pickmonth = this.datePipe.transform(date, 'MM');
            _pickday = this.datePipe.transform(date, 'dd');
            _pickyear = this.datePipe.transform(date, 'yy');
            return _pickmonth + "/" + _pickday + "/" + _pickyear;
        }
        else
            return null;
    }


}