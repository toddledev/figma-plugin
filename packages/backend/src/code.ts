import { convertNodesToAltNodes } from "./altNodes/altConversion";
import {
  retrieveGenericSolidUIColors,
  retrieveGenericLinearGradients as retrieveGenericGradients,
} from "./common/retrieveUI/retrieveColors";
import { generateHTMLPreview } from "./html/htmlMain";
import { postConversionComplete, postEmptyMessage } from "./messaging";
import { clearWarnings, warnings } from "./common/commonConversionWarnings";
import { Framework, PluginSettings } from "types";
import { convertToCode } from "./common/retrieveUI/convertToCode";

export const run = async (settings: PluginSettings) => {
  clearWarnings();
  const { framework } = settings;
  const selection = figma.currentPage.selection;

  const convertedSelection = convertNodesToAltNodes(selection, null);

  // TODDLE: Always use "Tailwind"
  settings.framework = "Tailwind" as Framework;

  // ignore when nothing was selected
  // If the selection was empty, the converted selection will also be empty.
  if (convertedSelection.length === 0) {
    postEmptyMessage();
    return;
  }

  const code = await convertToCode(convertedSelection, settings);
  const htmlPreview = await generateHTMLPreview(
    convertedSelection,
    settings,
    code,
  );
  const colors = retrieveGenericSolidUIColors(framework);
  const gradients = retrieveGenericGradients(framework);

  postConversionComplete({
    code,
    htmlPreview,
    colors,
    gradients,
    settings,
    warnings: [...warnings],
  });
};
