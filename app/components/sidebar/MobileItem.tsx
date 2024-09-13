import Link from "next/link";
import { FC } from "react";

interface MobileItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const MobileItem: FC<MobileItemProps> = ({
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
    <li onClick={handleClick} className="flex-1">
      <Link href={href} className="flex flex-row justify-center">
        <Icon className="h-6 w-6 shrink-0 text-4xl" />
      </Link>
    </li>
  );
};

export default MobileItem;
