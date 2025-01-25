import {
  Message,
  SettingWillChangeMessage,
  UIMessage,
  URLRequestMessage,
} from "types";

if (!parent || !parent.postMessage) {
  throw new Error("parent.postMessage() is not defined");
}
const postMessage = (message: UIMessage, options?: WindowPostMessageOptions) =>
  parent.postMessage(message, options);

export const postUIMessage = (
  message: Message,
  options?: WindowPostMessageOptions,
) => postMessage({ pluginMessage: message }, options);

export const postUISettingsChangingMessage = <T>(
  key: string,
  value: T,
  options?: WindowPostMessageOptions,
) => {
  const message: SettingWillChangeMessage<T> = {
    type: "pluginSettingWillChange",
    key,
    value,
  };
  postUIMessage(message, options);
};

export const postUrlRequest = (
  url: string,
  options: WindowPostMessageOptions = {
    targetOrigin: "*",
  },
) => {
  const message: URLRequestMessage = {
    type: "urlRequest",
    url,
  };
  postUIMessage(message, options);
};
