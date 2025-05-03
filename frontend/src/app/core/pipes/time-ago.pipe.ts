import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    const now = new Date();
    const date = new Date(value);
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // DAY FORMATS: Today, Yesterday, X days ago
    if (diffInDays < 1) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffInDays} days ago`;
    }
  }
}
