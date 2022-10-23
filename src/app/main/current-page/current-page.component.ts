import {
  Component,
  OnInit,
  ElementRef,
  AfterViewChecked,
  ViewChildren,
  ViewChild,
} from '@angular/core';
import { Client, Post } from '../../interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../services/clients.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CurrentClientService } from '../../services/current-client.service';

@Component({
  selector: 'app-current-page',
  templateUrl: './current-page.component.html',
  styleUrls: ['./current-page.component.css'],
})
export class CurrentPageComponent implements OnInit, AfterViewChecked {
  owner: Client;
  @ViewChildren('post') post: ElementRef<HTMLImageElement>[];
  @ViewChild('modal') modal: ElementRef<HTMLDivElement>;
  targetString: string;
  timer = {
    temp: false,
    timeLeft: 10,
    timer: 0,
    interval: 0,
  };
  idPostRemove: number;

  constructor(
    private currentClient: CurrentClientService,
    private clients: ClientsService,
    private router: ActivatedRoute,
    private rout: Router
  ) {}

  ////////////////////////////

  getCurrentClient() {
    return this.currentClient.client;
  }

  doSmth(action?: string, ...args: any): void {
    if (this.owner !== undefined) {
      switch (action) {
        case 'remove':
          this.idPostRemove = args[0].id;
          this.removePost(args[0]);
          break;
        case 'StopTimer':
          this.StopTimer();
          break;
        case 'CheckClient':
          this.checkClient();
          break;
      }
    } else {
      this.rout.navigate(['/form']);
    }
  }

  private checkClient(): void {
    if (this.currentClient.client === undefined) {
      this.rout.navigate(['/form']);
    }
  }

  public removePost(post: Post): void {
    this.timer.temp = true;

    this.timer.timer = window.setTimeout(() => {
      if (this.timer.temp === true) {
        window.clearInterval(this.timer.interval);
        this.removePostStrict(post);
      }
    }, 10000);

    this.timer.interval = window.setInterval(() => {
      if (this.timer.temp === true) {
        this.timer.timeLeft -= 1;
      }
    }, 1000);
  }

  private StopTimer(): void {
    window.clearTimeout(this.timer.timer);
    window.clearInterval(this.timer.interval);

    this.timer.temp = false;
    this.timer.timeLeft = 10;
  }

  private removePostStrict(post: Post): void {
    window.clearTimeout(this.timer.timer);
    window.clearInterval(this.timer.interval);

    this.owner.content?.splice(
      this.owner.content.findIndex((content) => content.id === post.id),
      1
    );

    this.owner.content?.map((post, index) => {
      post.id = index + 1;
    });

    this.clients.getClient(post.client_id).subscribe((responce) => {
      responce.content = this.owner.content;

      this.clients
        .updateClient(responce)
        .subscribe((responce) => console.log(responce));
    });

    this.StopTimer();
  }

  ////////////////////////////

  ngOnInit(): void {
    let id = this.router.snapshot.params['id'];
    this.clients.getClient(id).subscribe((responce) => {
      this.owner = responce;
    });
  }

  ngAfterViewChecked(): void {
    if (this.owner !== undefined) {
      this.targetString = this.owner.login;

      this.post.forEach((element, index) => {
        element.nativeElement.attributes[4].nodeValue = '#post' + (index + 1);
      });
    }
  }
}
