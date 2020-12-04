import Head from "next/head";
import { Start, Stop } from "../javascripts/game.js";
import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
export default function Home() {
  const gameContainer = useRef("");
  const [appStarted, setAppStarted] = useState(false);
  useEffect(() => {
    if (appStarted) {
      const objs = Start(gameContainer.current);
      return () => {
        Stop(objs);
      };
    }
  }, [appStarted]);
  return (
    <div className={styles.main}>
      {appStarted && (
        <div className={styles.container} ref={gameContainer}></div>
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
