import { Project, Task, CreateProjectRequest, CreateTaskRequest, TaskStatus } from '../types';
import { TaskQueue } from './taskQueue';
export declare class ProjectManager {
    private projects;
    private taskQueue;
    constructor(taskQueue: TaskQueue);
    createProject(request: CreateProjectRequest): Promise<Project>;
    createTask(request: CreateTaskRequest): Promise<Task>;
    getProject(id: string): Project | undefined;
    getAllProjects(): Project[];
    updateTaskStatus(taskId: string, status: TaskStatus, result?: any): void;
    private checkProjectCompletion;
    createSubtasksFromLead(projectId: string, leadAnalysis: string): Promise<void>;
}
//# sourceMappingURL=projectManager.d.ts.map