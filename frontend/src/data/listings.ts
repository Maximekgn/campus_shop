import { Listing, ListingType, ListingStatus } from '../types';

export const mockListings: Listing[] = [
  {
    id: 'l1',
    user_id: 'u1',
    title: 'Livre de Physique Quantique',
    description: 'Très bon état, peu utilisé. Indispensable pour la L2.',
    type: ListingType.SALE,
    price: 10000,
    status: ListingStatus.PUBLISHED,
    views_count: 42,
    photos: [{ id: 'p1', listing_id: 'l1', path: 'https://picsum.photos/700/500?random=1', order: 1 }],
    created_at: new Date().toISOString(),
  },
  {
    id: 'l2',
    user_id: 'u3',
    title: 'Calculatrice TI-83 Premium',
    description: 'Donne suite à l\'obtention du diplôme. Fonctionne parfaitement.',
    type: ListingType.GIFT,
    price: null,
    status: ListingStatus.PUBLISHED,
    views_count: 125,
    photos: [{ id: 'p2', listing_id: 'l2', path: 'https://picsum.photos/700/500?random=2', order: 1 }],
    created_at: new Date().toISOString(),
  },
  {
    id: 'l3',
    user_id: 'u1',
    title: 'Sweat Campus XL',
    description: 'Échange contre un taille L ou vend 6500 FCFA.',
    type: ListingType.SWAP,
    price: 6500,
    status: ListingStatus.RESERVED,
    views_count: 18,
    photos: [{ id: 'p3', listing_id: 'l3', path: 'https://picsum.photos/700/500?random=3', order: 1 }],
    created_at: new Date().toISOString(),
  }
];
