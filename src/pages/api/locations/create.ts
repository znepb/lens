import nextConnect from "next-connect";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const handeler = nextConnect<NextApiRequest, NextApiResponse>({}).post(
  (req, res) => {
    if (req.headers.authorization) {
      if (req.headers.authorization == `Bearer ${process.env.AUTH_TOKEN}`) {
        prisma.location
          .create({
            data: {
              name: req.body.name,
              flag: req.body.flag,
              cover: req.body.cover,
            },
          })
          .then((results) => {
            res.json({
              id: results.id,
            });
          });
      } else {
        res.json({
          code: "INVALID_TOKEN",
          message: "Incorrect token.",
          got: req.headers.authorization,
        });
      }
    } else {
      res.json({
        error: {
          code: "NO_AUTH",
          message: "Missing authentication header",
        },
      });
    }
  }
);

export default handeler;
