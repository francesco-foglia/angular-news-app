import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/api.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  newsItems: any[] = [];
  loading = false;
  startIndex = 0;
  batchSize = 10;
  errorMessage = '';

  constructor(public newsService: NewsService) { }

  ngOnInit(): void {
    this.fetchNews();
  }

  async fetchNews(): Promise<void> {
    try {
      this.loading = true;
      const newsIds = await this.newsService.getNewsIds();
      const batchIds = newsIds.slice(this.startIndex, this.startIndex + this.batchSize);

      const newsItems = await Promise.all(batchIds.map(async (id: number) => {
        try {
          const newsItem = await this.newsService.getNewsItem(id);
          if (newsItem && newsItem.kids && newsItem.kids.length > 0) {
            newsItem.comments = await this.getComments(newsItem.kids);
          }
          return newsItem;
        } catch (error) {
          this.errorMessage = 'Error retrieving news comments';
          return null;
        }
      }));

      this.newsItems = [...this.newsItems, ...newsItems.filter(item => item !== null)];
      this.startIndex += this.batchSize;
      this.loading = false;
    } catch (error) {
      this.errorMessage = 'Error retrieving news';
      this.loading = false;
    }
  }

  async getComments(kidsIds: number[]): Promise<any[]> {
    const commentsPromises = kidsIds.map((kidId: number) => this.newsService.getNewsItem(kidId));
    const comments = await Promise.all(commentsPromises);
    return comments.filter(comment => comment !== null);
  }

  loadMore(): void {
    this.fetchNews();
  }

}
