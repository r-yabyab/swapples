

export default function Cell ({ item, onClick, isSelected, isHighlighted }) {
    return (
      <div
        className={`cell w-[50px] h-[50px] flex justify-center bg-slate-800 
            align-middle items-center border-slate-700 border-[1px] cursor-pointer text-lg 
            ${isSelected ? "bg-blue-200" : ""}
            ${isHighlighted ? 'bg-black' : ''}`
          }
        onClick={onClick}
      >
        {item}
      </div>
    );
  };