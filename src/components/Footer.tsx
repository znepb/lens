import styles from "../styles/Footer.module.scss";
import Link from "next/link";

import changelog from "../json/changelog.json";
import { Patch } from "../types";

export default function Footer() {
  const latestVersion: Patch = changelog[0];

  return (
    <div className={styles.footer}>
      <span>
        <a href="https://znepb.me">Home</a>
        <span>•</span>
        <Link href="/">
          <a
            style={{
              fontWeight: "bold",
              color: "#0066ff",
            }}
          >
            Lens
          </a>
        </Link>
        <span>•</span>
        <a href="https://analytics.znepb.me">Analytics</a>
        <span>•</span>
        <a href="https://countdowns.znepb.me">Countdowns</a>
        <span>•</span>
        <a href="https://files.znepb.me">Files</a>
      </span>
      <footer>
        <span>
          <Link href="/changes">
            <Link href="/changes">
              <a className="nostyle">
                v
                {latestVersion.version.map((n: number, i: number) => {
                  if (i == latestVersion.version.length - 1) {
                    return <span key={i}>{n}</span>;
                  } else {
                    return <span key={i}>{n}.</span>;
                  }
                })}
                {latestVersion.suffix}
              </a>
            </Link>
          </Link>
        </span>
        <span>Copyright ©️ znepb 2022</span>
        <img src="/logo.svg" height={25} />
      </footer>
    </div>
  );
}
