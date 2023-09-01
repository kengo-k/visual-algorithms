import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { create } from "zustand";

interface Element {
  value: number;
  x: number;
  y: number;
}

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

const size = 20;

const Box: React.FC<BoxProps> = ({ value }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { locations } = useStore();
  const loc = locations[value];
  useEffect(() => {
    setPosition((prev) => ({ x: prev.x + loc.x, y: prev.y + loc.y }));
  }, [loc]);
  return (
    <motion.div animate={position}>
      <div
        className={`w-${size} h-${size} border-dashed border-2 border-sky-200 rounded-md bg-sky-50 flex items-center justify-center text-2xl font-bold text-blue-800`}
      >
        {value}
      </div>
    </motion.div>
  );
};

// interface SimpleProps {
//   values: number[];
// }

function* myMove(
  move: (value: number, x: number, y: number) => void,
  values: number[]
) {
  const from = values.findIndex((v) => v === 1) + 1;
  const to = values.findIndex((v) => v === 9) + 1;
  move(1, 0, size * 4);
  yield;
  for (let i = from; i < to; i++) {
    move(values[i], -size * 4, 0);
  }
  yield;
  move(1, (to - from) * size * 4, -size * 4);
}

const Simple: React.FC = () => {
  const { move, values } = useStore();
  console.log("values:", values);

  const [gen, setGen] = useState(myMove(move, values));
  const onClick = () => {
    let { done } = gen.next();
    if (done) {
      console.log("done");
    }
  };

  useEffect(() => {
    setGen(myMove(move, values));
  }, [values, move]);

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
  const { init } = useStore();
  useEffect(() => {
    init([3, 7, 1, 5, 2, 9, 8, 4, 6]);
  }, [init]);
  return <Simple />;
}

export default App;
