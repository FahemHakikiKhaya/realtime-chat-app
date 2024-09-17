import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { FC, PropsWithChildren, ReactNode } from "react";

export type ModalProps = PropsWithChildren<{
  onClose: () => void;
  action?: ReactNode;
  opened: boolean;
  title?: string;
  description?: string;
  noPadding?: boolean;
}>;

const Modal: FC<PropsWithChildren<ModalProps>> = ({
  action,
  onClose,
  opened,
  title,
  description,
  children,
  noPadding = false,
}) => {
  return (
    <Dialog open={opened} onClose={onClose} className="relative z-50">
      <div
        className={`fixed inset-0 flex w-screen items-center justify-center`}
      >
        <DialogPanel
          transition
          className={`w-full max-w-md rounded-xl ${
            noPadding ? "p-0" : "p-6"
          } bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0`}
        >
          <DialogTitle className="font-bold">{title}</DialogTitle>
          {description && (
            <Description className="mt-2 text-neutral-500">
              {description}
            </Description>
          )}{" "}
          {children}
          {action && (
            <div className="flex flex-row gap-4 justify-end mt-4">{action}</div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default Modal;
