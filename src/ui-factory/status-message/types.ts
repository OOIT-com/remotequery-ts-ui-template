export declare type StatusMessageStatus = 'success' | 'info' | 'warning' | 'error';
export declare type StatusMessage = {
  status: StatusMessageStatus;
  userMessage?: string;
  systemMessage?: string;
  additionalSystemMessages?: string[];
};
