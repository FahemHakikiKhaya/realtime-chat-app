import Link from "next/link";
import { FC } from "react";

interface DesktopItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const DesktopItem: FC<DesktopItemProps> = ({
  label,
  icon: Icon,
  href,
  onClick,
  active,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <li onClick={handleClick}>
      <Link href={href} className="tooltip tooltip-right z-50" data-tip={label}>
        <Icon className="h-6 w-6 shrink-0" />
      </Link>
    </li>
  );
};

export default DesktopItem;
