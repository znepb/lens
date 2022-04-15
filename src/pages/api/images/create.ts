import nextConnect from "next-connect";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import multer from "multer";
import { parseBody } from "next/dist/server/api-utils";
import imageSize from "image-size";
import { ExifImage } from "exif";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/photos",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

function ConvertDMSToDD(
  degrees: number,
  minutes: number,
  seconds: number,
  direction: string
): number {
  var dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  }

  return dd;
}

const prisma = new PrismaClient();

const handeler = nextConnect<NextApiRequest, NextApiResponse>({}).post(
  (req, res) => {
    if (req.headers.authorization) {
      if (req.headers.authorization == `Bearer ${process.env.AUTH_TOKEN}`) {
        const dimensions = imageSize(
          path.join("./", "public", "photos", req.body.filepath)
        );

        new ExifImage(
          { image: `public/photos/${req.body.filepath}` },
          function (error, exifData) {
            const lat = exifData.gps?.GPSLatitude;
            const lon = exifData.gps?.GPSLongitude;
            let makeModel;

            if (exifData.exif.LensMake && exifData.exif.LensModel) {
              makeModel = `${exifData.exif.LensMake} ${exifData.exif.LensModel}`;
            }

            const picturePromise = prisma.picture.create({
              data: {
                filepath: req.body.filepath,
                place: req.body.place,
                createdAt: new Date(req.body.createdAt),
                locationId: req.body.locationId,
                description: req.body.description,
                primaryTagID: req.body.primaryTagID,
                size: fs.statSync(
                  path.join("./", "public", "photos", req.body.filepath)
                ).size,
                width:
                  (dimensions.orientation == 1
                    ? dimensions.width
                    : dimensions.height) || 0,
                height:
                  (dimensions.orientation == 1
                    ? dimensions.height
                    : dimensions.width) || 0,
                lat:
                  lat && exifData.gps?.GPSLatitudeRef
                    ? ConvertDMSToDD(
                        lat[0],
                        lat[1],
                        lat[2],
                        exifData.gps.GPSLatitudeRef
                      )
                    : undefined,
                lon:
                  lon && exifData.gps?.GPSLongitudeRef
                    ? ConvertDMSToDD(
                        lon[0],
                        lon[1],
                        lon[2],
                        exifData.gps.GPSLongitudeRef
                      )
                    : undefined,
                lens: makeModel,
              },
            });

            picturePromise.then(async (data) => {
              try {
                req.body.tags.forEach(async (obj: number) => {
                  console.log(obj, data.id);
                  await prisma.tag.update({
                    where: {
                      id: obj,
                    },
                    data: {
                      Picture: {
                        connect: {
                          id: data.id,
                        },
                      },
                    },
                  });
                });

                if (req.body.setAsCover && req.body.setAsCover !== "false") {
                  prisma.location
                    .update({
                      where: {
                        id: data.locationId,
                      },
                      data: {
                        cover: data.filepath,
                      },
                    })
                    .then(() => {
                      res.json({
                        id: data.id,
                      });
                    });
                } else {
                  res.json({
                    id: data.id,
                  });
                }
              } catch (reqErr) {
                res.status(500).json({
                  error: {
                    code: "DATABASE",
                    message:
                      "Something went wrong while writing changes to the database.",
                    error: String(reqErr),
                  },
                });
              }
            });
          }
        );
      } else {
        res.status(403).json({
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
