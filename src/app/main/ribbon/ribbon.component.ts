import { Component, OnInit } from '@angular/core';
import { Client } from '../../interfaces/interfaces';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-ribbon',
  templateUrl: './ribbon.component.html',
  styleUrls: ['./ribbon.component.css'],
})
export class RibbonComponent implements OnInit {
  localClients: Client[];

  constructor(private clients: ClientsService) {}

  ngOnInit(): void {
    this.clients.getClients().subscribe((responce) => {
      this.localClients = responce;
    });
  }
}
