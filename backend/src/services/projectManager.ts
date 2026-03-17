import { v4 as uuidv4 } from 'uuid';
import { Project, Task, CreateProjectRequest, CreateTaskRequest, TaskStatus, AgentRole } from '../types';
import { TaskQueue } from './taskQueue';

export class ProjectManager {
  private projects: Map<string, Project> = new Map();
  private taskQueue: TaskQueue;

  constructor(taskQueue: TaskQueue) {
    this.taskQueue = taskQueue;
  }

  async createProject(request: CreateProjectRequest): Promise<Project> {
    const project: Project = {
      id: uuidv4(),
      name: request.name,
      description: request.description,
      documentation: request.documentation,
      status: 'planning',
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.projects.set(project.id, project);

    await this.createTask({
      projectId: project.id,
      title: 'Analizar documentación del proyecto',
      description: `Analiza la siguiente documentación y crea un plan de trabajo:\n\n${request.documentation}`,
      assignedTo: 'lead',
      requiresApproval: true
    });

    return project;
  }

  async createTask(request: CreateTaskRequest): Promise<Task> {
    const project = this.projects.get(request.projectId);
    if (!project) {
      throw new Error(`Proyecto no encontrado: ${request.projectId}`);
    }

    const task: Task = {
      id: uuidv4(),
      projectId: request.projectId,
      title: request.title,
      description: request.description,
      assignedTo: request.assignedTo,
      status: 'pending',
      dependencies: request.dependencies || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      requiresApproval: request.requiresApproval || false
    };

    project.tasks.push(task);
    project.updatedAt = new Date();

    await this.taskQueue.addTask(task);

    return task;
  }

  getProject(id: string): Project | undefined {
    return this.projects.get(id);
  }

  getAllProjects(): Project[] {
    return Array.from(this.projects.values());
  }

  updateTaskStatus(taskId: string, status: TaskStatus, result?: any): void {
    for (const project of this.projects.values()) {
      const task = project.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = status;
        task.updatedAt = new Date();
        
        if (status === 'completed') {
          task.completedAt = new Date();
          task.result = result;
          this.checkProjectCompletion(project);
        }
        
        break;
      }
    }
  }

  private checkProjectCompletion(project: Project): void {
    const allCompleted = project.tasks.every(t => t.status === 'completed');
    const hasFailed = project.tasks.some(t => t.status === 'failed');

    if (allCompleted) {
      project.status = 'completed';
    } else if (hasFailed) {
      project.status = 'failed';
    }
    
    project.updatedAt = new Date();
  }

  async createSubtasksFromLead(projectId: string, leadAnalysis: string): Promise<void> {
    const project = this.projects.get(projectId);
    if (!project) return;

    const subtasks: CreateTaskRequest[] = [
      {
        projectId,
        title: 'Diseñar arquitectura de base de datos',
        description: 'Crear esquema de base de datos y migraciones',
        assignedTo: 'backend',
        requiresApproval: false
      },
      {
        projectId,
        title: 'Implementar API REST',
        description: 'Crear endpoints CRUD para el recurso principal',
        assignedTo: 'backend',
        requiresApproval: false
      },
      {
        projectId,
        title: 'Crear componentes de UI',
        description: 'Implementar formularios y listados en React',
        assignedTo: 'frontend',
        requiresApproval: false
      },
      {
        projectId,
        title: 'Escribir post de lanzamiento',
        description: 'Crear contenido para LinkedIn sobre el proyecto',
        assignedTo: 'content',
        requiresApproval: true
      },
      {
        projectId,
        title: 'Revisar código y seguridad',
        description: 'Auditar implementación para bugs y vulnerabilidades',
        assignedTo: 'qa',
        requiresApproval: false
      }
    ];

    for (const subtask of subtasks) {
      await this.createTask(subtask);
    }

    project.status = 'in_progress';
    project.updatedAt = new Date();
  }
}
