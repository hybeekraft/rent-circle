export type UserProfile = {
  id: string
  email: string
  phone?: string
  full_name: string
  age?: number
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say'
  occupation?: string
  school_or_company?: string
  bio?: string
  avatar_url?: string
  preferred_areas?: string[]
  budget_min?: number
  budget_max?: number
  lifestyle: LifestylePrefs
  is_verified: boolean
  verification_level: 0 | 1 | 2 | 3
  is_premium: boolean
  created_at: string
}

export type LifestylePrefs = {
  cleanliness?: 1 | 2 | 3 | 4 | 5
  smoking?: 'yes' | 'no' | 'occasionally'
  drinking?: 'yes' | 'no' | 'occasionally'
  sleep_schedule?: 'early-bird' | 'night-owl' | 'flexible'
  guests?: 'often' | 'sometimes' | 'rarely' | 'never'
  pets?: boolean
  religion?: string
  work_schedule?: 'office' | 'remote' | 'hybrid' | 'student'
  hobbies?: string[]
}

export type Listing = {
  id: string
  owner_id: string
  title: string
  description: string
  property_type: 'room' | 'flat' | 'apartment' | 'duplex'
  listing_type: 'room-available' | 'looking-for-roommate' | 'full-apartment'
  rent_amount: number
  rent_period: 'monthly' | 'yearly'
  caution_fee?: number
  service_charge?: number
  location: {
    state: string
    city: string
    area: string
    address?: string
    lat?: number
    lng?: number
  }
  amenities: Amenity[]
  house_rules: string[]
  photos: string[]
  spots_available: number
  gender_preference?: 'male' | 'female' | 'any'
  is_verified: boolean
  is_active: boolean
  views: number
  created_at: string
  owner?: UserProfile
}

export type Amenity =
  | 'electricity' | 'water' | 'internet' | 'security' | 'parking'
  | 'generator' | 'kitchen' | 'laundry' | 'gym' | 'pool' | 'cctv'
  | 'furnished' | 'ac' | 'balcony' | 'garden'

export type Match = {
  id: string
  user_a: string
  user_b: string
  compatibility_score: number
  status: 'pending' | 'matched' | 'declined'
  created_at: string
  profile?: UserProfile
}

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  type: 'text' | 'image' | 'voice'
  read_at?: string
  created_at: string
}

export type Group = {
  id: string
  name: string
  description?: string
  creator_id: string
  members: string[]
  budget_per_person: number
  total_budget: number
  target_area: string
  status: 'forming' | 'searching' | 'found' | 'closed'
  created_at: string
}
