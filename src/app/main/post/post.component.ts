import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from 'src/app/interfaces/interfaces';
import { CurrentClientService } from '../../services/current-client.service';
import { ClientsService } from '../../services/clients.service';
import { Client, Comment } from '../../interfaces/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input('post') post: Post;
  @Input('timer') timer: {
    temp: boolean;
    timeLeft: number;
    timer: number;
    interval: number;
  };
  like = {
    like: false,
    url: '../../../assets/resources/unlike.png',
  };
  save = {
    save: false,
    url: '../../../assets/resources/unsave.png',
  };
  readMore = false;
  owner: Client;
  comments = false;
  stringComment: string = '';
  @Output('remove') remove = new EventEmitter<Post>();

  constructor(
    private currentClient: CurrentClientService,
    private clients: ClientsService,
    private router: Router
  ) {}

  goToCurrentPage() {
    this.router.navigate(['/current-page', this.owner.id]);
  }
  
  doSmth(action: string): void {
    if (this.currentClient.client !== undefined) {
      switch (action) {
        case 'like':
          this.changeLike();
          break;
        case 'save':
          this.changeSave();
          break;
        case 'addComment':
          this.addComment();
          break;
        case 'removePost':
          this.removePost();
          break;
      }
    } else {
      this.router.navigate(['/form']);
    }
  }

  private removePost(): void {
    this.remove.emit(this.post);
  }

  private addComment(): void {
    let newComment: Comment = {
      id: (this.post.comments?.length as number) + 1,
      client_id: this.currentClient.client.id as number,
      comment: this.stringComment,
      likes: [],
      date: new Date(),
    };

    this.post.comments?.push(newComment);

    this.clients.getClient(this.post.client_id).subscribe((responce) => {
      responce.content?.map((post) => {
        if (post.id === this.post.id) {
          post.comments = this.post.comments;
        }
      });

      this.clients
        .updateClient(responce)
        .subscribe((responce) => console.log(responce));
    });

    this.stringComment = '';
  }

  private changeLike(): void {
    this.like.like = !this.like.like;
    if (this.like.like === true) {
      this.like.url = '../../../assets/resources/like.png';

      if (
        this.post.likes.find(
          (client) => client.client_id === this.currentClient.client.id
        ) === undefined
      ) {
        this.post.likes.push({
          client_id: this.currentClient.client.id as number,
        });
      }

      this.updateLikes();
    } else {
      this.like.url = '../../../assets/resources/unlike.png';

      this.post.likes.splice(
        this.post.likes.findIndex(
          (client) => client.client_id === this.currentClient.client.id
        ),
        1
      );

      this.updateLikes();
    }
  }

  private updateLikes() {
    this.clients.getClient(this.post.client_id).subscribe((responce) => {
      responce.content?.map((post) => {
        if (post.id === this.post.id) {
          post.likes = this.post.likes;
        }
      });

      this.clients
        .updateClient(responce)
        .subscribe((responce) => console.log(responce));
    });
  }

  private changeSave(): void {
    this.save.save = !this.save.save;
    if (this.save.save === true) {
      this.save.url = '../../../assets/resources/save.png';

      if (
        this.post.saves.find(
          (client) => client.client_id === this.currentClient.client.id
        ) === undefined
      ) {
        this.post.saves.push({
          client_id: this.currentClient.client.id as number,
        });
      }

      this.updateSaves();
    } else {
      this.save.url = '../../../assets/resources/unsave.png';

      this.post.saves.splice(
        this.post.saves.findIndex(
          (client) => client.client_id === this.currentClient.client.id
        ),
        1
      );

      this.updateSaves();
    }
  }

  private updateSaves() {
    this.clients.getClient(this.post.client_id).subscribe((responce) => {
      responce.content?.map((post) => {
        if (post.id === this.post.id) {
          post.saves = this.post.saves;
        }
      });

      this.clients
        .updateClient(responce)
        .subscribe((responce) => console.log(responce));
    });

    this.clients
      .updateClient(this.currentClient.client)
      .subscribe((responce) => console.log(responce));
  }

  checkOwner(): boolean {
    return this.currentClient.client !== undefined &&
      this.currentClient.client.id === this.post.client_id
      ? true
      : false;
  }

  ngOnInit(): void {
    this.clients.getClient(this.post.client_id).subscribe((responce) => {
      this.owner = responce;
    });

    if (this.currentClient.client !== undefined) {
      if (
        this.post.likes.find(
          (client) => client.client_id === this.currentClient.client.id
        ) !== undefined
      ) {
        this.like.url = '../../../assets/resources/like.png';
        this.like.like = true;
      }

      if (
        this.post.saves.find(
          (client) => client.client_id === this.currentClient.client.id
        ) !== undefined
      ) {
        this.save.url = '../../../assets/resources/save.png';
        this.save.save = true;
      }
    }
  }
}
