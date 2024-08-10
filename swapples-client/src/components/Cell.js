

export default function Cell ({ item, onClick, isSelected }) {
    return (
      <div
        className={`cell w-[50px] h-[50px] flex justify-center 
            align-middle items-center border-red-100 border-2 cursor-pointer text-lg 
            ${isSelected ? "selected bg-blue-300" : ""}`}
        onClick={onClick}
      >
        {item}
      </div>
    );
  };