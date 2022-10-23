import { Injectable } from '@angular/core';
import { Client } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CurrentClientService {
  client: Client

  constructor() { }
}
