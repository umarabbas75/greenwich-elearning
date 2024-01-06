const Dot = ({ color }: { color: string }) => {
  return (
    <div className={`w-3 h-3 rounded-full`} style={{ background: color }}></div>
  );
};

export default Dot;
