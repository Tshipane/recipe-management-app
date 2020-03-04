import {LastOperation} from './enum/last-operation';

export class PostResult {
  success = false;
  errors: string[] = [];
  lastOperation: LastOperation = null;
}
