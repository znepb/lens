import styles from "../styles/Home.module.scss";
import Image from "next/image";
import Head from "next/head";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import Footer from "../components/Footer";

TimeAgo.addLocale(en);

import { Tag, Location, Picture } from "../types";

import { useState, useEffect, useRef } from "react";

import Link from "next/link";
import useWindowSize from "../UseWindowSize";

mapboxgl.accessToken = process.env.MAPBOX_TOKEN || "";

export default function Index() {
  const [latestPhotos, setLatestPhotos] = useState<Picture[]>();
  const [locations, setLocations] = useState<Location[]>();
  const [tags, setTags] = useState<Tag[]>();

  const mapContainer = useRef<any>();
  const map = useRef<any>();

  const [lat, setLat] = useState(35.77);
  const [lon, setLon] = useState(-82.49);
  const [zoom, setZoom] = useState(3);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [lon, lat],
      zoom: zoom,
    });

    map.current.on("move", () => {
      setLon(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on("load", () => {
      console.log("Loaded");
      map.current.addSource("photos", {
        type: "geojson",
        data: "./api/images/pictures.geojson",
      });

      map.current.addLayer(
        {
          id: "photos-heat",
          type: "heatmap",
          source: "photos",
          maxzoom: 15,
          paint: {
            // increase intensity as zoom level increases
            "heatmap-intensity": {
              stops: [
                [11, 1],
                [15, 3],
              ],
            },
            // assign color values be applied to points depending on their density
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(30,30,34,0)",
              0.2,
              "rgb(85,86,95)",
              0.4,
              "rgb(105,154,219)",
              0.6,
              "rgb(103,120,207)",
              0.8,
              "rgb(28,88,153)",
            ],
            // increase radius as zoom increases
            "heatmap-radius": {
              stops: [
                [11, 15],
                [15, 20],
              ],
            },
            // decrease opacity to transition into the circle layer
            "heatmap-opacity": {
              default: 1,
              stops: [
                [14, 1],
                [15, 0],
              ],
            },
          },
        },
        "waterway-label"
      );

      map.current.addLayer(
        {
          id: "photos-point",
          type: "circle",
          source: "photos",
          minzoom: 14,
          paint: {
            // increase the radius of the circle as the zoom level and dbh value increases
            "circle-radius": {
              property: "dbh",
              type: "exponential",
              stops: [
                [{ zoom: 15, value: 1 }, 5],
                [{ zoom: 15, value: 62 }, 10],
                [{ zoom: 22, value: 1 }, 20],
                [{ zoom: 22, value: 62 }, 50],
              ],
            },
            "circle-color": "rgb(28,88,153)",
            "circle-stroke-color": "white",
            "circle-stroke-width": 1,
            "circle-opacity": {
              stops: [
                [14, 0],
                [15, 1],
              ],
            },
          },
        },
        "waterway-label"
      );
    });

    map.current.on("click", "photos-point", (event: any) => {
      console.log(event.features);
      new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(
          `<span style="color: black">
            <strong>${
              event.features[0].properties.place || "Unknown place"
            }</strong> 
            <br />
            <strong>Taken:</strong> ${new Date(
              event.features[0].properties.taken
            ).toLocaleString(["en-US"], {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            <br />
            <strong>ID:</strong> ${event.features[0].properties.id}
            <br />
            <a href="/photo/${event.features[0].properties.id}">View</a>
          </span>`
        )
        .addTo(map.current);
    });
  }, []);

  const timeAgo = new TimeAgo("en-US");
  const size = useWindowSize();

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

    const photosPromise = fetch("/api/images/all?take=25").then((res) =>
      res.json()
    );

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
                <div
                  key={idx}
                  style={{
                    width: `${
                      size.width < 768
                        ? "calc(100% - 2rem);"
                        : row.width * (384 / row.height)
                    }px`,
                    height:
                      size.width < 768
                        ? row.height * (384 / row.width)
                        : "384px",
                    cursor: "pointer",
                  }}
                >
                  <Link href={`/photo/${row.id}`}>
                    <div>
                      <Image
                        src={`/photos/${row.filepath}`}
                        width={
                          size.width < 768
                            ? size.width - 32
                            : row.width * (384 / row.height)
                        }
                        height={
                          size.width < 768
                            ? row.height * (384 / row.width)
                            : 384
                        }
                        key={idx}
                        layout={"fixed"}
                        className="shimmer"
                      />
                      <footer>
                        <span>
                          {row.place}
                          {row.place && ", "}
                          {
                            locations.filter((loc) => loc.id == row.location)[0]
                              .name
                          }
                        </span>{" "}
                        <small>
                          <span
                            title={`${new Date(
                              Date.parse(row.taken)
                            ).toLocaleDateString(undefined, {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                            })}`}
                          >
                            {timeAgo.format(Date.parse(row.taken))}
                          </span>{" "}
                          ·{" "}
                          {tags.map((obj, idx) => {
                            if (obj.id == row.primaryTag) {
                              return (
                                <>
                                  <span>{obj.emoji}</span>{" "}
                                  <span>{obj.name}</span>
                                </>
                              );
                            }
                          })}
                        </small>
                      </footer>
                    </div>
                  </Link>
                </div>
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
                          src={`/photos/${locrow.cover}`}
                          objectFit="cover"
                          width={size.width < 860 ? size.width : size.width / 3}
                          layout="fill"
                          className="shimmer"
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

      <section className="section">
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

      <section
        className="section"
        style={{
          paddingBottom: "5rem",
        }}
      >
        <h2>Map</h2>
        <div className="headingDecoration" />

        <div>
          <div ref={mapContainer} className={styles.mapContainer} />
        </div>
      </section>

      <Footer />
    </>
  );
}
