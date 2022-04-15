const { PhoneOutgoing } = require("react-feather");

const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();
const ExifImage = require("exif").ExifImage;

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  var dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  }

  return dd;
}

prisma.picture.findMany().then((rows) => {
  rows.forEach((picture) => {
    try {
      new ExifImage({ image: `public/photos/${picture.filepath}` }, function (
        error,
        exifData
      ) {
        if (error) console.log(picture.id, "Error: " + error.message);
        else {
          let latDeg, lonDeg;
          if (exifData.gps && exifData.gps.GPSLatitude) {
            const lat = exifData.gps.GPSLatitude;
            latDeg = ConvertDMSToDD(
              lat[0],
              lat[1],
              lat[2],
              exifData.gps.GPSLatitudeRef
            );
          }

          if (exifData.gps && exifData.gps.GPSLongitude) {
            const lon = exifData.gps.GPSLongitude;
            lonDeg = ConvertDMSToDD(
              lon[0],
              lon[1],
              lon[2],
              exifData.gps.GPSLongitudeRef
            );
          }
          console.log(
            picture.id,
            latDeg,
            lonDeg,
            exifData.exif.LensMake,
            exifData.exif.LensModel
          );

          prisma.picture
            .update({
              where: {
                id: picture.id,
              },
              data: {
                lens: `${exifData.exif.LensMake} ${exifData.exif.LensModel}`,
                lat: latDeg,
                lon: lonDeg,
              },
            })
            .then(() => {
              console.log("Updated " + picture.id);
            })
            .catch((d) => {
              console.log(picture.id + " failed " + d);
            });
        }
      });
    } catch (error) {
      console.log(picture.id, "Error: " + error.message);
    }
  });
});
