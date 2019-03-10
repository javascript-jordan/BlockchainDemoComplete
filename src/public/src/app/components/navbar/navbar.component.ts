import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'blockchain-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnDestroy {

  public navItems: any[] = [
    {
      name: "Users",
      link: "users",
      icon: "fa-users"
    },
    {
      name: "Wallets",
      link: "wallets",
      icon: "fa-usd"
    },
    {
      name: "Exchange",
      link: "exchange",
      icon: "fa-exchange"
    },
    {
      name: "Blockchain",
      link: "blockchain",
      icon: "fa-link"
    }
  ];
  public isOnHomePage: boolean;

  private router: Router;
  private routeChangeSubscriber: Subscription;

  constructor(router: Router) {
    this.router = router;
    this.routeChangeSubscriber = this.router.events.subscribe({
      next: event => {
        if(event instanceof NavigationEnd){
          this.setActiveTab(event.url);
          this.isOnHomePage = event.url === "/home" || event.url === "/";
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.routeChangeSubscriber.unsubscribe();
  }

  public route(path): void {
    this.router.navigateByUrl(path)
  }

  private setActiveTab(current): void {
    this.navItems.forEach(item => item.active = current.substring(1, current.length) === item.link);
  }

}
