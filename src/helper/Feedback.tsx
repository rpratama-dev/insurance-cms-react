import { message } from 'antd';

export const openLoadingMessage = (key: string, msg?: string): void => {
  message.loading({ content: msg || 'Please wait...', key, duration: 0 });
};

export const openSuccessMessage = (key: string, msg?: string): void => {
  message.success({ content: msg || 'Success...', key, duration: 4 });
};

export const openWarningMessage = (key: string, msg?: string): void => {
  message.warning({ content: msg || 'Opss.. something wrong!!', key, duration: 4 });
};

export const destroyMessage = (key: string): void => {
  message.destroy(key);
};
