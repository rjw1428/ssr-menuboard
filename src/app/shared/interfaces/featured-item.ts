import { Upload } from './upload';

export interface FeaturedItem {
  pageTitle: string;
  itemTitle?: string;
  itemCaption?: string;
  img: Upload;
  active: boolean;
  child: boolean;
  startDate?: string;
  endDate?: string;
  lastModified: string;
  layout: string;
}
