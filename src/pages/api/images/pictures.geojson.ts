import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default (req: NextApiRequest, res: NextApiResponse) => {
  prisma.picture.findMany().then(async (rows) => {
    const images: any[] = [];

    for (let idx in rows) {
      let row = rows[idx];

      if (row.lat && row.lon) {
        images.push({
          id: row.id,
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
          lat: row.lat,
          lon: row.lon,
        });
      }
    }

    Promise.all(images).then((results) => {
      res.json({
        type: "FeatureCollection",
        features: results.map((o) => {
          return {
            type: "Feature",
            properties: { id: o.id, place: o.place, taken: o.taken },
            geometry: {
              type: "Point",
              coordinates: [o.lon || 0, o.lat || 0],
            },
          };
        }),
      });
      prisma.$disconnect();
    });
  });
};
