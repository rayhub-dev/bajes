import type { PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export abstract class BaseRepository {
  protected readonly db: PrismaClient;

  protected constructor(db: PrismaClient = prisma) {
    this.db = db;
  }
}
