export interface Project {
  _id: string;
  id?: string;
  title: string;
  description: string;
  category: 'AI' | 'Optimization' | 'DevOps' | 'Global Impact' | 'Web Development';
  technologies: string[];
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  image?: string;
  images?: string[];
  featured?: boolean;
  awards?: string[];
  impact?: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  published?: boolean;
}

export interface GlobalExperience {
  id: string;
  country: string;
  flag: string;
  role: string;
  description: string;
  impact: string;
  stats?: string;
  projects?: string[];
  status?: 'completed' | 'upcoming';
  year?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AdminStats {
  totalProjects: number;
  publishedProjects: number;
  featuredProjects: number;
  draftProjects: number;
  categoryBreakdown: Record<string, number>;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
  [key: string]: any;
}

export interface AuthState {
  user: { username: string } | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading?: boolean;
}