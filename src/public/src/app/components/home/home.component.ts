import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'blockchain-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    console.log("init")
  }

}
