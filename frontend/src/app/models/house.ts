export interface House {
  id: number;
  landlord: {
    id: number;
    username: string;
    realName?: string;
    phone?: string;
  };
  title: string;
  description?: string;
  province: string;
  city: string;
  district: string;
  address?: string;
  price: number;
  area: number;
  bedroom: number;
  livingRoom?: number;
  bathroom?: number;
  orientation?: string;
  floor?: string;
  decoration?: string;
  houseType?: string;
  images?: string;
  facilities?: string;
  status: string;
  createdAt: string;
}

export interface HouseRequest {
  title: string;
  description?: string;
  province: string;
  city: string;
  district: string;
  address?: string;
  price: number;
  area: number;
  bedroom: number;
  livingRoom?: number;
  bathroom?: number;
  orientation?: string;
  floor?: string;
  decoration?: string;
  houseType?: string;
  images?: string;
  facilities?: string;
}

export interface HouseFilter {
  keyword?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedroom?: number;
  houseType?: string;
  decoration?: string;
}
