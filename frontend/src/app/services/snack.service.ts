import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material";
import * as _ from 'lodash';

@Injectable()
export class SnackService {
  constructor(private snackBar: MatSnackBar) {
  }

  public info(message: string, options?) {
    const config = _.assign({
      duration: 3000,
    }, options || {});
    this.snackBar.open(message, null, config);
  }

  public success(message: string, options?) {
    const config = _.assign({
      duration: 2000,
      panelClass: 'success'
    }, options || {});
    this.snackBar.open(message, null, config);
  }

  public error(message: string, options?){
    const config = _.assign({
      duration: 5000,
      panelClass: 'error'
    }, options || {});
    this.snackBar.open(message, null, config);
  }
}
