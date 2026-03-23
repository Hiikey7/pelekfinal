import property1 from '@/assets/property-1.jpg';
import property2 from '@/assets/property-2.jpg';
import property3 from '@/assets/property-3.jpg';
import property4 from '@/assets/property-4.jpg';
import property5 from '@/assets/property-5.jpg';
import property6 from '@/assets/property-6.jpg';

export type PropertyCategory = 'airbnb' | 'rental' | 'sale';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  priceLabel: string;
  rating: number;
  reviews: number;
  category: PropertyCategory;
  type: string;
  image: string;
  images: string[];
  description: string;
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  guests?: number;
  featured: boolean;
  whatsapp: string;
  lat: number;
  lng: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export const properties: Property[] = [
  {
    id: '1',
    title: 'Luxury Ocean View Villa',
    location: 'Diani Beach, Kenya',
    price: 25000,
    priceLabel: 'KSh 25,000/night',
    rating: 4.9,
    reviews: 124,
    category: 'airbnb',
    type: 'Villa',
    image: property1,
    images: [property1, property2, property3],
    description: 'Experience luxury living in this stunning ocean-view villa with infinity pool, private beach access, and world-class amenities. Perfect for families and groups looking for an unforgettable getaway.',
    amenities: ['WiFi', 'Pool', 'Kitchen', 'Parking', 'Beach Access', 'AC', 'BBQ', 'Garden'],
    bedrooms: 4,
    bathrooms: 3,
    guests: 8,
    featured: true,
    whatsapp: '+254700000000',
    lat: -4.2767,
    lng: 39.5931,
  },
  {
    id: '2',
    title: 'Beachfront Cottage Retreat',
    location: 'Malindi, Kenya',
    price: 12000,
    priceLabel: 'KSh 12,000/night',
    rating: 4.7,
    reviews: 89,
    category: 'airbnb',
    type: 'Cottage',
    image: property2,
    images: [property2, property1, property4],
    description: 'A charming beachfront cottage with rustic elegance. Wake up to the sound of waves and enjoy direct beach access from your private deck.',
    amenities: ['WiFi', 'Beach Access', 'Kitchen', 'Parking', 'Garden', 'Pet Friendly'],
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    featured: true,
    whatsapp: '+254700000000',
    lat: -3.2138,
    lng: 40.1169,
  },
  {
    id: '3',
    title: 'Modern Penthouse Suite',
    location: 'Westlands, Nairobi',
    price: 85000,
    priceLabel: 'KSh 85,000/month',
    rating: 4.8,
    reviews: 56,
    category: 'rental',
    type: 'Penthouse',
    image: property3,
    images: [property3, property1, property5],
    description: 'Stunning penthouse with panoramic city views, modern finishes, rooftop terrace, and premium amenities in the heart of Westlands.',
    amenities: ['WiFi', 'Gym', 'Pool', 'Parking', 'Security', 'Elevator', 'Rooftop', 'AC'],
    bedrooms: 3,
    bathrooms: 2,
    featured: true,
    whatsapp: '+254700000000',
    lat: -1.2641,
    lng: 36.8043,
  },
  {
    id: '4',
    title: 'Mountain View Cabin',
    location: 'Nanyuki, Kenya',
    price: 8500,
    priceLabel: 'KSh 8,500/night',
    rating: 4.6,
    reviews: 67,
    category: 'airbnb',
    type: 'Cabin',
    image: property4,
    images: [property4, property2, property6],
    description: 'Cozy mountain cabin with breathtaking views of Mt. Kenya. Perfect for nature lovers seeking tranquility and adventure.',
    amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Parking', 'Hiking', 'Garden', 'BBQ'],
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    featured: false,
    whatsapp: '+254700000000',
    lat: 0.0169,
    lng: 37.0724,
  },
  {
    id: '5',
    title: 'Contemporary Townhouse',
    location: 'Karen, Nairobi',
    price: 18500000,
    priceLabel: 'KSh 18.5M',
    rating: 4.9,
    reviews: 23,
    category: 'sale',
    type: 'Townhouse',
    image: property5,
    images: [property5, property3, property1],
    description: 'A beautifully designed contemporary townhouse in Karen with lush gardens, modern finishes, and a serene neighborhood.',
    amenities: ['Garden', 'Parking', 'Security', 'Gym', 'Pool', 'Playground'],
    bedrooms: 4,
    bathrooms: 3,
    featured: true,
    whatsapp: '+254700000000',
    lat: -1.3197,
    lng: 36.7111,
  },
  {
    id: '6',
    title: 'Stylish City Studio',
    location: 'Kilimani, Nairobi',
    price: 45000,
    priceLabel: 'KSh 45,000/month',
    rating: 4.5,
    reviews: 42,
    category: 'rental',
    type: 'Studio',
    image: property6,
    images: [property6, property3, property5],
    description: 'A sleek, fully furnished studio apartment in vibrant Kilimani. Ideal for young professionals and short-term stays.',
    amenities: ['WiFi', 'Gym', 'Parking', 'Security', 'Balcony', 'AC', 'Laundry'],
    bedrooms: 1,
    bathrooms: 1,
    featured: false,
    whatsapp: '+254700000000',
    lat: -1.2891,
    lng: 36.7868,
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Top 10 Airbnb Stays in Kenya for 2025',
    excerpt: 'Discover the most stunning vacation rentals across Kenya, from coastal villas to mountain retreats.',
    content: 'Kenya offers an incredible range of accommodation options for every type of traveler...',
    image: property2,
    author: 'Pelek Team',
    date: '2025-03-15',
    category: 'Travel',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Investment Guide: Nairobi Real Estate 2025',
    excerpt: 'Everything you need to know about investing in Nairobi\'s booming property market.',
    content: 'Nairobi continues to be one of Africa\'s most dynamic real estate markets...',
    image: property3,
    author: 'Pelek Team',
    date: '2025-03-10',
    category: 'Investment',
    readTime: '8 min read',
  },
  {
    id: '3',
    title: 'How to List Your Property on Airbnb Kenya',
    excerpt: 'A step-by-step guide to becoming a successful Airbnb host in Kenya.',
    content: 'Listing your property on Airbnb can be a great source of passive income...',
    image: property1,
    author: 'Pelek Team',
    date: '2025-03-05',
    category: 'Guides',
    readTime: '6 min read',
  },
];

export const faqs: FAQ[] = [
  { id: '1', question: 'How do I book a property?', answer: 'Browse our listings, select your preferred property, and click the WhatsApp button to connect with us directly. We\'ll guide you through the booking process.' },
  { id: '2', question: 'How does WhatsApp booking work?', answer: 'When you click the WhatsApp button on any listing, a pre-filled message with the property details is sent to our team. We respond within minutes to confirm availability and process your booking.' },
  { id: '3', question: 'Can I list my property on Pelek Properties?', answer: 'Yes! We welcome property owners to list their properties. Contact us via WhatsApp or the contact form, and our team will assist you with the listing process.' },
  { id: '4', question: 'What payment methods do you accept?', answer: 'We accept M-Pesa, bank transfers, and major credit/debit cards. Payment details are shared during the booking confirmation.' },
  { id: '5', question: 'Is there a cancellation policy?', answer: 'Cancellation policies vary by property. Each listing has its specific cancellation terms. Generally, cancellations made 48 hours before check-in receive a full refund.' },
];

export const reviews: Review[] = [
  { id: '1', name: 'Sarah M.', rating: 5, comment: 'Absolutely amazing experience! The villa exceeded all our expectations. Will definitely book again.', date: '2025-02-20', avatar: 'SM' },
  { id: '2', name: 'James K.', rating: 5, comment: 'Best property management service in Kenya. Quick responses and beautiful properties.', date: '2025-02-15', avatar: 'JK' },
  { id: '3', name: 'Emily W.', rating: 4, comment: 'Great selection of properties. The WhatsApp booking was so convenient and easy!', date: '2025-02-10', avatar: 'EW' },
  { id: '4', name: 'David O.', rating: 5, comment: 'The mountain cabin was incredible. Perfect weekend getaway. Highly recommend Pelek Properties!', date: '2025-01-28', avatar: 'DO' },
];
