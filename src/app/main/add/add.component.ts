import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Client, Post } from '../../interfaces/interfaces';
import { CurrentClientService } from '../../services/current-client.service';
import { ClientsService } from '../../services/clients.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {
  @Input('client') client: Client;
  @ViewChild('file') file: ElementRef<HTMLInputElement>;
  link = '';
  describe = '';

  constructor(private clients: ClientsService) {}

  add(): void {
    let newPost: Post = {
      id: (this.client.content?.length as number) + 1,
      client_id: this.client.id as number,
      image: this.link,
      description: this.describe,
      comments: [],
      likes: [],
      saves: [],
      date: new Date(),
    };

    this.client.content?.push(newPost);

    this.clients.getClient(this.client.id as number).subscribe((responce) => {
      responce.content?.push(newPost);
      this.clients
        .updateClient(responce)
        .subscribe((responce) => console.log(responce));
    });

    this.clear();
  }

  clear(): void {
    this.file.nativeElement.value = '';
    this.link = '';
    this.describe = '';
  }

  setLinkPicture(): void {
    this.link =
      '../../../assets/testPictures/' +
      (this.file.nativeElement.files as FileList)[0].name;
  }

  ngOnInit(): void {}
}
