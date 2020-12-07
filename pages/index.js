import Head from "next/head";
import { Start, Stop } from "../javascripts/game.js";
import { StartKonva } from "../javascripts/konva.js";
import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState, Fragment } from "react";
export default function Home() {
  const gameContainer = useRef("");
  const konvaContainer = useRef("");
  const [appStarted, setAppStarted] = useState(false);
  useEffect(() => {
    if (appStarted) {
      const objs = Start(gameContainer.current);
      StartKonva(konvaContainer.current);
      return () => {
        Stop(objs);
      };
    }
  }, [appStarted]);
  return (
    <div className={styles.main}>
      {appStarted && (
        <Fragment>
          <div className={styles.container} ref={konvaContainer}></div>
          <div className={styles.container} ref={gameContainer}></div>
        </Fragment>
      )}
      {!appStarted && (
        <div className={styles.container}>
          <button
            onClick={() => {
              if (
                typeof DeviceOrientationEvent !== "undefined" &&
                typeof DeviceOrientationEvent.requestPermission === "function"
              ) {
                DeviceOrientationEvent.requestPermission().then(
                  (permissionState) => {
                    if (permissionState === "granted") {
                      setAppStarted(true);
                    }
                  }
                );
              } else {
                setAppStarted(true);
              }
            }}
          >
            Starta
          </button>
        </div>
      )}
    </div>
  );
}
