import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private baseUrl = 'https://hacker-news.firebaseio.com/v0/';

  constructor() { }

  async getNewsIds(): Promise<number[]> {
    const response = await axios.get<number[]>(`${this.baseUrl}newstories.json`);
    return response.data;
  }

  async getNewsItem(id: number): Promise<any> {
    const response = await axios.get<any>(`${this.baseUrl}item/${id}.json`);
    return response.data;
  }
}
