import { FC } from "react";

interface IProps {
  clearMessages: () => void;
}

const ClearMessagesHistoryBtn: FC<IProps> = ({ clearMessages }) => {
  return (
    <button onClick={clearMessages} className="btn-main bg-amber-500 absolute top-[80px] right-[20px]">
      Clean history
    </button>
  );
};

export default ClearMessagesHistoryBtn;
