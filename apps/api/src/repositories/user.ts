import type { PrismaClient } from "@prisma/client";
import type { UserDTO } from "@bajes/types";
import { BaseRepository } from "./base.js";
import { prisma } from "../lib/prisma.js";

type UpsertAuthData = {
  supabaseUid: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  authProvider?: string;
};

function toUserDTO(user: {
  id: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
  authProvider: string;
  currencyCode: string;
  isGuest: boolean;
  createdAt: Date;
}): UserDTO {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    photoUrl: user.photoUrl,
    authProvider: user.authProvider,
    currencyCode: user.currencyCode,
    isGuest: user.isGuest,
    createdAt: user.createdAt.toISOString(),
  };
}

export class UserRepository extends BaseRepository {
  constructor(db: PrismaClient = prisma) {
    super(db);
  }

  async findBySupabaseUid(supabaseUid: string): Promise<UserDTO | null> {
    const user = await this.db.user.findUnique({
      where: { supabaseUid },
      select: {
        id: true,
        email: true,
        displayName: true,
        photoUrl: true,
        authProvider: true,
        currencyCode: true,
        isGuest: true,
        createdAt: true,
      },
    });
    return user ? toUserDTO(user) : null;
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    const user = await this.db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        displayName: true,
        photoUrl: true,
        authProvider: true,
        currencyCode: true,
        isGuest: true,
        createdAt: true,
      },
    });
    return user ? toUserDTO(user) : null;
  }

  async upsertFromAuth(data: UpsertAuthData): Promise<UserDTO> {
    const user = await this.db.user.upsert({
      where: { supabaseUid: data.supabaseUid },
      create: {
        supabaseUid: data.supabaseUid,
        email: data.email,
        displayName: data.displayName ?? null,
        photoUrl: data.photoUrl ?? null,
        authProvider: data.authProvider ?? "email",
      },
      update: {
        email: data.email,
        displayName: data.displayName ?? undefined,
        photoUrl: data.photoUrl ?? undefined,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        photoUrl: true,
        authProvider: true,
        currencyCode: true,
        isGuest: true,
        createdAt: true,
      },
    });
    return toUserDTO(user);
  }
}
