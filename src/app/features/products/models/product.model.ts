export interface Product {
  id: number;
  name: string;
  brand: string;
  brandId?: number;
  price: number;
  imageUrl: string;
  images?: { id: number; url: string }[];
  description: string;
  wished?: boolean;
  availableSizes: string[];
  sizeIds?: number[];
  sizes?: { id: number, name: string }[];
  mappedSizes?: { id: number, name: string }[];
  sizeStocks?: { [key: number]: number };
  gender: string;
  genderId?: number;
  isActive?: boolean;
}
