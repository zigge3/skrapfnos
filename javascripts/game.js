import { Engine, Render, World, Bodies } from "matter-js";
import { debounce } from "underscore";
export function Start(container) {
  const { innerHeight, innerWidth } = window;
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
  // add all of the bodies to the world
  World.add(engine.world, [boxA, boxB, wall1, wall2, wall3, wall4]);

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
    engine.world.gravity.x = (y / 90) * 2;
    engine.world.gravity.y = (x / 90) * 2;
  });
  let isDragging = false;
  container.addEventListener("mousedown", (e) => {
    isDragging = true;
  });
  const lazyDrag = debounce((e) => {
    if (isDragging) {
      spawnFnos({ x: e.clientX, y: e.clientY, color: "white" });
    }
  }, 10);
  container.addEventListener("mousemove", lazyDrag);
  container.addEventListener("mouseup", (e) => {
    isDragging = false;
  });
  function spawnFnos({ color, x, y }) {
    console.log(x, y);
    const fnos = Bodies.rectangle(x, y, 2, 2, {
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
