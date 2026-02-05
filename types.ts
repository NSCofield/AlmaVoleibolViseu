export interface NewsItem {
  id: string;
  created_at: string;
  title: string;
  content: string;
  image_url: string;
}

export interface Match {
  id: string;
  date: string;
  home_team: string;
  guest_team: string;
  location: string;
  score_home?: number;
  score_guest?: number;
  category: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
}

export interface Partner {
  id: string;
  name: string;
  website_url: string;
  logo_url: string;
}

export interface Team {
  id: string;
  name: string;
  category: string; // e.g., Séniores Masculinos, Iniciados
  description: string;
  image_url: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
}

export interface User {
  id: string;
  email: string;
}
