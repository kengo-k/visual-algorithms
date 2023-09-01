import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
  move: (value: number, x: number, y: number) => void;
}

const useStore = create<State>((set) => ({
  values: [],
  locations: {},
  init: (values: number[]) => {
    set({ values });
    const locations: State["locations"] = {};
    for (const v of values) {
      locations[v] = { x: 0, y: 0 };
    }
    set({ locations });
  },
  move: (value: number, x: number, y: number) => {
    set((state) => {
      const locations = { ...state.locations };
      locations[value] = { x, y };
      return { ...state, locations };
    });
  },
}));

interface BoxProps {
  value: number;
}

const Box: React.FC<BoxProps> = ({ value }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { locations } = useStore();
  const loc = locations[value];
  useEffect(() => {
    setPosition((prev) => ({ x: prev.x + loc.x, y: prev.y + loc.y }));
  }, [loc]);
  return (
    <motion.div animate={position}>
      <div className="w-16 h-16 border border-black m-4 flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg">
        {value}
      </div>
    </motion.div>
  );
};

interface SimpleProps {
  values: number[];
}

const Simple: React.FC<SimpleProps> = ({ values }) => {
  const { move } = useStore();
  const onClick = () => {
    move(3, 100, 100);
  };
  return (
    <>
      <div className="flex">
        {values.map((value) => (
          <Box key={value} value={value} />
        ))}
      </div>
      <button onClick={onClick}>click</button>
    </>
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
