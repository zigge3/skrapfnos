import {Engine, Render, World, Bodies} from 'matter-js'
export function Start(container) {
    const {innerHeight, innerWidth} = window;
    const engine = Engine.create({
        options: {
            width: innerWidth,
            height: innerHeight
        }
    });

    // create a renderer
    const render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: innerWidth,
            height: innerHeight
        }
    });

    // create two boxes and a ground
    const boxA = Bodies.rectangle(innerWidth / 2, innerHeight / 2, 20, 20);
    const boxB = Bodies.rectangle(innerWidth / 2, innerHeight / 2, 20, 20);
    const wall1 = Bodies.rectangle(innerWidth / 2, innerHeight + 25, innerWidth, 50, { isStatic: true });
    const wall2 = Bodies.rectangle(-25, (innerHeight / 2), 50, innerHeight, { isStatic: true });
    const wall3 = Bodies.rectangle(innerWidth / 2, -25, innerWidth, 50, { isStatic: true });
    const wall4 = Bodies.rectangle(innerWidth + 25, (innerHeight / 2), 50, innerHeight, { isStatic: true });
    // add all of the bodies to the world
    World.add(engine.world, [boxA, boxB, wall1, wall2, wall3, wall4]);

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        alert("asd")
        DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
        if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', event => {
                engine.world.gravity.x = event.beta / 180;
                engine.world.gravity.y = event.gamma / 180; 
            });
        }
    })
    .catch(console.error);
    } else {
    // handle regular non iOS 13+ devices
    console.log ("not iOS");
    }


    return {render, engine}
}

export function Stop({engine, render}) {
    engine.world && World.clear(engine.world);
    Engine.clear(engine);
    Render.stop(render);
    render.canvas.remove();
    render.canvas = null;
    render.context = null;
    render.textures = {};
}

