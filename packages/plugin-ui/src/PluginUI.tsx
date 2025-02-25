import {
  Framework,
  HTMLPreview,
  LinearGradientConversion,
  PluginSettings,
  SolidColorConversion,
  Warning,
} from "types";

import { useState } from "react";

import { TODDLE_TUTORIAL_URL, TODDLE_SIGNUP_URL } from "./toddle";

import copy from "copy-to-clipboard";

import ToddleLogo from "./components/ToddleLogo";
import LinkIcon from "./components/LinkIcon";
import Button from "./components/Button";
import Instruction from "./components/Instruction";
import Loading from "./components/Loading";
import Preview from "./components/Preview";
import WarningIcon from "./components/WarningIcon";

type PluginUIProps = {
  code: string;
  htmlPreview: HTMLPreview;
  warnings: Warning[];
  selectedFramework: Framework;
  setSelectedFramework: (framework: Framework) => void;
  settings: PluginSettings | null;
  onPreferenceChanged: (
    key: keyof PluginSettings,
    value: boolean | string,
  ) => void;
  colors: SolidColorConversion[];
  gradients: LinearGradientConversion[];
  isLoading: boolean;
  urlRequestCallback: (url: string) => void;
};

export const PluginUI = (props: PluginUIProps) => {
  if (props.isLoading) return <Loading />;
  const { urlRequestCallback, code } = props;
  const isEmpty = code === "";
  const [wasCodeCopied, setWasCodeCopied] = useState(false);
  const copyButtonLabel = isEmpty
    ? "No selection"
    : wasCodeCopied
      ? "Copied!"
      : "Copy Figma design";

  const warnings = props.warnings ?? [];

  const handleCopy = () => {
    copy(code);
    setWasCodeCopied(true);
    setTimeout(() => setWasCodeCopied(false), 1000);
  };

  return (
    <div
      data-layer="preview"
      className="Preview bg-neutral-900 flex-col justify-start items-center flex"
    >
      <div
        data-layer="Top bar"
        className="TopBar self-stretch p-6 justify-between items-center inline-flex"
      >
        <div data-svg-wrapper data-layer="logo" className="Logo relative">
          <ToddleLogo />
        </div>
        <Button onClick={() => urlRequestCallback(TODDLE_SIGNUP_URL)}>
          Sign up
        </Button>
      </div>
      <div
        data-layer="instructions"
        className="Instructions self-stretch h-[200px] p-6 border-t border-b border-neutral-800 flex-col justify-start items-start gap-4 flex"
      >
        {[
          "Select frame or element to copy",
          "Click “Copy Figma design”",
          "Paste the code into toddle",
        ].map((text, i) => (
          <Instruction key={text} i={i + 1}>
            {text}
          </Instruction>
        ))}
        <Button
          icon={LinkIcon}
          onClick={() => urlRequestCallback(TODDLE_TUTORIAL_URL)}
        >
          Watch tutorial on YouTube
        </Button>
      </div>
      <div
        data-layer="HTML preview"
        className="HtmlPreview w-[400px] h-[325px] p-6 flex-col justify-center items-center gap-2.5 flex"
      >
        {isEmpty === false && props.htmlPreview ? (
          <Preview htmlPreview={props.htmlPreview} />
        ) : (
          <p className="text-neutral-200">Select frame or element to copy</p>
        )}
        {/* {warnings.length > 0 && (
            <div className="flex flex-col bg-yellow-400 text-black  dark:bg-yellow-500 dark:text-black p-3 w-full">
              <div className="flex flex-row gap-1">
                <div style={{ transform: "translate(2px, 0px) scale(80%)" }}>
                  <WarningIcon />
                </div>
                <h3 className="text-base font-bold">Warnings:</h3>
              </div>
              <ul className="list-disc pl-6">
                {warnings.map((message: string) => (
                  <li className="list-item">
                    <em className="italic text-sm">{message}</em>
                  </li>
                ))}
              </ul>
            </div>
          )} */}
      </div>
      <div
        data-layer="footer"
        className="footer self-stretch p-6 flex-col justify-start items-start gap-2.5 flex"
      >
        <Button
          onClick={handleCopy}
          style="alt"
          success={wasCodeCopied}
          disabled={wasCodeCopied || isEmpty}
        >
          {copyButtonLabel}
        </Button>
      </div>
    </div>
  );
};
