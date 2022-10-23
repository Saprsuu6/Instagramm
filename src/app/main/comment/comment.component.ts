import { Component, Input, OnInit } from '@angular/core';
import { Comment, Post, Client } from '../../interfaces/interfaces';
import { CurrentClientService } from '../../services/current-client.service';
import { ClientsService } from '../../services/clients.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  @Input('comment') comment: Comment;
  @Input('post') post: Post;
  likeComment = {
    like: false,
    url: '../../../assets/resources/unlike.png',
  };
  comments = false;
  owner: Client;
  timer = {
    temp: false,
    timeLeft: 10,
    timer: 0,
    interval: 0,
  };
  readMore: boolean = false;

  constructor(
    private currentClient: CurrentClientService,
    private clients: ClientsService,
    private router: Router
  ) {}

  doSmth(action: string): void {
    if (this.currentClient.client !== undefined) {
      switch (action) {
        case 'like':
          this.changeCommentLike();
          break;
        case 'removeComment':
          this.removeComment();
          break;
        case 'StopTimer':
          this.StopTimer();
          break;
      }
    } else {
      this.router.navigate(['/form']);
    }
  }

  private removeComment(): void {
    this.timer.temp = true;

    this.timer.timer = window.setTimeout(() => {
      if (this.timer.temp === true) {
        window.clearInterval(this.timer.interval);
        this.removeCommentStrict();
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

  private removeCommentStrict(): void {
    window.clearTimeout(this.timer.timer);
    window.clearInterval(this.timer.interval);

    this.post.comments?.splice(
      this.post.comments?.findIndex(
        (comment) => comment.id === this.comment.id
      ),
      1
    );

    this.post.comments?.map((comment, index) => {
      comment.id = index + 1;
    });

    this.clients.getClient(this.post.client_id).subscribe((responce) => {
      responce.content?.find((post) => {
        if (post.id === this.post.id) {
          post.comments = this.post.comments;
        }
      });

      this.clients
        .updateClient(responce)
        .subscribe((responce) => console.log(responce));
    });

    this.StopTimer();
  }

  private changeCommentLike(): void {
    this.likeComment.like = !this.likeComment.like;
    if (this.likeComment.like === true) {
      this.likeComment.url = '../../../assets/resources/like.png';

      if (
        this.comment.likes.find(
          (client) => client.client_id === this.currentClient.client.id
        ) === undefined
      ) {
        this.comment.likes.push({
          client_id: this.currentClient.client.id as number,
        });
      }

      this.updateCommentLike();
    } else {
      this.likeComment.url = '../../../assets/resources/unlike.png';

      this.comment.likes.splice(
        this.comment.likes.findIndex(
          (client) => client.client_id === this.currentClient.client.id
        ),
        1
      );

      this.updateCommentLike();
    }
  }

  private updateCommentLike(): void {
    this.clients.getClient(this.post.client_id).subscribe((responce) => {
      responce.content
        ?.find((post) => post.id === this.post.id)
        ?.comments?.map((comment) => {
          if (comment.id === this.comment.id) {
            comment.likes = this.comment.likes;
          }
        });

      this.clients
        .updateClient(responce)
        .subscribe((responce) => console.log(responce));
    });
  }

  checkOwner(): boolean {
    return this.currentClient.client !== undefined &&
      this.currentClient.client.id === this.comment.client_id
      ? true
      : false;
  }

  ngOnInit(): void {
    if (this.currentClient.client !== undefined) {
      if (
        this.comment.likes.find(
          (client) => client.client_id === this.currentClient.client.id
        ) !== undefined
      ) {
        this.likeComment.url = '../../../assets/resources/like.png';
        this.likeComment.like = true;
      }
    }

    this.clients
      .getClient(this.comment.client_id)
      .subscribe((request) => (this.owner = request));
  }
}
