import { motion } from "framer-motion";
import { useEffect } from "react";
import { create } from "zustand";

interface State {
  values: number[];
  locations: {
    [value: string]: { x: number; y: number };
  };
  index: number;
  init: (values: number[], index: number) => void;
  move: (value: number, x: number, y: number) => void;
}

const useStore = create<State>((set) => ({
  values: [],
  locations: {},
  index: 0,
  init: (values: number[], index: number) => {
    const locations: State["locations"] = {};
    for (const v of values) {
      locations[v] = { x: 0, y: 0 };
    }
    set({ values, locations, index });
  },
  update: (values: number[], index: number) => {
    set({ values, index });
  },
  move: (value: number, x: number, y: number) => {
    set((state) => {
      const locations = { ...state.locations };
      locations[value] = { x, y };
      return { ...state, locations };
    });
  },
}));

const size = 20;

const Box: React.FC<{ value: number }> = ({ value }) => {
  //const [position, setPosition] = useState({ x: 0, y: 0 });
  const { locations } = useStore();
  const loc = locations[value];
  console.log("render box:", value, loc);
  // useEffect(() => {
  //   setPosition((prev) => ({ x: prev.x + loc.x, y: prev.y + loc.y }));
  // }, [loc]);
  return (
    <motion.div animate={loc}>
      <div
        className={`w-${size} h-${size} border-dashed border-2 border-sky-200 rounded-md bg-sky-50 flex items-center justify-center text-2xl font-bold text-blue-800`}
      >
        {value}
      </div>
    </motion.div>
  );
};

const sleep = () => {
  return new Promise((resolve) => setTimeout(resolve, 300));
};

async function insert(
  move: (value: number, x: number, y: number) => void,
  values: number[],
  fromIndex: number,
  toIndex: number
) {
  let from = values.findIndex((v) => v === values[fromIndex]);
  let to = values.findIndex((v) => v === values[toIndex]);
  move(values[fromIndex], 0, size * 4);
  await sleep();
  for (let i = to; i < from; i++) {
    move(values[i], size * 4, 0);
  }
  await sleep();
  move(values[fromIndex], -(from - to) * size * 4, 0);
  await sleep();
}

const Simple: React.FC = () => {
  const { move, values, index, init } = useStore();
  const onClick = async () => {
    const newValues = [...values];
    const value = newValues[index];
    let j = index - 1;
    while (j >= 0 && newValues[j] > value) {
      newValues[j + 1] = newValues[j];
      j--;
    }
    newValues[j + 1] = value;
    await insert(move, values, index, j + 1);
    init(newValues, index + 1);
  };

  console.log("render:", values);
  return (
    <>
      <div className="flex">
        {values.map((value) => (
          <Box key={value} value={value} />
        ))}
        <button onClick={onClick}>click</button>
      </div>
    </>
  );
};

function App() {
  const { init } = useStore();
  useEffect(() => {
    init([7, 3, 1, 5, 2, 9, 8, 4, 6], 1);
  }, [init]);
  return <Simple />;
}

export default App;
