import {
  AfterViewChecked,
  Component,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CurrentClientService } from './services/current-client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewChecked {
  @ViewChild('target') target: ElementRef<HTMLImageElement>;
  targetString: string;

  constructor(
    private currentClient: CurrentClientService,
    private router: Router
  ) {}

  chekForClient(): boolean {
    return this.currentClient.client !== undefined ? true : false;
  }

  goToCurrentPage() {
    this.router.navigate(['/current-page', this.currentClient.client.id]);
  }

  ngAfterViewChecked(): void {
    if (this.chekForClient()) {
      this.targetString = this.currentClient.client.login;

      this.target.nativeElement.attributes[4].nodeValue =
        '#' + this.targetString;
    }
  }
}
