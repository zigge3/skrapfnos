import { Engine, Render, World, Bodies, Events } from "matter-js";
import Matter from "matter-js";
import MatterAttractors from "matter-attractors";
Matter.use(MatterAttractors);
import { debounce } from "underscore";
export function Start(container, filter, analyser) {
  const { innerHeight, innerWidth } = window;
  let counterGrav = 0;
  setTimeout(function () {
    window.scrollTo(0, 1);
  }, 1000);
  const engine = Engine.create({
    options: {
      width: innerWidth,
      height: innerHeight,
    },
  });

  // create a renderer
  const render = Render.create({
    element: container,
    engine: engine,
    options: {
      width: innerWidth,
      height: innerHeight,
      wireframes: false,
      background: "transparent",
    },
  });

  // create two boxes and a ground
  const boxA = Bodies.rectangle(innerWidth / 2, innerHeight / 2, 20, 20);
  const boxB = Bodies.rectangle(innerWidth / 2, innerHeight / 2, 20, 20);

  const wall1 = Bodies.rectangle(
    innerWidth / 2,
    innerHeight + 25,
    innerWidth,
    50,
    { isStatic: true }
  );
  var body = Matter.Bodies.circle(innerWidth / 2, innerHeight + 50, 10, {
    isStatic: true,
    plugin: {
      attractors: [
        function (bodyA, bodyB) {
          return {
            x: counterGrav * ((bodyA.position.x - bodyB.position.x) * 1e-6),
            y: counterGrav * ((bodyA.position.y - bodyB.position.y) * 1e-6),
          };
        },
      ],
    },
  });
  const wall2 = Bodies.rectangle(-25, innerHeight / 2, 50, innerHeight, {
    isStatic: true,
  });
  const wall3 = Bodies.rectangle(innerWidth / 2, -25, innerWidth, 50, {
    isStatic: true,
  });
  const wall4 = Bodies.rectangle(
    innerWidth + 25,
    innerHeight / 2,
    50,
    innerHeight,
    { isStatic: true }
  );

  Events.on(engine, "afterUpdate", () => {
    engine.world.bodies.forEach((b) => {
      if (
        Math.abs(b.position.y) > innerHeight * 2 ||
        Math.abs(b.position.x) > innerWidth * 2
      ) {
        World.remove(engine.world, b);
      }
    });
  });
  // add all of the bodies to the world
  World.add(engine.world, [body, boxA, boxB, wall1, wall2, wall3, wall4]);

  // run the engine
  Engine.run(engine);

  // run the renderer
  Render.run(render);
  window.addEventListener("deviceorientation", (event) => {
    const x = event.beta;
    const y = event.gamma;
    if (x > 90) {
      x = 90;
    }
    if (x < -90) {
      x = -90;
    }
    engine.world.gravity.x = y / 90;
    engine.world.gravity.y = x / 90;
  });

  filter.onaudioprocess = debounce(function () {
    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    var values = 0;

    var length = array.length;
    for (var i = 0; i < length; i++) {
      values += array[i];
    }

    var average = values / length;

    if (average > 20) {
      counterGrav = -Math.round(average / 20);
    } else {
      counterGrav = 0;
    }
  }, 10);

  let isDragging = false;
  container.addEventListener("mousedown", (e) => {
    isDragging = true;
  });
  const lazyDrag = debounce((e) => {
    e.preventDefault();
    if (isDragging) {
    } else if (e.type === "touchmove") {
      spawnFnos({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        color: "white",
      });
    }
  }, 10);
  container.addEventListener("mousemove", lazyDrag);
  container.addEventListener("touchmove", lazyDrag);
  container.addEventListener("mouseup", (e) => {
    isDragging = false;
  });
  function spawnFnos({ color, x, y }) {
    const fnos = Bodies.rectangle(x, y, 20, 20, {
      color: color,
    });
    World.add(engine.world, [fnos]);
  }
  return { render, engine };
}

export function Stop({ engine, render }) {
  engine.world && World.clear(engine.world);
  Engine.clear(engine);
  Render.stop(render);
  render.canvas.remove();
  render.canvas = null;
  render.context = null;
  render.textures = {};
}
