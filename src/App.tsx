import { animated, config, useSpring } from "react-spring";

function App() {
  const props = useSpring({
    to: { transform: "translateX(100px)" },
    from: { transform: "translateX(0px)" },
    config: config.wobbly,
  });

  return <animated.div style={props}>I will move</animated.div>;
}

export default App;
