import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-patrol-info-edit-case-problem',
  templateUrl: 'patrol-info-edit-case-problem.html',
})
export class PatrolInfoEditCaseProblemPage {
  private patrolCaseProblemList;
  private selectedIds;

  constructor(private params: NavParams, private viewCtrl: ViewController) {
    this.patrolCaseProblemList = this.params.data.patrolCaseProblemList;
    this.selectedIds = [];
console.log(this.params.data);
    for (let i = 0; i < this.params.data.selectedCaseProblemList.length; i++) {
      for (let j = 0; j < this.patrolCaseProblemList.length; j++) {
        if (this.params.data.selectedCaseProblemList[i] == this.patrolCaseProblemList[j].caseValue) {
          this.selectedIds[j] = true;
          break;
        }
      }
    }
console.log(this.selectedIds);
  }

  doSelectAll() {
    for (let i = 0; i < this.patrolCaseProblemList.length; i++) {
      this.selectedIds[i] = true;
    }
  }

  doEmptied() {
    for (let i = 0; i < this.patrolCaseProblemList.length; i++) {
      this.selectedIds[i] = false;
    }
  }

  doSearch() {
    let selected = []
    for (let i = 0; i < this.selectedIds.length; i++) {
      if (this.selectedIds[i] === true) {
        selected.push(this.patrolCaseProblemList[i]);
      }
    }
    this.viewCtrl.dismiss(selected);
  }
}
