const { Engine, Render, Runner, World, Bodies } = Matter;

const engine = Engine.create();
const runner = Runner.create();

function createBoop() {
  const ball = Bodies.circle(Math.round(Math.random() * 1280), -30, 25, {
    angle: Math.PI * (Math.random() * 2 - 1),
    friction: 0.001,
    frictionAir: 0.01,
    restitution: 0.8,
    render: {
      sprite: {
        texture: 'https://static-cdn.jtvnw.net/emoticons/v1/301299185/2.0',
      },
    },
  });

  setTimeout(() => {
    World.remove(engine.world, ball);
  }, 30000);

  return ball;
}

const addBoop = () => {
  const boop = createBoop();
  World.add(engine.world, [boop]);
};

export const checkForBoops = (emotes) => {
  emotes.forEach((emote) => {
    if (emote.id === '301299185') {
      for (let i = 1; i <= emote.count; i++) {
        addBoop();
      }
    }
  });
};

export function init(selector) {
  const world = document.querySelector(selector);

  const render = Render.create({
    element: 'div',
    canvas: world,
    engine: engine,
    options: {
      width: 1280,
      height: 720,
      background: 'transparent',
      wireframes: false,
    },
  });

  const boundaryOptions = {
    isStatic: true,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'transparent',
    },
  };
  const ground = Bodies.rectangle(640, 720, 1300, 4, boundaryOptions);
  const leftWall = Bodies.rectangle(0, 360, 4, 740, boundaryOptions);
  const rightWall = Bodies.rectangle(1280, 360, 4, 800, boundaryOptions);

  World.add(engine.world, [ground, leftWall, rightWall]);

  Render.run(render);
  Runner.run(runner, engine);
}
