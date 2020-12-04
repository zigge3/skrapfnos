import Head from "next/head";
import { Start, Stop } from "../javascripts/game.js";
import styles from "../styles/Home.module.css";
import { useEffect, useRef } from "react";
export default function Home() {
  const gameContainer = useRef("");
  useEffect(() => {
    const objs = Start(gameContainer.current);
    return () => {
      Stop(objs);
    };
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.container} ref={gameContainer}></div>
    </div>
  );
}
