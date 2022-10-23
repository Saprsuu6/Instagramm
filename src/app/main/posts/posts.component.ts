import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Client, Post } from '../../interfaces/interfaces';
import { CurrentClientService } from '../../services/current-client.service';
import { ClientsService } from '../../services/clients.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  @Input('client') client: Client;
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
    private router: Router
  ) {}

  doSmth(action: string, ...args: any): void {
    if (this.currentClient.client !== undefined) {
      switch (action) {
        case 'remove':
          this.idPostRemove = args[0].id;
          this.removePost(args[0]);
          break;
        case 'StopTimer':
          this.StopTimer();
          break;
      }
    } else {
      this.router.navigate(['/form']);
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

    this.client.content?.splice(
      this.client.content.findIndex((content) => content.id === post.id),
      1
    );

    this.client.content?.map((post, index) => {
      post.id = index + 1;
    });

    this.clients.getClient(post.client_id).subscribe((responce) => {
      responce.content = this.client.content;

      this.clients
        .updateClient(responce)
        .subscribe((responce) => console.log(responce));
    });

    this.StopTimer();
  }

  ngOnInit(): void {}
}
