import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  prisma.location.findMany().then((rows) => {
    const all = rows.map(async (row) => {
      return {
        id: row.id,
        name: row.name,
        flag: row.flag,
        cover: row.cover,
        pictures: (
          await prisma.picture.findMany({
            where: { locationId: row.id },
          })
        ).map((obj) => {
          return obj.id;
        }),
      };
    });

    Promise.all(all).then((values) => {
      res.json(values);
      prisma.$disconnect();
    });
  });
};
