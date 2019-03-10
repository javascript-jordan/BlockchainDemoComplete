import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { HttpService } from 'src/app/services/http.service';
import { currencies } from '../../../assets/data';

@Component({
  selector: 'blockchain-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.less']
})
export class WalletsComponent implements OnInit {

  public users: any[] = [];
  public wallets: any[] = [];
  public walletForm: FormGroup;
  public selectedUser: any = null;
  public selectedCurrency: any = null;
  public resetting: boolean = false;
  public currencies = currencies;

  private httpService: HttpService;

  constructor(socket: Socket, httpService: HttpService) {
    this.httpService = httpService;
    this.update();
    socket.on("addNewWallet", this.update.bind(this));
    socket.on("addNewUser", this.updateUsers.bind(this));
  }

  ngOnInit() {
    this.initializeWalletForm();
  }

  private update(): Promise<any> {
    return Promise.all([this.updateUsers(),this.updateWallets()]).then(this.setUsersCurrencies.bind(this));
  }

  private updateUsers(): Promise<any> {
    return this.httpService.xhr("getUsers").then(response => this.users = response.data);
  }

  private updateWallets(): Promise<any> {
    return this.httpService.xhr("getWallets").then(response => this.wallets = response.data);
  }

  private initializeWalletForm(): void {
    this.walletForm = new FormGroup({
      usersId: new FormControl("", [
        Validators.required
      ]),
      currencyType: new FormControl("", [
        Validators.required
      ]),
      currencyAmount: new FormControl("", [
        Validators.required,
        Validators.min(1),
        Validators.max(9999),
        Validators.maxLength(4)
      ])
    })
  }

  public fundWallet(form): void {
    if(this.walletForm.controls.currencyAmount.valid && this.selectedCurrency && this.selectedUser){
      let data = {
        owner: this.selectedUser,
        currency: this.selectedCurrency,
        amount: this.walletForm.controls.currencyAmount.value
      }
      this.httpService.xhr("addWallet", data).catch(console.error);
    }
    this.resetForm(form);
  }

  public resetForm(form): void {
    form.resetForm();
    this.selectedCurrency = null;
    this.selectedUser = null;
    setTimeout(() => {
      try {
        document.querySelectorAll("mat-form-field").forEach(element => {
          element.classList.remove("ng-invalid", "ng-touched", "ng-dirty", "mat-form-field-invalid");
        });
        document.querySelectorAll("mat-select").forEach(element => {
          element.classList.remove("ng-invalid", "ng-touched", "ng-dirty", "mat-select-invalid");
        });
      } catch (error) {
        
      }
    }, 50);
  }

  public setUsersCurrencies(id: number): void {
    let self = this;
    this.users.forEach(user => {
      let wallet = self.wallets.find(wallet => wallet.owner === user.id);
      user.currencies = Object.keys(wallet.currency).map(key => {
        return {
          currency: currencies.find(currency => currency.id === key).name,
          amount: wallet.currency[key]
        }
      });
    });
  }

  public changeUser(): void {

  }

}
