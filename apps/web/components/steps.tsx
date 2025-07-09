import { Check, Circle } from "lucide-react";

interface Props {
  name: string;
  status: "completed" | "pending";
}

export const StepsComponent = ({ name, status }: Props) => {
  return (
    <>
      <div className="border-md my-4 flex w-full items-center gap-4 bg-black text-white">
        {status === "completed" ? <Check /> : <Circle />}
        <p>Creating {name}</p>
      </div>
    </>
  );
};
