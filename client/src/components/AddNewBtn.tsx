// This component is to use to add new employee/department/role

type AddNewBtnProps = {
  handleClickButton: () => void;
  text: string;
};

export function AddNewBtn({ handleClickButton, text }: AddNewBtnProps) {
  return (
    <button
      className="add-new-btn"
      style={{
        position: "absolute",
        backgroundColor: "green",
        borderRadius: "20px",
        padding: "10px 20px",
        transition: "background-color 0.3s, color 0.3s",
        right: "180px",
        bottom: "7px",
      }}
      onClick={handleClickButton} // Removed the arrow function here
    >
      {text}
    </button>
  );
}
