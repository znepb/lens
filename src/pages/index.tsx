import styles from "../styles/Home.module.scss";
import Image from "next/image";
import Head from "next/head";

import Footer from "../components/Footer";
import PictureCard from "../components/PictureCard";

import { Tag, Location, Picture } from "../types";

import { useState, useEffect } from "react";

import Link from "next/link";

export default function Index() {
  const [latestPhotos, setLatestPhotos] = useState<Picture[]>();
  const [locations, setLocations] = useState<Location[]>();
  const [tags, setTags] = useState<Tag[]>();

  useEffect(() => {
    const tagsPromise = fetch("/api/tags/all").then((res) =>
      res.json().then((data) => {
        setTags(data);
      })
    );

    const locationsPromise = fetch("/api/locations/all").then((locres) =>
      locres.json().then((locdata) => {
        setLocations(locdata);
      })
    );

    const photosPromise = fetch("/api/images/all").then((res) => res.json());

    Promise.all([tagsPromise, locationsPromise, photosPromise]).then(
      (results) => {
        setLatestPhotos(results[2]);
      }
    );
  }, []);

  return (
    <>
      <Head>
        <title>Lens</title>
      </Head>

      <section className="header" id="header">
        <div> </div>
        <img src="/znepb-photos.svg" />
        <a href="#photos">
          <img className={styles.down} src="/chevron-down.svg" />
        </a>
      </section>

      <section
        className="section"
        id="photos"
        style={{
          paddingRight: "0px",
          maxWidth: "none",
        }}
      >
        <h2 className={styles.seeMoreHeader}>
          <span>Latest photos</span>{" "}
          <Link href="/all">
            <a>See All</a>
          </Link>
        </h2>
        <div className="headingDecoration" />
        <div className={styles.pictures}>
          {latestPhotos && locations && tags ? (
            <>
              {latestPhotos.map((row: Picture, idx: number) => (
                <a href={`/photo/${row.id}`} key={idx}>
                  <PictureCard
                    locations={locations}
                    tags={tags}
                    data={row}
                    key={idx}
                  />
                </a>
              ))}
            </>
          ) : (
            <div className="lds-ellipsis">
              <div />
              <div />
              <div />
              <div />
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <h2>Locations</h2>
        <div className="headingDecoration" />
        <div>
          {locations ? (
            <div className={styles.locations}>
              {locations.map((locrow: Location) => {
                return (
                  locrow.cover != "/" && (
                    <Link href={`/all?location=${locrow.id}`}>
                      <div
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <Image
                          src={require(`../../public/photos/${locrow.cover}`)}
                          objectFit="cover"
                          width={"100%"}
                          height={"100%"}
                          layout="fill"
                          placeholder="blur"
                        />
                        <article>
                          <header>
                            {locrow.flag} {locrow.name}
                          </header>
                          <footer>
                            {locrow.pictures.length} picture
                            {locrow.pictures.length != 1 && "s"}
                          </footer>
                        </article>
                      </div>
                    </Link>
                  )
                );
              })}
            </div>
          ) : (
            <div className="lds-ellipsis">
              <div />
              <div />
              <div />
              <div />
            </div>
          )}
        </div>
      </section>

      <section
        className="section"
        style={{
          paddingBottom: "5rem",
        }}
      >
        <h2>Tags</h2>
        <div className="headingDecoration" />
        <div className={styles.tags}>
          {tags ? (
            tags.map((row: Tag) => {
              return (
                <Link href={`/all?tag=${row.id}`} key={row.id}>
                  <div
                    key={"tag-" + row.id}
                    className={styles.tag}
                    style={{
                      backgroundColor: row.backgroundColor,
                      color: row.textColor,
                      cursor: "pointer",
                    }}
                  >
                    {row.emoji} {row.name}
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="lds-ellipsis">
              <div />
              <div />
              <div />
              <div />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
