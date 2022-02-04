import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default (req: NextApiRequest, res: NextApiResponse) => {
  prisma.picture.count().then((count) => {
    prisma.picture
      .findUnique({
        where: {
          id: Math.floor(Math.random() * count) + 1,
        },
      })
      .then(async (row) => {
        if (row) {
          res.json({
            id: row.id,
            filepath: row.filepath,
            place: row.place,
            taken: row.createdAt,
            location: await prisma.location.findUnique({
              where: { id: row.locationId },
            }),
            primaryTag: row.primaryTagID,
            tags: await prisma.tag.findMany({
              where: {
                Picture: {
                  some: {
                    id: row.id,
                  },
                },
              },
            }),
            size: row.size,
            description: row.description,
            width: row.width,
            height: row.height,
          });
        }
      });
  });
};
