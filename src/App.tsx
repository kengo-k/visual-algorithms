import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
  console.log("render: ", value);
  const { locations } = useStore();
  const loc = locations[value];
  return (
    <motion.div animate={loc}>
      <div
        className={`w-${size} h-${size} border-2 border-sky-200 rounded-md bg-sky-50 flex items-center justify-center text-2xl font-bold text-blue-800`}
      >
        {value}
      </div>
    </motion.div>
  );
};

const sleep = () => {
  return new Promise((resolve) => setTimeout(resolve, 200));
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

const InsertionSort: React.FC = () => {
  const { move, values, index, init } = useStore();
  const [disabled, setDisabled] = useState(false);

  // Once the sorting is complete, the button should be deactivated thereafter
  useEffect(() => {
    if (index === values.length) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [values, index]);

  const onClick = async function () {
    setDisabled(true);
    const newValues = [...values];
    const value = newValues[index];
    let j = index - 1;
    while (j >= 0 && newValues[j] > value) {
      newValues[j + 1] = newValues[j];
      j--;
    }
    newValues[j + 1] = value;
    console.log("--- insert ---");
    await insert(move, values, index, j + 1);
    console.log("--- re init ---");
    init(newValues, index + 1);
    setDisabled(false);
  };

  return (
    <>
      <div className="flex">
        {values.map((value, i) => (
          <Box key={i < index ? `${value}-${i}` : value} value={value} />
        ))}
        <button disabled={disabled} onClick={onClick}>
          click
        </button>
      </div>
    </>
  );
};

function App() {
  const { init } = useStore();
  useEffect(() => {
    console.log("--- init ---");
    init([7, 3, 1, 5, 2, 9, 8, 4, 6], 1);
  }, [init]);
  return <InsertionSort />;
}

export default App;
