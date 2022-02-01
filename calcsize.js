const Client = require("@prisma/client").PrismaClient;
const sizeOf = require("image-size");

const prisma = new Client();

prisma.picture.findMany().then(async (rows) => {
  let ok = 0;
  let fail = 0;
  let passed = 0;

  await rows.forEach(async (row) => {
    // if (!(row.width && row.height)) {
    try {
      const dimensions = sizeOf(`public/photos/${row.filepath}`);

      let res = await prisma.picture.update({
        where: {
          id: row.id,
        },
        data: {
          width:
            dimensions.orientation == 1 ? dimensions.width : dimensions.height,
          height:
            dimensions.orientation == 1 ? dimensions.height : dimensions.width,
        },
      });

      console.log(dimensions, res);

      ok++;
    } catch (e) {
      console.log("failed: " + e + " " + row.filepath);
      fail++;
    }
    //}
  });

  console.log(`updated ${ok} rows, ${fail} failed, ${passed} passed`);
});
