import styles from "../styles/all.module.scss";
import Image from "next/image";
import Head from "next/head";

import Footer from "../components/Footer";

import { Picture, Location, Tag } from "../types";

import { useState, useEffect, useRef, createRef } from "react";
import { useRouter } from "next/router";
import useWindowSize from "../UseWindowSize";

export default function Index() {
  const router = useRouter();

  const [photos, setPhotos] = useState<Picture[]>([]);
  const [index, setIndex] = useState(0);
  const [reachedEnd, setEnd] = useState(false);

  const [locations, setLocations] = useState<Location[]>();
  const [tags, setTags] = useState<Tag[]>();

  const [tagFilter, setTagFilter] = useState<number>(-1);
  const [locationFilter, setLocationFilter] = useState<number>(-1);

  const [sortBy, setSortBy] = useState<string>("desc");

  const [columnWidth, setColumnWidth] = useState<number>(0);

  const rowSizingRef = useRef<HTMLDivElement | null>(null);

  const size = useWindowSize();

  useEffect(() => {
    fetch(`/api/images/all?skip=${index}&order=${sortBy}`).then((res) =>
      res.json().then((data) => {
        setPhotos([...photos, ...data]);

        if (data.length < 25) {
          setEnd(true);
        }
      })
    );
  }, [index]);

  useEffect(() => {
    setIndex(0);
    fetch(`/api/images/all?skip=${index}&order=${sortBy}`).then((res) =>
      res.json().then((data) => {
        setPhotos(data);

        if (data.length < 25) {
          setEnd(true);
        }
      })
    );
  }, [sortBy]);

  useEffect(() => {
    fetch(`/api/images/all?skip=${index}&order=${sortBy}`).then((res) =>
      res.json().then((data) => {
        setPhotos(data);

        if (data.length < 25) {
          setEnd(true);
        }
      })
    );

    fetch("/api/tags/all").then((res) => {
      res.json().then((data) => {
        setTags(data);
      });
    });

    fetch("/api/locations/all").then((res) => {
      res.json().then((data) => {
        setLocations(data);
      });
    });
  }, []);

  useEffect(() => {
    if (router.query && router.query.location) {
      setLocationFilter(Number(router.query.location));
    }
    if (router.query && router.query.tag) {
      setTagFilter(Number(router.query.tag));
    }
  }, [router.isReady]);

  useEffect(() => {
    if (rowSizingRef.current?.offsetWidth)
      setColumnWidth(rowSizingRef.current?.offsetWidth);
  }, [size]);

  return (
    <>
      <Head>
        <title>All Photos - Lens</title>
      </Head>

      <section
        className="section"
        id="photos"
        style={{
          marginBottom: "5rem",
        }}
      >
        <h2>All photos</h2>
        <div className="headingDecoration" />
        <div className={styles.select}>
          <div>
            Sort
            <select
              onChange={(e) => {
                setSortBy(e.target.value);
              }}
              value={sortBy}
            >
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </select>
          </div>

          <div>
            Tag
            <select
              defaultValue="-1"
              onChange={(e) => {
                setTagFilter(Number(e.target.value));
              }}
              value={tagFilter}
            >
              <option key="none" value="-1"></option>
              {tags &&
                tags.map((tag) => (
                  <option value={tag.id} key={tag.id}>
                    {tag.emoji} {tag.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            Location
            <select
              defaultValue="-1"
              onChange={(e) => {
                setLocationFilter(Number(e.target.value));
              }}
              value={locationFilter}
            >
              <option key="none" value="-1"></option>
              {locations &&
                locations.map((tag) => (
                  <option value={tag.id} key={tag.id}>
                    {tag.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className={styles.pictures}>
          <div ref={rowSizingRef}></div>

          {photos ? (
            photos.map((row: Picture, idx: number) => {
              if (row.location == locationFilter || locationFilter == -1) {
                if (
                  row.tags.filter((o) => tagFilter == o).length > 0 ||
                  tagFilter == -1
                ) {
                  return (
                    <>
                      <a
                        style={{
                          width: "100%",
                        }}
                        key={idx}
                        href={`/photo/${row.id}`}
                      >
                        <Image
                          src={`/photos/${row.filepath}`}
                          width={columnWidth}
                          height={
                            columnWidth
                              ? row.height * (columnWidth / row.width)
                              : 0
                          }
                          className="shimmer"
                        />
                        <div>
                          <header>{row.place}</header>
                          <footer>
                            {new Date(row.taken).toLocaleDateString()} -{" "}
                            {row.filepath}
                          </footer>
                        </div>
                      </a>
                    </>
                  );
                }
              }
            })
          ) : (
            <div className="lds-ellipsis">
              <div />
              <div />
              <div />
              <div />
            </div>
          )}

          {/* invisible reference object for column sizing */}
        </div>
        {photos && !reachedEnd && (
          <>
            <div
              style={{
                textAlign: "center",
                fontSize: "0.6rem",
              }}
            >
              Note: If you don&apos;t see any photos, press Load More.
            </div>
            <div
              onClick={() => {
                setIndex(index + 25);
              }}
              style={{
                textAlign: "center",
              }}
            >
              Load More
            </div>
          </>
        )}{" "}
        {reachedEnd && (
          <>
            <div
              style={{
                textAlign: "center",
              }}
            >
              <small>That&apos;s all folks!</small>
            </div>
          </>
        )}
      </section>

      <Footer />
    </>
  );
}
