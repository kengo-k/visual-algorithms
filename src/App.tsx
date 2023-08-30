interface BoxProps {
  value: number;
}

const Box: React.FC<BoxProps> = ({ value }) => {
  return (
    <div className="w-16 h-16 border border-black m-4 flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg">
      {value}
    </div>
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
  return <Simple values={[1, 2, 3, 4, 5]} />;
}

export default App;
