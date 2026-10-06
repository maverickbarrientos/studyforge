import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL must be set to initialize Prisma.");
    }

    const adapter = new PrismaPg({ connectionString });
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  return globalForPrisma.prisma;
}
