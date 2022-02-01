import styles from "../styles/Footer.module.scss";
import Link from "next/link";

export default function Footer() {
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
            <a className="nostyle">v2.2</a>
          </Link>
        </span>
        <span>Copyright ©️ znepb 2022</span>
        <img src="/logo.svg" height={25} />
      </footer>
    </div>
  );
}
