interface IActionBarProps {
  onReplyClick: () => void;
  onCollapse: () => void;
  childCommentsSize: number;
  isCollapsed: boolean;
  isDeleted: boolean;
}

export default function ActionBar(props: IActionBarProps) {
  const {
    isCollapsed,
    isDeleted,
    onReplyClick,
    onCollapse,
    childCommentsSize,
  } = props;

  return (
    <div className="flex mb-4 gap-4">
      {!isDeleted && (
        <button
          type="button"
          onClick={onReplyClick}
          className="mt-1 text-xs text-neutral-500 transition-colors hover:text-neutral-300"
        >
          Reply
        </button>
      )}

      {childCommentsSize > 0 && (
        <button
          type="button"
          onClick={onCollapse}
          className="mt-1 text-xs text-neutral-500 transition-colors hover:text-neutral-300"
        >
          {isCollapsed
            ? `Show ${childCommentsSize} child comments`
            : "Hide child comments"}
        </button>
      )}
    </div>
  );
}
