import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NewsComponent } from './news.component';
import { NewsService } from '../../services/api.service';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;
  let newsService: NewsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewsComponent],
      imports: [HttpClientTestingModule],
      providers: [NewsService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    newsService = TestBed.inject(NewsService);
    fixture.detectChanges();
  });

  it('should fetch news items', async () => {
    spyOn(newsService, 'getNewsIds').and.returnValue(Promise.resolve([1, 2, 3]));
    spyOn(newsService, 'getNewsItem').and.callFake(async (id: number) => {
      return { id, title: `News ${id}`, kids: [101, 102] };
    });
    spyOn(component, 'getComments').and.returnValue(Promise.resolve(['Comment 1', 'Comment 2']));

    await component.fetchNews();

    expect(component.newsItems.length).toBe(3);
    expect(component.startIndex).toBe(component.batchSize);
    expect(component.loading).toBe(false);
  });

  it('should handle error when fetching news item', async () => {
    spyOn(newsService, 'getNewsIds').and.returnValue(Promise.resolve([1, 2, 3]));
    spyOn(newsService, 'getNewsItem').and.returnValue(Promise.reject('Fake error'));

    await component.fetchNews();

    expect(component.newsItems.length).toBe(0);
    expect(component.loading).toBe(false);
  });

  it('should handle error when fetching news', async () => {
    spyOn(newsService, 'getNewsIds').and.returnValue(Promise.reject('Fake error'));

    await component.fetchNews();

    expect(component.newsItems.length).toBe(0);
    expect(component.loading).toBe(false);
  });

  it('should fetch comments for news items', async () => {
    const mockNewsIds = [1, 2, 3];
    spyOn(newsService, 'getNewsIds').and.returnValue(Promise.resolve(mockNewsIds));
    spyOn(newsService, 'getNewsItem').and.callFake(async (id: number) => {
      return { id, title: `News ${id}`, kids: [101, 102] };
    });
    spyOn(component, 'getComments').and.callThrough();

    await component.fetchNews();

    expect(component.getComments).toHaveBeenCalled();
    expect(component.getComments).toHaveBeenCalledWith([101, 102]);
  });

  it('should load more news items when loadMore is called', async () => {
    const fetchNewsSpy = spyOn(component, 'fetchNews').and.callThrough();

    component.loadMore();

    expect(fetchNewsSpy).toHaveBeenCalled();
  });

});
