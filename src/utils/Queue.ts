export class Queue {
  private tasks: (() => Promise<void>)[];

  constructor() {
      this.tasks = [];
  }

  public enqueue(task: () => Promise<void>): void {
      this.tasks.push(task);
  }

  public async execute(): Promise<void> {
      while (this.tasks.length > 0) {
          const task = this.tasks.shift();
          try {
              await task!();
              return;
          } catch (error) {
              // Continue with the next task if one fails
          }
      }
  }
}