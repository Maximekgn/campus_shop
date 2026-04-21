import { User, UserRole } from '../types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Jean Dupont',
    email: 'jean.dupont@univ-campus.fr',
    role: UserRole.MEMBER,
    student_id: 'STUD12345',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u2',
    name: 'Marie Curie',
    email: 'marie.curie@univ-campus.fr',
    role: UserRole.MODERATOR,
    student_id: 'MOD001',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u3',
    name: 'Alice Martin',
    email: 'alice.martin@univ-campus.fr',
    role: UserRole.MEMBER,
    student_id: 'STUD67890',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u4',
    name: 'Colombel Kadissole',
    email: 'colombekadissole@gmail.com',
    role: UserRole.MEMBER,
    student_id: 'STUD99999',
    is_active: true,
    created_at: new Date().toISOString(),
  }
];
