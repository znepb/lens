import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface orderByProps {
  photoID?: string;
  createdAt?: string;
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  // using any here other react starting crying
  const defaultSort: any = {
    createdAt: req.query.order || "desc",
  };

  const adminSort: any = {
    id: "asc",
  };

  prisma.picture
    .findMany({
      skip: req.query.skip ? Math.max(Number(req.query.skip), 0) : 0,
      take: req.query.take ? Math.min(Number(req.query.take), 25) : 25,
      orderBy: [req.query.adminSort ? adminSort : defaultSort],
    })
    .then(async (rows) => {
      const images: any[] = [];

      for (let idx in rows) {
        let row = rows[idx];

        images.push({
          id: row.id,
          filepath: row.filepath,
          place: row.place,
          taken: row.createdAt,
          location: row.locationId,
          primaryTag: row.primaryTagID,
          tags: (
            await prisma.tag.findMany({
              where: {
                Picture: {
                  some: {
                    id: row.id,
                  },
                },
              },
            })
          ).map((obj) => obj.id),
          size: row.size,
          description: row.description,
        });
      }

      Promise.all(images).then((results) => {
        res.json(results);
        prisma.$disconnect();
      });
    });
};
