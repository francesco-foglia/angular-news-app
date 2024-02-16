import { TestBed } from '@angular/core/testing';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { NewsService } from './api.service';

describe('NewsService', () => {
  let service: NewsService;
  let mockAxios: any;
  const baseUrl = 'https://hacker-news.firebaseio.com/v0/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsService]
    });
    service = TestBed.inject(NewsService);
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should retrieve news ids', async () => {
    const mockIds = [1, 2, 3];
    mockAxios.onGet(`${baseUrl}newstories.json`).reply(200, mockIds);

    const newsIds = await service.getNewsIds();

    expect(newsIds).toEqual(mockIds);
  });

  it('should retrieve news item', async () => {
    const mockNewsItem = { id: 1, title: 'Mock News Item' };
    const mockId = 1;
    mockAxios.onGet(`${baseUrl}item/${mockId}.json`).reply(200, mockNewsItem);

    const newsItem = await service.getNewsItem(mockId);

    expect(newsItem).toEqual(mockNewsItem);
  });

});
