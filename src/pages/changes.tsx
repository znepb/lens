import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

import Footer from "../components/Footer";

import Head from "next/head";
import { useState } from "react";

import changelog from "../json/changelog.json";

import { Patch } from "../types";

TimeAgo.addLocale(en);

export default function Changes() {
  const timeAgo = new TimeAgo("en-US");

  return (
    <>
      <Head>
        <title>Changes - Lens</title>
      </Head>

      <section className="header" id="header">
        <div></div>
        <h2>Changelog</h2>
        <div></div>
      </section>
      <section
        className="section"
        id="changes"
        style={{
          paddingBottom: "5rem",
        }}
      >
        {changelog.map((change: Patch, index: number) => (
          <section key={index}>
            <h2>
              {change.version.map((n: number, i: number) => {
                if (i == change.version.length - 1) {
                  return <span key={i}>{n}</span>;
                } else {
                  return <span key={i}>{n}.</span>;
                }
              })}
              {change.suffix}
            </h2>
            <div className="headingDecoration"></div>
            <h3>
              {change.date} (
              {timeAgo.format(new Date(`${change.date} ${change.time}`))})
            </h3>
            <ul>
              {change.notes.map((note: string) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        ))}
      </section>
      <Footer />
    </>
  );
}
