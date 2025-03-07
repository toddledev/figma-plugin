import { run, convertIntoNodes, htmlMain, postSettingsChanged } from "backend";
import { htmlCodeGenTextStyles } from "backend/src/html/htmlMain";
import {
  PluginSettings,
  SettingWillChangeMessage,
  URLRequestMessage,
} from "types";

let userPluginSettings: PluginSettings;

const UI_WIDTH = 384;
const UI_HEIGHT = 706;

export const defaultPluginSettings: PluginSettings = {
  framework: "HTML",
  jsx: false,
  optimizeLayout: false,
  showLayerNames: false,
  inlineStyle: true,
  responsiveRoot: false,
  flutterGenerationMode: "snippet",
  swiftUIGenerationMode: "snippet",
  roundTailwindValues: false,
  roundTailwindColors: false,
  customTailwindColors: false,
  customTailwindPrefix: "",
  embedImages: false,
};

// A helper type guard to ensure the key belongs to the PluginSettings type
function isKeyOfPluginSettings(key: string): key is keyof PluginSettings {
  return key in defaultPluginSettings;
}

const getUserSettings = async () => {
  const possiblePluginSrcSettings =
    (await figma.clientStorage.getAsync("userPluginSettings")) ?? {};

  const updatedPluginSrcSettings = {
    ...defaultPluginSettings,
    ...Object.keys(defaultPluginSettings).reduce((validSettings, key) => {
      if (
        isKeyOfPluginSettings(key) &&
        key in possiblePluginSrcSettings &&
        typeof possiblePluginSrcSettings[key] ===
          typeof defaultPluginSettings[key]
      ) {
        validSettings[key] = possiblePluginSrcSettings[key] as any;
      }
      return validSettings;
    }, {} as Partial<PluginSettings>),
  };

  userPluginSettings = updatedPluginSrcSettings as PluginSettings;
};

const initSettings = async () => {
  await getUserSettings();
  postSettingsChanged(userPluginSettings);
  safeRun(userPluginSettings);
};

// Used to prevent running from happening again.
let isLoading = false;
const safeRun = async (settings: PluginSettings) => {
  if (isLoading === false) {
    try {
      isLoading = true;
      await run(settings);
      // hack to make it not immediately set to false when complete. (executes on next frame)
      setTimeout(() => {
        isLoading = false;
      }, 50);
    } catch (e) {
      if (e && typeof e === "object" && "message" in e) {
        const error = e as Error;
        console.log("error: ", error.stack);
        figma.ui.postMessage({ type: "error", error: error.message });
      }
    }
  }
};

const standardMode = async () => {
  figma.showUI(__html__, {
    width: UI_WIDTH,
    height: UI_HEIGHT,
    themeColors: false,
  });
  await initSettings();

  // Listen for selection changes
  figma.on("selectionchange", () => {
    safeRun(userPluginSettings);
  });

  // Listen for document changes
  figma.on("documentchange", () => {
    // Node: This was causing an infinite load when you try to export a background image from a group that contains children.
    // The reason for this is that the code will temporarily hide the children of the group in order to export a clean image
    // then restores the visibility of the children. This constitutes a document change so it's restarting the whole conversion.
    // In order to stop this, we disable safeRun() when doing conversions (while isLoading === true).
    safeRun(userPluginSettings);
  });

  figma.ui.onmessage = (msg) => {
    console.log("[node] figma.ui.onmessage", msg);

    if (msg.type === "pluginSettingWillChange") {
      const { key, value } = msg as SettingWillChangeMessage<unknown>;
      (userPluginSettings as any)[key] = value;
      figma.clientStorage.setAsync("userPluginSettings", userPluginSettings);
      safeRun(userPluginSettings);
    }

    if (msg.type === "urlRequest") {
      const { url } = msg as URLRequestMessage;
      figma.notify("Opening URL...");
      figma.openExternal(url);
    }
  };
};

const codegenMode = async () => {
  // figma.showUI(__html__, { visible: false });
  await getUserSettings();

  figma.codegen.on(
    "generate",
    async ({ language, node }: CodegenEvent): Promise<CodegenResult[]> => {
      const convertedSelection = convertIntoNodes([node], null);

      if (language === "html") {
        return [
          {
            title: "Code",
            code: await htmlMain(
              convertedSelection,
              { ...userPluginSettings, jsx: false },
              true,
            ),
            language: "HTML",
          },
          {
            title: `Text Styles`,
            code: htmlCodeGenTextStyles(userPluginSettings),
            language: "HTML",
          },
        ] as CodegenResult[];
      }

      const blocks: CodegenResult[] = [];
      return blocks;
    },
  );
};

switch (figma.mode) {
  case "default":
  case "inspect":
    standardMode();
    break;
  case "codegen":
    codegenMode();
    break;
  default:
    break;
}
