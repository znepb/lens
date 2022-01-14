import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface orderByProps {
  photoID?: string;
  createdAt?: string;
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  prisma.picture
    .findUnique({
      where: {
        id:
          typeof req.query.id == "object"
            ? Number(req.query.id[0])
            : Number(req.query.id),
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
        });
      } else {
        res.status(404).json({
          error: {
            code: "NOT_FOUND",
            message: "Could not find the requested resource.",
          },
        });
      }

      prisma.$disconnect();
    });
};
