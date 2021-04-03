export class Future<T> {
  private readonly timeout: number;
  private hasReject?: boolean;
  private hasResolve?: boolean;
  private rejectValue?: any;
  private resolveValue?: T;
  private resolver: (error?: any, value?: T) => void;

  constructor(timeout = 0) {
    this.resolver = () => undefined;
    this.timeout = timeout;
  }

  async getAsync() {
    return await new Promise<T>((resolve, reject) => {
      if (this.hasReject) {
        reject(this.rejectValue);
      } else if (this.hasResolve && typeof this.resolveValue !== 'undefined') {
        resolve(this.resolveValue);
      } else if (this.timeout) {
        setTimeout(reject, this.timeout);
        this.queue(resolve, reject);
      } else {
        this.queue(resolve, reject);
      }
		});
  }

  reject(error: any) {
    if (this.hasReject || this.hasResolve) return;
    this.hasReject = true;
    this.rejectValue = error;
    this.resolver(error);
  }

  resolve(value: T) {
    if (this.hasReject || this.hasResolve) return;
    this.hasResolve = true;
		this.resolveValue = value;
    this.resolver(undefined, value);
  }
  
  private queue(resolve: (value: T) => void, reject: (error?: any) => void) {
    const previousResolver = this.resolver;
    this.resolver = (error, value) => {
      if (error) {
        previousResolver(error);
        reject(error);
      } else {
        previousResolver(error, value);
        resolve(value!);
      }
    };
  }
}
