import styles from "./Empty.module.css";
import CloseIcon from "./assets/CancelMajor.svg";

const EmptyState = ({ close }) => {
  return (
    <div className={styles.emptyStateContainert}>
      <div className={styles.wrapperClose} onClick={close}>
        <CloseIcon />
      </div>
      Ops, sua sacolinha ainda está pelada.
    </div>
  );
};

export default EmptyState;
