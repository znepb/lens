import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  prisma.tag.findMany().then(async (rows) => {
    const tags: any[] = [];

    for (let idx in rows) {
      let row = rows[idx];

      tags.push({
        id: row.id,
        name: row.name,
        textColor: row.textColor,
        backgroundColor: row.backgroundColor,
        emoji: row.emoji,
        pictures: (
          await prisma.picture.findMany({
            where: {
              tag: {
                some: {
                  id: row.id,
                },
              },
            },
          })
        ).map((obj) => obj.id),
      });
    }

    Promise.all(tags).then((results) => {
      res.json(
        results.sort((a: any, b: any) => {
          if (a.id > b.id) {
            return 1;
          } else if (b.id > a.id) {
            return -1;
          }
          return 0;
        })
      );
      prisma.$disconnect();
    });
  });
};
