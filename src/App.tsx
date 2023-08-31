import { useEffect } from "react";
import { animated, useSpring } from "react-spring";
import { create } from "zustand";

interface Location {
  x: number;
  y: number;
}

interface State {
  values: number[];
  locations: {
    [value: string]: Location;
  };
  init: (values: number[]) => void;
}

const useStore = create<State>((set) => ({
  values: [],
  locations: {},
  init: (values: number[]) => {
    set({ values });
  },
}));

interface BoxProps {
  value: number;
}

const Box: React.FC<BoxProps> = ({ value }) => {
  const styles = useSpring({ transform: "translate3d(0, 0, 0)" });
  return (
    <animated.div style={styles}>
      <div className="w-16 h-16 border border-black m-4 flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg">
        {value}
      </div>
    </animated.div>
  );
};

interface SimpleProps {
  values: number[];
}

const Simple: React.FC<SimpleProps> = ({ values }) => {
  return (
    <div className="flex">
      {values.map((value, index) => (
        <Box key={index} value={value} />
      ))}
    </div>
  );
};

function App() {
  const { values, init } = useStore();
  useEffect(() => {
    init([3, 7, 1, 5, 2, 9, 8, 4, 6]);
  }, [init]);
  return <Simple values={values} />;
}

export default App;
