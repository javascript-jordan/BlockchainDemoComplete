import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { fadeInAnimation } from 'src/app/animations/fade';

@Component({
  selector: 'blockchain-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less'],
  animations: [...fadeInAnimation]
})
export class UsersComponent implements OnInit {

  public users: any[] = [];
  public usersForm: FormGroup;
  public error: any = null;

  private httpService: HttpService;

  constructor(socket: Socket, httpService: HttpService) {
    this.httpService = httpService;
    this.httpService.xhr("getUsers").then(response => this.users = response.data).catch(console.error);
    socket.on("addNewUser", this.newUserAdded.bind(this));
  }

  ngOnInit() {
    this.initializeUsersForm();
  }

  private initializeUsersForm(): void {
    this.usersForm = new FormGroup({
      usersName: new FormControl("", [
        Validators.required
      ]),
      usersAge: new FormControl("", [
        Validators.required
      ])
    });
  }

  private newUserAdded(user): void {
    this.users.unshift(user);
  }

  public addNewUser(form): void {
    if(this.users.find(user => user.name === this.usersForm.controls.usersName.value)){
      this.error = `Their is already a user named ${this.usersForm.controls.usersName.value}`;
      return;
    }
    if(this.usersForm.valid){
      this.error = null;
      this.httpService.xhr("addUser", this.usersForm.value).then(function(){}).catch(console.error);
    }
    form.resetForm();
    this.initializeUsersForm();
  }

  public resetForm(): void {
    this.error = null;
    this.usersForm.reset();
  }

}
