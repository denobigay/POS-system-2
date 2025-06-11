import type { Roles } from "./Roles";

export interface User {
    user_id: number;
    profile_image?: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    suffix_name?: string;
    age: string;
    gender: 'female' | 'male' | 'others';
    contact: string;
    address: string;
    role_id: number;
    email: string;
    created_at?: string;
    updated_at?: string;
    role?: Roles;
}

export interface UserFieldErrors {
    firstName?: string[];
    middleName?: string[];
    lastName?: string[];
    suffixName?: string[];
    age?: string[];
    gender?: string[];
    contact?: string[];
    address?: string[];
    roleId?: string[];
    email?: string[];
    password?: string[];
} 