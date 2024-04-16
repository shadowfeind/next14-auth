import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined
}

//we do this for nextjs hot reload, every time it hot reloads it might create new instance of prisma everytime and weired console error
//we store in  global this as it does not get effected by hot reload

export const db = globalThis.prisma || new PrismaClient

if(process.env.NODE_ENV !== "production") globalThis.prisma = db