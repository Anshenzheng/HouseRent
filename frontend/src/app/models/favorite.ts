export interface Favorite {
  id: number;
  house: {
    id: number;
    title: string;
    price: number;
    area: number;
    bedroom: number;
    city: string;
    district: string;
    images?: string;
  };
  createdAt: string;
}
