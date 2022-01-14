import styles from "../../styles/Photo.module.scss";

import Footer from "../../components/Footer";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { MapPin, Calendar, Tag } from "react-feather";

import Head from "next/head";

import Image from "next/image";
import { Tag as TagType } from "../../types";

export default function Photo() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<any>();
  const [loadedPhoto, setLoadedPhoto] = useState<any>();
  const [primaryTag, setPrimaryTag] = useState<TagType>();

  const [moreOfTag, setMoreOfTag] = useState<any>();
  const [moreAt, setMoreAt] = useState<any>();

  useEffect(() => {
    if (router.isReady) {
      if (typeof router.query.id == "string") {
        fetch(`/api/images/${router.query.id}`).then((res) =>
          res.json().then((photo) => {
            if (photo.error) {
              setErrorMessage(
                <span key={Math.random()}>
                  <span key={Math.random()}>{photo.error.code}</span>
                  <br />
                  <span key={Math.random()}>{photo.error.message}</span>
                </span>
              );
            } else {
              setLoadedPhoto(photo);

              let localPrimaryTag = photo.tags.filter((got: any) => {
                return got.id == photo.primaryTag;
              })[0];

              console.log(photo.location.id, photo.id);

              setPrimaryTag(localPrimaryTag);

              fetch(
                `/api/tags/getMore?id=${localPrimaryTag.id}&avoid=${photo.id}`
              ).then((res) =>
                res.json().then((json) => {
                  setMoreOfTag(json);
                })
              );

              fetch(
                `/api/locations/getMore?id=${photo.location.id}&avoid=${photo.id}`
              ).then((res) =>
                res.json().then((json) => {
                  setMoreAt(json);
                })
              );
            }
          })
        );
      } else {
        setErrorMessage(
          <span key={Math.random()}>That wasn&apos;t supposed to happen.</span>
        );
      }
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>{loadedPhoto && `${loadedPhoto.place} - `} Lens</title>
      </Head>
      {loadedPhoto ? (
        <section className={styles.main}>
          <div className={styles.image}>
            <div className="fiximage">
              <Image
                src={require(`../../../public/photos/${loadedPhoto.filepath}`)}
                objectFit="contain"
                width={800}
              />
            </div>
            <footer>
              <a
                onClick={() => {
                  if (loadedPhoto.size > 500000) {
                    if (
                      confirm(
                        `Warning! This photo is ${
                          Math.floor((loadedPhoto.size / 1000000) * 100) / 100
                        } MB large. It's probably not a good idea to open this photo on a metered connection. Continue?`
                      )
                    ) {
                      window.open(`/photos/${loadedPhoto.filepath}`, "_blank");
                    }
                  }
                }}
              >
                See original
              </a>
            </footer>
          </div>
          <div className={styles.info}>
            <div>
              <h1>{loadedPhoto.place ? loadedPhoto.place : "Unknown place"}</h1>
              <div className="headingDecoration"></div>
            </div>
            <div className={styles.details}>
              <div>
                <MapPin /> {loadedPhoto.location.name}
              </div>
              <div>
                <Tag />{" "}
                <div className={styles.tags}>
                  {loadedPhoto.tags.map((obj: any, idx: number) => (
                    <div
                      style={{
                        backgroundColor: obj.backgroundColor,
                        color: obj.textColor,
                        padding: "0.2rem 0.4rem",
                        borderRadius: "0.5rem",
                        display: "flex",
                        flexDirection: "row",
                        gap: "0.4rem",
                        alignItems: "center",
                      }}
                      key={idx}
                    >
                      {obj.emoji}{" "}
                      <span
                        style={{
                          fontSize: "0.9rem",
                        }}
                      >
                        {obj.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Calendar />{" "}
                {new Date(loadedPhoto.taken).toLocaleString(["en-US"], {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div className={styles.description}>{loadedPhoto.description}</div>
            <div className={styles.more}>
              <div>
                <h2>More of {primaryTag && primaryTag.name}</h2>
                <div className="headingDecoration"></div>
                <div className={styles.moreImages}>
                  {typeof moreOfTag != "undefined" ? (
                    moreOfTag.length == 0 ? (
                      <>There&apos;s nothing to see here...</>
                    ) : (
                      moreOfTag.map((photo: any) => (
                        <a href={`/photo/${photo.id}`} key={photo.id}>
                          <div
                            className="fiximage"
                            key={photo.filepath}
                            style={{ cursor: "pointer" }}
                          >
                            <Image
                              src={require(`../../../public/photos/${photo.filepath}`)}
                              width={720}
                              objectFit="contain"
                            />
                          </div>
                        </a>
                      ))
                    )
                  ) : (
                    <div className={`${styles.moreAtLoading} lds-ellipsis`}>
                      <div />
                      <div />
                      <div />
                      <div />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h2>More at {loadedPhoto.location.name}</h2>
                <div className="headingDecoration"></div>
                <div className={styles.moreImages}>
                  {typeof moreAt != "undefined" ? (
                    moreAt.length == 0 ? (
                      <>There&apos;s nothing to see here...</>
                    ) : (
                      moreAt.map((photo: any) => (
                        <a href={`/photo/${photo.id}`} key={photo.id}>
                          <div
                            className="fiximage"
                            key={photo.filepath}
                            style={{ cursor: "pointer" }}
                          >
                            <Image
                              src={require(`../../../public/photos/${photo.filepath}`)}
                              width={720}
                              objectFit="contain"
                            />
                          </div>
                        </a>
                      ))
                    )
                  ) : (
                    <div className={`${styles.moreAtLoading} lds-ellipsis`}>
                      <div />
                      <div />
                      <div />
                      <div />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className={styles.loading}>
          {errorMessage ? (
            errorMessage
          ) : (
            <div className="lds-ellipsis">
              <div />
              <div />
              <div />
              <div />
            </div>
          )}
        </section>
      )}

      <Footer />
    </>
  );
}
