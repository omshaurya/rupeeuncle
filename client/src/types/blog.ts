export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface BlogAuthor {
  name: string;
  bio?: string;
  avatar?: string;
}

export interface BlogCategory {
  _id?: string;
  name: string;
  slug: string;
}

export interface BlogListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: { url: string; alt?: string };
  category: BlogCategory;
  tags: string[];
  author: BlogAuthor;
  readingTimeMinutes: number;
  publishedAt: string;
  views?: number;
}

export interface BlogPost extends BlogListItem {
  content: string;
  tableOfContents: TocItem[];
  faqs: { question: string; answer: string }[];
  relatedPosts: BlogListItem[];
  relatedCalculators: {
    _id: string;
    name: string;
    slug: string;
    shortDescription: string;
    icon?: string;
  }[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: T[];
}
