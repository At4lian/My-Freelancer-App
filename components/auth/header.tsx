import Image from "next/image";


interface HeaderProps {
  label: string;
};

export const Header = ({
  label,
}: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <Image
          src="/logo.svg"
          alt="Logo"
          width={200}
          height={200}
        />
      <p className="text-muted-foreground text-sm">
        {label}
      </p>
    </div>
  );
};
