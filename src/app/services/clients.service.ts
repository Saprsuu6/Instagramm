import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../interfaces/interfaces';

// const bcrypt = require('bcrypt');

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  constructor(private clients: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.clients.get('http://localhost:3000/clients') as Observable<
      Client[]
    >;
  }

  addclient(client: Client) {
    client.selfInfo = {
      avatar: '../../../assets/clientPictures/user.png',
      age: 0,
      name: '',
      surename: '',
      email: '',
      phone: '',
      bio: '',
    };
    client.content = [];

    return this.clients.post('http://localhost:3000/clients', client);
  }

  updateClient(client: Client) {
    return this.clients.put(
      `http://localhost:3000/clients/${client.id}`,
      client
    );
  }

  getClient(id: number): Observable<Client> {
    return this.clients.get(
      `http://localhost:3000/clients/${id}`
    ) as Observable<Client>;
  }
}
