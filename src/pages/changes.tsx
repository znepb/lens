import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

import Footer from "../components/Footer";

import Head from "next/head";

TimeAgo.addLocale(en);

export default function Changes() {
  const timeAgo = new TimeAgo("en-US");

  return (
    <>
      <Head>
        <title>Lens</title>
      </Head>

      <section className="header">
        <div> </div>
        <h2>Changelog</h2>
        <div></div>
      </section>
      <section
        className="section"
        style={{
          paddingBottom: "5rem",
        }}
      >
        <h2>2.2</h2>
        <div className="headingDecoration"></div>
        <h3>
          Jan 31 2022 ({timeAgo.format(new Date("Jan 31 2022 20:30:00"))})
        </h3>
        <ul>
          <li>Made Next images actually work as Next images</li>
          <li>Better loading times</li>
          <li>Fancy shimmer effect on image loading</li>
          <li>
            Add noscript message
            <noscript>. How are you seeing this right now?</noscript>
          </li>
        </ul>
        <h2>2.1</h2>
        <div className="headingDecoration"></div>
        <h3>Jan 3 2022 ({timeAgo.format(new Date("Jan 3 2022 15:30:00"))})</h3>
        <ul>
          <li>Happy new year</li>
          <li>Bug fixes</li>
        </ul>
        <h2>2.0</h2>
        <div className="headingDecoration"></div>
        <h3>
          Dec 25 2021 ({timeAgo.format(new Date("Dec 25 2021 12:00:00"))})
        </h3>
        <ul>
          <li>lens.znepb.me release, replacing photos.znepb.me.</li>
        </ul>
      </section>
      <Footer />
    </>
  );
}
