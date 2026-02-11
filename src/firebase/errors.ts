export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const message = `Firestore Permission Denied: Cannot ${context.operation} at ${context.path}`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
    // This is to make the error object serializable for the Next.js overlay
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
