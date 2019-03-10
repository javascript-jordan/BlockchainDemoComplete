import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private httpclient: HttpClient;
  private base: string = "http://localhost:3000";
  private uriMap: { [key: string]: any } = {
    addUser: {
      method: "post",
      uri: "/users"
    },
    getUsers: {
      method: "get",
      uri: "/users"
    },
    addWallet: {
      method: "post",
      uri: "/wallets"
    },
    getWallets: {
      method: "get",
      uri: "/wallets"
    },
    addTrade: {
      method: "post",
      uri: "/trades"
    },
    getTrades: {
      method: "get",
      uri: "/trades"
    },
    getBlocks: {
      method: "get",
      uri: "/blocks"
    }
  }

  constructor(httpClient: HttpClient) {
    this.httpclient = httpClient;
  }

  public xhr(uriMappingItem: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let uriObject = this.uriMap[uriMappingItem];
      if(!uriObject) return reject();
      switch(uriObject.method){
        case "post":
          this.httpclient.post(this.base + uriObject.uri, data, {}).toPromise().then(resolve).catch(reject);
          break;
        case "get":
          this.httpclient.get(this.base + uriObject.uri, {}).toPromise().then(resolve).catch(reject);
          break;
        default:
          throw new Error("Http method not found");
      }
    });
  }
}
