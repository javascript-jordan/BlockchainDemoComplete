import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'blockchain-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less']
})
export class UserListComponent implements OnChanges {

  @Input("users") users: any[];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.users = changes.users.currentValue;
  }

}
