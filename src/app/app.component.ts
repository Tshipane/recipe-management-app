import {Component} from '@angular/core';
import {SharedService} from './services/shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public sharedService: SharedService) {
  }

  logout(): void {
    this.sharedService.logout();
  }
}
