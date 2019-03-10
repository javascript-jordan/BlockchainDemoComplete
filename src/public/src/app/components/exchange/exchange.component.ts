import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpService } from 'src/app/services/http.service';
import { currencies } from '../../../assets/data';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'blockchain-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.less']
})
export class ExchangeComponent implements OnInit {

  public users: any[] = [];
  public trades: any[] = [];
  public error: string = "";
  public fromId: number;
  public fromCurrency: string;
  public toId: number;
  public toCurrency: string;
  public currencies = currencies;
  public tradeForm = new FormGroup({
    from: new FormControl("", [
      Validators.required
    ]),
    fromCurrency: new FormControl("", [
      Validators.required
    ]),
    fromCurrencyAmount: new FormControl("", [
      Validators.required,
      Validators.min(1),
      Validators.max(9999)
    ]),
    to: new FormControl("", [
      Validators.required
    ]),
    toCurrency: new FormControl("", [
      Validators.required
    ]),
    toCurrencyAmount: new FormControl("", [
      Validators.required,
      Validators.min(1),
      Validators.max(9999)
    ])
  });

  private httpService: HttpService;
  private errorMap: any = {
    "same-user": "You can't trade with yourself.",
    "sender-has-no-currency": "Sender doesn't own this currency.",
    "receiver-has-no-currency": "Receiver doesn't own this currency.",
    "sender-not-enough-currency": "Sender doesn't have enough currency.",
    "receiver-not-enough-currency": "Receiver doesn't have enough currency."
  }

  constructor(socket: Socket, httpService: HttpService) {
    this.httpService = httpService;
    this.updateTrades();
    socket.on("addNewTrade", this.updateTrades.bind(this));
  }

  private updateUsers(): Promise<any> {
    let self = this;
    return new Promise(resolve => {
      Promise.all([
        this.httpService.xhr("getUsers"),
        this.httpService.xhr("getWallets")
      ]).then(data => {
        let i = data[0].data.length - 1;
        for(; i >=0; i--){
          let user = data[0].data[i],
            wallet = data[1].data.find(wallet => wallet.owner === user.id);
          user.currency = Object.keys(wallet.currency).map(key => {
            return {
              currency: currencies.find(currency => currency.id === key).name,
              amount: wallet.currency[key]
            }
          });
        }
        self.users = data[0].data;
        resolve();
      });
    });
  }

  private mapTradeToUsers(trades: any[]): any {
    function findUser(id): any {
      return this.users.find(user => user.id === id).name;
    }
    trades.forEach(trade => {
      trade.sender.name = findUser.call(this, trade.sender.id);
      trade.receiver.name = findUser.call(this, trade.receiver.id);
    });
    return trades.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1);
  }

  private updateTrades(): void {
    this.updateUsers().then(data => {
      return this.httpService.xhr("getTrades");
    }).then(response => {
      this.trades = this.mapTradeToUsers(response.data);
    }).catch(console.error);
  }

  ngOnInit() {
  }

  public resetForm(form): void {
    this.error = null;
    form.resetForm()
    this.tradeForm.reset();
    this.fromId = null;
    this.fromCurrency = null;
    this.toId = null;
    this.toCurrency = null;
    try {
      setTimeout(() => {
        Array.from(document.querySelectorAll("mat-form-field")).forEach(element => {
          element.classList.remove("mat-form-field-invalid", "ng-dirty", "ng-invalid")
        });
        Array.from(document.querySelectorAll("mat-select")).forEach(element => {
          element.classList.remove("ng-invalid", "mat-select-invalid", "ng-dirty", "ng-touched");
        });
      }, 100);
    } catch (error) {
      
    }
  }

  public submitTrade(form): void {
    if(this.isFormValid()){
      let data = {
        sender: {
          id: this.fromId,
          currency: this.fromCurrency,
          amount: this.tradeForm.controls.fromCurrencyAmount.value
        },
        receiver: {
          id: this.toId,
          currency: this.toCurrency,
          amount: this.tradeForm.controls.toCurrencyAmount.value
        }
      }
      this.httpService.xhr("addTrade", data).then(data => {
        if(data.error){
          return this.error = this.errorMap[data.error];
        }else{
          this.resetForm(form);
        }
      }).catch(console.error);
    }
  }

  public isFormValid(): boolean {
    return Boolean(this.toId && this.fromId && this.toCurrency && this.fromCurrency && this.tradeForm.controls.toCurrencyAmount.valid && this.tradeForm.controls.fromCurrencyAmount.valid);
  }

}
