import OrderedListNumber from "./OrderedListNumber";

interface Props {
  children?: React.ReactNode;
  i: number;
}
const Instruction = ({ children, i }: Props) => (
  <div className="self-stretch justify-start items-center gap-3 inline-flex">
    <OrderedListNumber num={i} />
    <div className=" text-neutral-200 text-[13px] font-normal font-['Inter']">
      {children}
    </div>
  </div>
);
export default Instruction;
