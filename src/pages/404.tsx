import styles from "../styles/Error.module.scss";
import Link from "next/link";
import Head from "next/head";

export default function error404() {
  return (
    <>
      <Head>
        <title>404 - Lens</title>
      </Head>
      <section className={styles.header} id="header">
        <div></div>
        <article>
          <h2>404</h2>
          <div style={{ marginBottom: "0.5rem" }}>
            <a
              className="nostyle"
              href="https://www.youtube.com/watch?v=532j-186xEQ"
            >
              These aren&apos;t the droids you&apos;re looking for.
            </a>
          </div>
          <Link href="/">
            <a
              style={{
                color: "var(--lens)",
              }}
              className="nostyle"
            >
              Take me home
            </a>
          </Link>
        </article>
        <div></div>
      </section>
    </>
  );
}
