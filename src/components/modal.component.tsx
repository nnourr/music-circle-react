import { motion } from "framer-motion";
import Button, { btnSizes } from "./inputs/button.input.component";
import { ReactNode } from "react";

interface ActionData {
  actionTitle: string;
  actionText: string;
  onAction: () => any;
}

interface ModalComponentProps {
  promptText: ReactNode;
  cancelAction: ActionData;
  confirmAction: ActionData;
  onClose: () => any;
}

export const ModalComponent: React.FC<ModalComponentProps> = ({
  promptText,
  cancelAction,
  confirmAction,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key="leaveCircleModal"
      className="h-full w-full z-50 flex justify-center items-center absolute top-0 left-0"
    >
      <motion.div className="w-[90%] lg:w-[43rem] lg:min-h-80 border-white/50 border-4 bg-black rounded-3xl gap-12 px-6 lg:px-12 py-4 lg:py-8 flex flex-col justify-between">
        <h2 className="text-white text-1xl lg:text-lg-1xl leading-tight">
          {promptText}
        </h2>
        <div className="flex w-full flex-col lg:flex-row items-end justify-end gap-4 mb-4 lg:gap-6">
          <Button
            onClick={cancelAction.onAction}
            title={cancelAction.actionTitle}
            white={true}
            btnSize={btnSizes.md}
            className=" !w-full lg:w-auto"
          >
            {cancelAction.actionText}
          </Button>
          <Button
            onClick={confirmAction.onAction}
            title={confirmAction.actionTitle}
            white={true}
            btnSize={btnSizes.md}
            className="overflow-hidden relative !w-full lg:w-auto"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-40 bg-linear-gradient" />
            <span className="relative z-20">{confirmAction.actionText}</span>
          </Button>
        </div>
      </motion.div>
      <div
        className="h-full w-full -z-10 bg-black/60 absolute top-0 left-0"
        onClick={onClose}
      ></div>
    </motion.div>
  );
};
