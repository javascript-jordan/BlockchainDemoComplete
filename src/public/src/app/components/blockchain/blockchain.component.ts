import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'blockchain-blockchain',
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.less']
})
export class BlockchainComponent implements OnInit {

  public blocks: any[];

  private httpService: HttpService;

  constructor(httpService: HttpService, socket: Socket) {
    this.httpService = httpService;
    this.getBlocks();
    socket.on("addNewBlock", this.getBlocks.bind(this));
  }

  ngOnInit() {
  }

  private getBlocks(): void {
    this.httpService.xhr("getBlocks").then(response => {
      this.blocks = response.data.sort((a, b) => a.height < b.height ? -1 : 1);
      console.log(this.blocks);
      
    }).catch(console.error);
  }

  public getDate(time: number): string {
    return new Date(time).toJSON();
  }

}
