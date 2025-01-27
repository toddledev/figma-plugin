import { HTMLPreview } from "types";

const SCALE_WIDTH = 332;
const SCALE_HEIGHT = SCALE_WIDTH;

const Preview: React.FC<{
  htmlPreview: HTMLPreview;
}> = (props) => {
  const scaleFactor = Math.min(
    SCALE_WIDTH / props.htmlPreview.size.width,
    SCALE_HEIGHT / props.htmlPreview.size.height,
  );

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-center items-center">
        <div
          className="relative flex flex-col items-center p-1 bg-neutral-800 border border-neutral-200 rounded-md "
          style={{
            width: SCALE_WIDTH,
            height: SCALE_HEIGHT,
          }}
        >
          <div
            className="flex flex-col justify-center items-center w-full h-full"
            style={{
              clipPath: "inset(0px round 6px)",
            }}
          >
            <div
              style={{
                zoom: scaleFactor,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              dangerouslySetInnerHTML={{
                __html: props.htmlPreview.content,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Preview;
