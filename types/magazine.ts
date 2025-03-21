export interface PoetryItem {
  id: number;
  frontmatter?: boolean;
  section?: boolean;
  pageNumber?: number;
  title: string;
  content: string; // Markdown format
  author: string;
  classroom: string;
  url: string; // URL of scanned image (jpg)
}

export interface FilterState {
  authors: string[];
  classrooms: string[];
}
