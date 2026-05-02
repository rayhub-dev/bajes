import type { UserDTO } from "@bajes/types";
import { UserRepository } from "../repositories/user.js";

export class AuthService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async getOrCreateUser(
    supabaseUid: string,
    email: string,
    displayName?: string,
    photoUrl?: string,
  ): Promise<UserDTO> {
    return this.userRepository.upsertFromAuth({
      supabaseUid,
      email,
      displayName,
      photoUrl,
    });
  }

  async getUserProfile(supabaseUid: string): Promise<UserDTO | null> {
    return this.userRepository.findBySupabaseUid(supabaseUid);
  }
}
