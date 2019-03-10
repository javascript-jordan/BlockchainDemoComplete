import { Component } from '@angular/core';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'blockchain-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'blockchain';
  initTasks: Promise<any>[];

  constructor(httpService: HttpService){
    this.initTasks = [
      httpService.xhr.bind(httpService, "addUser", {usersName: "jordan", usersAge: 22}),
      httpService.xhr.bind(httpService, "addUser", {usersName: "bob", usersAge: 12}),
      httpService.xhr.bind(httpService, "addUser", {usersName: "joe", usersAge: 45}),
      httpService.xhr.bind(httpService, "addUser", {usersName: "rick", usersAge: 30}),
      httpService.xhr.bind(httpService, "addUser", {usersName: "foo", usersAge: 99}),
      httpService.xhr.bind(httpService, "addUser", {usersName: "bar", usersAge: 77}),
      httpService.xhr.bind(httpService, "addWallet", {"owner":1,"currency":"USD","amount":200}),
      httpService.xhr.bind(httpService, "addWallet", {"owner":2,"currency":"BTC","amount":20}),
      httpService.xhr.bind(httpService, "addWallet", {"owner":3,"currency":"CAD","amount":4000}),
      httpService.xhr.bind(httpService, "addWallet", {"owner":4,"currency":"USD","amount":500}),
      httpService.xhr.bind(httpService, "addWallet", {"owner":5,"currency":"BTC","amount":5}),
      httpService.xhr.bind(httpService, "addWallet", {"owner":6,"currency":"CAD","amount":2500}),
      httpService.xhr.bind(httpService, "addTrade", {sender: {id: 1, currency: "USD", amount: 40}, receiver: {id: 3, currency: "CAD", amount: 700}}),
      httpService.xhr.bind(httpService, "addTrade", {sender: {id: 2, currency: "BTC", amount: 5}, receiver: {id: 6, currency: "CAD", amount: 1000}}),
      httpService.xhr.bind(httpService, "addTrade", {sender: {id: 4, currency: "USD", amount: 350}, receiver: {id: 5, currency: "BTC", amount: 2}})
    ];
    function init(taskNumber: number): void{
      try {
        this.initTasks[taskNumber]().then(() => {
          if(taskNumber + 1 === this.initTasks.length){
            localStorage.setItem("initialized", "yes");
          }else{
            return init.call(this, ++taskNumber);
          }
        }).catch(console.error);
      } catch (error) {
        console.error(error);
      }
    }
    if(localStorage.getItem("init") && !localStorage.getItem("initialized")) init.call(this, 0);
  }
}
