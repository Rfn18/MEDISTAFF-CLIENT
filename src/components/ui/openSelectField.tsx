const OpenSelectField = ({ onOpen }: { onOpen: () => void }) => {
  return (
    <button
      onClick={onOpen}
      className="cursor-pointer hover:bg-background transition border border-border w-full text-sm text-blue-dark py-2 px-3 mt-1 rounded-md focus:outline-3 focus:outline-blue-soft/20 focus:border-blue-soft"
    >
      Select Employee
    </button>
  );
};

export default OpenSelectField;
