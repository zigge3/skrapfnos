import Head from "next/head";
import { Start, Stop } from "../javascripts/game.js";
import { StartKonva } from "../javascripts/konva.js";
import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState, Fragment } from "react";
export default function Home() {
  const gameContainer = useRef("");
  const konvaContainer = useRef("");
  const mediaStream = useRef("");
  const analyserRef = useRef("");
  const [appStarted, setAppStarted] = useState(false);
  useEffect(() => {
    if (appStarted) {
      const objs = Start(
        gameContainer.current,
        mediaStream.current,
        analyserRef.current
      );
      StartKonva(konvaContainer.current);
      return () => {
        //Stop(objs);
      };
    }
  }, [appStarted]);
  return (
    <div className={styles.main}>
      {appStarted && (
        <Fragment>
          <div className={styles.stacked} ref={konvaContainer}></div>
          <div className={styles.stacked} ref={gameContainer}></div>
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
                      navigator.mediaDevices
                        .getUserMedia({ audio: true })
                        .then((ms) => {
                          window.AudioContext =
                            window.AudioContext || window.webkitAudioContext;
                          const context = new AudioContext();
                          const microphone = context.createMediaStreamSource(
                            ms
                          );
                          const filter = context.createBiquadFilter();
                          // microphone -> filter -> destination
                          microphone.connect(filter);
                          filter.connect(context.destination);
                          mediaStream.current = filter;
                          setAppStarted(true);
                        });
                    }
                  }
                );
              } else {
                navigator.mediaDevices
                  .getUserMedia({ audio: true })
                  .then((ms) => {
                    const audioContext = new AudioContext();
                    const analyser = audioContext.createAnalyser();
                    const microphone = audioContext.createMediaStreamSource(ms);
                    const javascriptNode = audioContext.createScriptProcessor(
                      2048,
                      1,
                      1
                    );

                    analyser.smoothingTimeConstant = 0.8;
                    analyser.fftSize = 1024;

                    microphone.connect(analyser);
                    analyser.connect(javascriptNode);
                    javascriptNode.connect(audioContext.destination);
                    mediaStream.current = javascriptNode;
                    analyserRef.current = analyser;
                    setAppStarted(true);
                  });
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
