import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function chooseRandomFromPool(pool: any) {
  const random = pool[getRandomInt(pool.length)].id;
  return random;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.id && typeof req.query.id == "string") {
    prisma.picture
      .findMany({
        where: {
          locationId: Number(req.query.id),
        },
      })
      .then((rows) => {
        let avoid: number | undefined;
        let take: number = 2;

        if (req.query.avoid && typeof req.query.avoid == "string") {
          avoid = Number(req.query.avoid);
        }

        if (req.query.take && typeof req.query.take == "string") {
          take = Math.min(5, Number(req.query.take));
        }

        const pool =
          avoid != undefined ? rows.filter((row) => row.id != avoid) : rows;

        if (pool.length <= take) {
          res.status(200).json(pool);
        } else {
          const found: number[] = [];

          for (let i = 0; i < take; i++) {
            for (let j = 0; i < 10; i++) {
              const got = chooseRandomFromPool(pool);
              if (found.filter((obj) => obj == got).length == 0) {
                found.push(got);
                break;
              }
            }
          }

          let promises: Promise<any>[] = [];

          for (let got in found) {
            promises.push(
              prisma.picture.findUnique({
                where: {
                  id: Number(found[got]),
                },
              })
            );
          }

          Promise.all(promises).then((values) => {
            res.json(values);
          });
        }
      });
  } else {
    res.status(400).json({
      error: {
        code: "MISSING_PARAMETER",
        message: 'Parameter "id" is required.',
      },
    });
  }
};
