import Image from "next/image";
import CSS from "csstype";

import styles from "../styles/PictureCard.module.scss";

import { Picture, Tag, Location } from "../types";

interface Props {
  data: Picture;
  tags: Tag[];
  locations: Location[];
  style?: any;
}

export default function PictureCard({ data, tags, locations, style }: Props) {
  function toLocaleUTCDateString(date: Date) {
    const timeDiff = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.valueOf() + timeDiff);

    return adjustedDate.toLocaleDateString();
  }

  return (
    <div
      key={"picture-" + data.id}
      className={styles.picturecard}
      style={style}
    >
      <Image
        src={require(`../../public/photos/${data.filepath}`)}
        placeholder="blur"
        objectFit="contain"
        width={"500px"}
      />
      <footer>
        <span>
          {data.place}
          {data.place && ", "}
          {locations.filter((loc) => loc.id == data.location)[0].name}
        </span>{" "}
        <small>
          {data.tags.map((obj, idx) => {
            console.log(obj, data.primaryTag);
            if (obj == data.primaryTag) {
              const newObj = tags.filter((o) => obj == o.id)[0];
              return (
                <>
                  <span>{newObj.emoji}</span> <span>{newObj.name}</span>
                </>
              );
            }
          })}{" "}
          · {new Date(Date.parse(data.taken)).toLocaleDateString()}
        </small>
      </footer>
    </div>
  );
}
