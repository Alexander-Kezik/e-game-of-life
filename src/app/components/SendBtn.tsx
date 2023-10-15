import { FC, ReactNode, MouseEvent } from "react";
import clsx from "clsx";

interface IProps {
  children: ReactNode;
  disabled: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const SendBtn: FC<IProps> = ({ children, disabled, className, ...props }) => {
  return (
    <button
      {...props}
      className={clsx(
        "input-send-btn",
        disabled ? "btn-disabled" : "bg-success cursor-pointer",
        className && className,
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default SendBtn;
