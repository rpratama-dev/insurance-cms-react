import { AnyAaaaRecord } from 'dns';

export type ServerResponse<T extends object> = {
  message: 'Request Success';
  data: T;
  status: 1;
};

declare function handleClose<T extends AnyAaaaRecord>(params: T): void;
interface FormConfig {
  title: string;
  description?: string;
  open: boolean;
  loading: boolean;
  handleClose: () => void;
  handleOK: () => void;
}
