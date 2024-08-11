

export default function Cell ({ item, onClick, isSelected }) {
    return (
      <div
        className={`cell w-[50px] h-[50px] flex justify-center bg-slate-800 
            align-middle items-center border-slate-700 border-[1px] cursor-pointer text-lg 
            ${isSelected ? "selected bg-blue-300" : ""}`}
        onClick={onClick}
      >
        {item}
      </div>
    );
  };