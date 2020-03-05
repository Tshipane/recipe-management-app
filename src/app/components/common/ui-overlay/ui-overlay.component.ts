import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../../services/shared/shared.service';

@Component({
  selector: 'app-ui-overlay',
  templateUrl: './ui-overlay.component.html',
  styleUrls: ['./ui-overlay.component.css']
})
export class UiOverlayComponent implements OnInit {

  constructor(public sharedService: SharedService) {
  }

  ngOnInit(): void {
  }

}
