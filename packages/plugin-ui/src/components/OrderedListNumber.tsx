type Props = { num: number | string };
const OrderedListNumber = ({ num }: Props) => (
  <div className="w-6 h-6 relative rounded-full bg-neutral-800 flex content-center justify-center pt-[3px]">
    <span className="text-neutral-200 text-[13px] font-normal font-['Inter']">
      {num}
    </span>
  </div>
);
export default OrderedListNumber;
