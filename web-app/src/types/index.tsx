// src/types/index.ts

export type Task = {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: "Low" | "Medium" | "High";
    status: "To Do" | "In Progress" | "Done";
    assignedTo: string;
    createdAt: string;
    recurring: string;
  };
  